import os
import re
import uuid
import random
import mysql.connector

# -----------------------------------------------------------------------------
# 1. Parse Database Configuration from spring application.properties
# -----------------------------------------------------------------------------
def get_db_config():
    # Default fallback values
    config = {
        "host": "localhost",
        "port": 3306,
        "database": "apgov",
        "user": "root",
        "password": "Start#123"
    }
    
    properties_path = os.path.join("be", "src", "main", "resources", "application.properties")
    if os.path.exists(properties_path):
        try:
            with open(properties_path, "r") as f:
                content = f.read()
                
            # Extract database URL
            url_match = re.search(r"spring\.datasource\.url\s*=\s*jdbc:mysql://([^:/]+):?(\d*)/([^?]+)", content)
            if url_match:
                config["host"] = url_match.group(1)
                port_val = url_match.group(2)
                config["port"] = int(port_val) if port_val else 3306
                config["database"] = url_match.group(3)
                
            # Extract username
            user_match = re.search(r"spring\.datasource\.username\s*=\s*(.*)", content)
            if user_match:
                config["user"] = user_match.group(1).strip()
                
            # Extract password
            pass_match = re.search(r"spring\.datasource\.password\s*=\s*(.*)", content)
            if pass_match:
                config["password"] = pass_match.group(1).strip()
                
            print(f"[Config] Loaded connection settings from application.properties.")
            print(f"[Config] Host: {config['host']}:{config['port']} | Database: {config['database']} | User: {config['user']}")
        except Exception as e:
            print(f"[Warning] Failed to parse application.properties: {e}. Using defaults.")
    else:
        print("[Config] application.properties not found. Using default connection settings.")
        
    return config

# -----------------------------------------------------------------------------
# 2. Mock Data Dictionaries
# -----------------------------------------------------------------------------
VILLAGES = [
    "Ramachandrapuram", "Draksharama", "Chelluru", "Vemulavada", "Someswaram",
    "Venturu", "K. Gangavaram", "Kapileswarapuram", "Vegayammapeta", "Dangeru",
    "Oduru", "Vilasa", "Masakapalli", "Machara", "Angara",
    "Kota", "Balabhadrapuram", "Yaditha", "Z. Medapadu", "Hasanbada",
    "Lolla", "Mandapeta", "Alamuru", "Jonnada", "Penikeru",
    "Ravulapalem", "Gopalapuram", "Tatipaka", "Ryali", "Merlapalem"
]

FIRST_NAMES = [
    "Rajesh", "Venkat", "Sai", "Lakshmi", "Satish", "Ravi", "Durga", "Rama", 
    "Krishna", "Srinivas", "Suresh", "Naidu", "Subba", "Bhaskar", "Anantha",
    "Chandra", "Mohan", "Prasad", "Surya", "Venkata", "Kiran", "Madhav",
    "Saritha", "Padma", "Anitha", "Priya", "Geetha", "Sujatha", "Sandhya", "Radha"
]

LAST_NAMES = [
    "Rao", "Reddy", "Balusu", "Raju", "Varma", "Murthy", "Prasad", "Sastry",
    "Choudhary", "Naidu", "Koppula", "Ganti", "Yerra", "Palla", "Nethi",
    "Katta", "Bhimuni", "Dwarampudi", "Kovvuri", "Sathi", "Vanka", "Nalla"
]

CATEGORIES = ["Road", "Water", "Electricity", "Health", "Education", "Environment"]
URGENCIES = ["Low", "Medium", "High"]
STATUSES = ["Pending", "Acknowledged", "EnRoute", "Visited", "Resolved"]

ISSUE_TEMPLATES = {
    "Road": {
        "title": "Potholes and road damage on main street in {village}",
        "desc": "The main road passing through {village} has developed deep potholes over the last few weeks. It has become extremely dangerous for two-wheelers, especially during night hours. Action is required to patch these holes before accidents occur."
    },
    "Water": {
        "title": "Drinking water contamination and leakage in {village}",
        "desc": "Residents of {village} are receiving muddy and foul-smelling drinking water for the past four days. There appears to be a pipeline breach near the local school where drainage water is mixing with the supply. Please inspect and repair immediately."
    },
    "Electricity": {
        "title": "Frequent power fluctuations and transformer sparks in {village}",
        "desc": "The local transformer in {village} has been sparking intermittently under heavy load. We are experiencing severe voltage fluctuations which are damaging household appliances. A technician needs to inspect the load distribution."
    },
    "Health": {
        "title": "Sanitation issues and mosquito breeding in {village} drains",
        "desc": "The open drains in {village} are completely clogged with plastic waste and stagnant water, leading to a massive rise in mosquitoes. Cases of viral fever are rising rapidly in the community. Emergency spraying and drain cleaning are needed."
    },
    "Education": {
        "title": "Roof leakage in primary school building in {village}",
        "desc": "The roof of the local government primary school building in {village} is leaking severely during rainfall. Children are unable to sit in the classrooms. Temporary repairs are needed immediately before the heavy monsoons start."
    },
    "Environment": {
        "title": "Illegal garbage dumping in public pond area of {village}",
        "desc": "Commercial wastes and plastic trash are being dumped illegally near the public pond in {village}. This is polluting the local groundwater source and creating an unbearable stench. We request fencing and warning signs."
    }
}

# -----------------------------------------------------------------------------
# 3. Main Ingestion Logic
# -----------------------------------------------------------------------------
def populate_data():
    db_config = get_db_config()
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        print("[DB] Connection established successfully.")
    except Exception as e:
        print(f"[Error] Database connection failed: {e}")
        print("Please check that MySQL is running and your database schema is created.")
        return

    # 1. Clean up existing records
    print("[DB] Cleaning up existing tables...")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    
    # Dynamically check if 'wards' table exists to support older schemas
    cursor.execute("SHOW TABLES LIKE 'wards'")
    has_wards_table = cursor.fetchone() is not None
    
    tables = [
        "grievance_timelines", "grievance_attachments", "grievance_assignments",
        "grievances", "field_officer_profiles", "users", "villages", "mandals", "constituencies"
    ]
    if has_wards_table:
        tables.insert(0, "wards")
        
    for table in tables:
        cursor.execute(f"TRUNCATE TABLE {table};")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
    conn.commit()

    # 2. Insert 1 Constituency (Ramachandrapuram)
    constituency_id = str(uuid.uuid4())
    constituency_name = "Ramachandrapuram"
    district_name = "Konaseema"
    
    # Simple rectangular polygon representing the constituency boundary
    const_poly = "MULTIPOLYGON(((82.00 16.80, 82.00 17.00, 82.20 17.00, 82.20 16.80, 82.00 16.80)))"
    
    print(f"[DB] Inserting Constituency: {constituency_name}...")
    cursor.execute(
        "INSERT INTO constituencies (id, name, district, boundary) VALUES (%s, %s, %s, ST_GeomFromText(%s, 4326))",
        (constituency_id, constituency_name, district_name, const_poly)
    )
    conn.commit()

    # 2.5 Insert 5 Mandals for Ramachandrapuram
    mandal_names = ["Ramachandrapuram", "Draksharama", "Chelluru", "Vemulavada", "Someswaram"]
    mandal_ids = []
    print(f"[DB] Inserting 5 Mandals...")
    for m_name in mandal_names:
        m_id = str(uuid.uuid4())
        mandal_ids.append(m_id)
        cursor.execute(
            "INSERT INTO mandals (id, constituency_id, name) VALUES (%s, %s, %s)",
            (m_id, constituency_id, m_name)
        )
    conn.commit()

    # 3. Insert 30 Villages
    print(f"[DB] Inserting 30 villages of {constituency_name}...")
    village_ids = []
    for index, village_name in enumerate(VILLAGES):
        v_id = str(uuid.uuid4())
        village_ids.append(v_id)
        
        # Sub-polygon for each village offset slightly
        lat_offset = (index // 6) * 0.03
        lon_offset = (index % 6) * 0.03
        lon1 = round(82.00 + lon_offset, 4)
        lat1 = round(16.80 + lat_offset, 4)
        lon2 = round(82.02 + lon_offset, 4)
        lat2 = round(16.82 + lat_offset, 4)
        
        # Valid WKT POLYGON has two nested parentheses: POLYGON((x1 y1, x2 y2, ...))
        v_poly = f"POLYGON(({lon1} {lat1}, {lon1} {lat2}, {lon2} {lat2}, {lon2} {lat1}, {lon1} {lat1}))"
        
        # Assign to one of the 5 mandals (6 villages per mandal)
        mandal_id = mandal_ids[index // 6]
        cursor.execute(
            "INSERT INTO villages (id, constituency_id, mandal_id, name, boundary) VALUES (%s, %s, %s, %s, ST_GeomFromText(%s, 4326))",
            (v_id, constituency_id, mandal_id, village_name, v_poly)
        )
    conn.commit()

    # 4. Insert 1 MLA User
    mla_id = str(uuid.uuid4())
    print(f"[DB] Inserting MLA User for {constituency_name}...")
    cursor.execute(
        "INSERT INTO users (id, employee_id, sso_uid, first_name, last_name, phone, role, constituency_id) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (mla_id, "EMP-MLA001", f"SSO-MLA-{uuid.uuid4()}", "Vasusu", "Balusu", "+919999999999", "mla", constituency_id)
    )
    conn.commit()

    # 5. Insert 20 Field Officers and Profiles
    print("[DB] Inserting 20 Field Officers & Profiles...")
    for i in range(1, 21):
        fo_user_id = str(uuid.uuid4())
        phone_num = f"+9188888{str(i).zfill(5)}"
        emp_id = f"EMP-FO{str(i).zfill(3)}"
        sso_uid = f"SSO-FO-{uuid.uuid4()}"
        first = f"OfficerFirst {i}"
        last = f"OfficerLast {i}"
        
        cursor.execute(
            "INSERT INTO users (id, employee_id, sso_uid, first_name, last_name, phone, role, constituency_id) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (fo_user_id, emp_id, sso_uid, first, last, phone_num, "fieldofficer", constituency_id)
        )
        
        fo_profile_id = str(uuid.uuid4())
        active_wards_json = '["Ward 1", "Ward 2", "Ward 3"]'
        cursor.execute(
            "INSERT INTO field_officer_profiles (id, user_id, designation, assigned_constituency_id, active_zone_wards) "
            "VALUES (%s, %s, %s, %s, %s)",
            (fo_profile_id, fo_user_id, "Village Development Officer", constituency_id, active_wards_json)
        )
    conn.commit()

    # 6. Insert 10,000 Citizens (Using fast batch inserts for high performance)
    print("[DB] Generating 10,000 citizens...")
    citizen_ids = []
    batch_size = 1000
    batch_data = []
    
    for i in range(1, 10001):
        citizen_id = str(uuid.uuid4())
        citizen_ids.append(citizen_id)
        
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        phone_num = f"+9177{str(i).zfill(8)}"
        sso_uid = f"SSO-CITIZEN-{i}-{uuid.uuid4()}"
        
        batch_data.append((
            citizen_id, None, sso_uid, first, last, phone_num, "citizen", constituency_id
        ))
        
        if len(batch_data) == batch_size:
            cursor.executemany(
                "INSERT INTO users (id, employee_id, sso_uid, first_name, last_name, phone, role, constituency_id) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                batch_data
            )
            conn.commit()
            print(f"  Inserted {i} / 10000 citizens...")
            batch_data = []
            
    if batch_data:
        cursor.executemany(
            "INSERT INTO users (id, employee_id, sso_uid, first_name, last_name, phone, role, constituency_id) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            batch_data
        )
        conn.commit()
        print("  Inserted 10000 / 10000 citizens.")

    # 7. Check table metadata to support both old/hybrid and new schemas dynamically
    cursor.execute("DESCRIBE grievances")
    grievance_cols = [row[0] for row in cursor.fetchall()]
    has_location_gps = "location_gps" in grievance_cols
    has_ward_id = "ward_id" in grievance_cols
    
    print(f"[DB] Schema detection: 'location_gps' exists: {has_location_gps} | 'ward_id' exists: {has_ward_id}")
    
    # Generate dummy wards if the old schema's 'ward_id' column is present in the grievances table
    village_ward_map = {}
    if has_ward_id:
        print("[DB] Generating dummy wards for backward compatibility...")
        for v_id in village_ids:
            ward_id = str(uuid.uuid4())
            cursor.execute(
                "INSERT INTO wards (id, village_id, code) VALUES (%s, %s, %s)",
                (ward_id, v_id, "WARD-01")
            )
            village_ward_map[v_id] = ward_id
        conn.commit()

    # 8. Insert 1 or 2 Grievances per Village (assigned to random citizens)
    print("[DB] Generating 1-2 issues per village...")
    grievance_count = 1
    
    for v_idx, village_id in enumerate(village_ids):
        village_name = VILLAGES[v_idx]
        issues_to_create = random.randint(1, 2)
        
        for _ in range(issues_to_create):
            g_id = str(uuid.uuid4())
            ref_code = f"GRV-RND-{uuid.uuid4().hex[:8].upper()}"
            random_citizen_id = random.choice(citizen_ids)
            category = random.choice(CATEGORIES)
            urgency = random.choice(URGENCIES)
            status = random.choice(STATUSES)
            
            # Retrieve templates matching the category
            template = ISSUE_TEMPLATES[category]
            title = template["title"].format(village=village_name)
            desc = template["desc"].format(village=village_name)
            
            # Dynamically build insert columns and values to support old and new schemas
            fields = ["id", "reference_code", "citizen_id", "category", "title", "description", "constituency_id", "village_id", "urgency", "status"]
            placeholders = ["%s"] * len(fields)
            values = [g_id, ref_code, random_citizen_id, category, title, desc, constituency_id, village_id, urgency, status]
            
            if has_location_gps:
                fields.append("location_gps")
                placeholders.append("ST_GeomFromText('POINT(82.0 16.8)', 4326)")
                
            if has_ward_id:
                fields.append("ward_id")
                placeholders.append("%s")
                values.append(village_ward_map[village_id])
                
            sql = f"INSERT INTO grievances ({', '.join(fields)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(sql, tuple(values))
            grievance_count += 1
            
    conn.commit()
    print(f"[DB] Inserted {grievance_count - 1} issues across 30 villages.")
    
    # Close connections
    cursor.close()
    conn.close()
    print("\n[DB] Dummy data generation completed successfully.")

if __name__ == "__main__":
    populate_data()
