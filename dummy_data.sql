DELIMITER //

CREATE PROCEDURE PopulateDummyData()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE const_id VARCHAR(36);
    DECLARE mla_id VARCHAR(36);
    DECLARE officer_user_id VARCHAR(36);
    DECLARE officer_profile_id VARCHAR(36);
    DECLARE citizen_user_id VARCHAR(36);
    DECLARE village_id_val VARCHAR(36);
    DECLARE random_citizen_id VARCHAR(36);
    DECLARE v_count INT DEFAULT 1;
    DECLARE g_count INT DEFAULT 1;
    DECLARE issues_to_create INT;
    DECLARE k INT;
    DECLARE rand_category VARCHAR(50);
    DECLARE rand_urgency VARCHAR(10);
    DECLARE rand_status VARCHAR(30);
    DECLARE mandal_1_id VARCHAR(36);
    DECLARE mandal_2_id VARCHAR(36);
    DECLARE mandal_3_id VARCHAR(36);
    DECLARE mandal_4_id VARCHAR(36);
    DECLARE mandal_5_id VARCHAR(36);

    -- Clean up existing data to avoid conflicts
    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE TABLE grievance_timelines;
    TRUNCATE TABLE grievance_attachments;
    TRUNCATE TABLE grievance_assignments;
    TRUNCATE TABLE grievances;
    TRUNCATE TABLE field_officer_profiles;
    TRUNCATE TABLE users;
    TRUNCATE TABLE villages;
    TRUNCATE TABLE mandals;
    TRUNCATE TABLE constituencies;
    SET FOREIGN_KEY_CHECKS = 1;

    -- 1. Insert 1 Constituency (with polygon boundary for map rendering)
    SET const_id = UUID();
    INSERT INTO constituencies (id, name, district, boundary)
    VALUES (
        const_id,
        'Kuppam',
        'Chittoor',
        ST_GeomFromText('MULTIPOLYGON(((81.0 16.0, 81.0 16.5, 81.5 16.5, 81.5 16.0, 81.0 16.0)))', 4326)
    );

    -- 2. Insert 5 Mandals
    SET mandal_1_id = UUID();
    SET mandal_2_id = UUID();
    SET mandal_3_id = UUID();
    SET mandal_4_id = UUID();
    SET mandal_5_id = UUID();

    INSERT INTO mandals (id, constituency_id, name) VALUES
    (mandal_1_id, const_id, 'Kuppam'),
    (mandal_2_id, const_id, 'Ramagiri'),
    (mandal_3_id, const_id, 'Gudupalli'),
    (mandal_4_id, const_id, 'Venkatapur'),
    (mandal_5_id, const_id, 'Bethampudi');

    -- 3. Insert 30 Villages (each with polygon boundary for map rendering)
    WHILE v_count <= 30 DO
        INSERT INTO villages (id, constituency_id, mandal_id, name, boundary)
        VALUES (
            UUID(),
            const_id,
            CASE
                WHEN v_count <= 6 THEN mandal_1_id
                WHEN v_count <= 12 THEN mandal_2_id
                WHEN v_count <= 18 THEN mandal_3_id
                WHEN v_count <= 24 THEN mandal_4_id
                ELSE mandal_5_id
            END,
            CONCAT('Village ', v_count),
            ST_GeomFromText('POLYGON(((81.0 16.0, 81.0 16.1, 81.1 16.1, 81.1 16.0, 81.0 16.0)))', 4326)
        );
        SET v_count = v_count + 1;
    END WHILE;

    -- 3. Insert 1 MLA User
    SET mla_id = UUID();
    INSERT INTO users (id, employee_id, sso_uid, first_name, last_name, phone, role, constituency_id)
    VALUES (
        mla_id,
        'EMP-MLA001',
        CONCAT('SSO-MLA-', UUID()),
        'Chandrababu',
        'Naidu',
        '+919999999999',
        'mla',
        const_id
    );

    -- 4. Insert 20 Field Officer Users and Profiles
    SET i = 1;
    WHILE i <= 20 DO
        SET officer_user_id = UUID();
        INSERT INTO users (id, employee_id, sso_uid, first_name, last_name, phone, role, constituency_id)
        VALUES (
            officer_user_id,
            CONCAT('EMP-FO', LPAD(i, 3, '0')),
            CONCAT('SSO-FO-', UUID()),
            CONCAT('OfficerFirst ', i),
            CONCAT('OfficerLast ', i),
            CONCAT('+9188888', LPAD(i, 5, '0')),
            'fieldofficer',
            const_id
        );

        INSERT INTO field_officer_profiles (id, user_id, designation, assigned_constituency_id, active_zone_wards)
        VALUES (
            UUID(),
            officer_user_id,
            'Village Development Officer',
            const_id,
            '["Ward 1", "Ward 2", "Ward 3"]'
        );
        SET i = i + 1;
    END WHILE;

    -- 5. Insert 10,000 Citizen Users
    SET i = 1;
    WHILE i <= 10000 DO
        INSERT INTO users (id, employee_id, sso_uid, first_name, last_name, phone, role, constituency_id)
        VALUES (
            UUID(),
            NULL,
            CONCAT('SSO-CITIZEN-', i, '-', UUID()),
            CONCAT('CitizenFirst', i),
            CONCAT('CitizenLast', i),
            CONCAT('+9177', LPAD(i, 8, '0')),
            'citizen',
            const_id
        );
        SET i = i + 1;
    END WHILE;

    -- 6. Insert 1 or 2 issues (grievances) per village
    BEGIN
        DECLARE done INT DEFAULT FALSE;
        DECLARE cur_village_id VARCHAR(36);
        DECLARE village_cursor CURSOR FOR SELECT id FROM villages;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

        OPEN village_cursor;

        read_loop: LOOP
            FETCH village_cursor INTO cur_village_id;
            IF done THEN
                LEAVE read_loop;
            END IF;

            -- Randomly create 1 or 2 issues
            SET issues_to_create = FLOOR(1 + (RAND() * 2));
            SET k = 1;

            WHILE k <= issues_to_create DO
                -- Select a random citizen from the 10,000 citizen users
                SELECT id INTO random_citizen_id FROM users WHERE role = 'citizen' ORDER BY RAND() LIMIT 1;

                -- Randomize Category
                SET rand_category = CASE FLOOR(1 + (RAND() * 6))
                    WHEN 1 THEN 'Road'
                    WHEN 2 THEN 'Water'
                    WHEN 3 THEN 'Electricity'
                    WHEN 4 THEN 'Health'
                    WHEN 5 THEN 'Education'
                    ELSE 'Environment'
                END;

                -- Randomize Urgency
                SET rand_urgency = CASE FLOOR(1 + (RAND() * 3))
                    WHEN 1 THEN 'Low'
                    WHEN 2 THEN 'Medium'
                    ELSE 'High'
                END;

                -- Randomize Status
                SET rand_status = CASE FLOOR(1 + (RAND() * 5))
                    WHEN 1 THEN 'Pending'
                    WHEN 2 THEN 'Acknowledged'
                    WHEN 3 THEN 'EnRoute'
                    WHEN 4 THEN 'Visited'
                    ELSE 'Resolved'
                END;

                INSERT INTO grievances (id, reference_code, citizen_id, category, title, description, constituency_id, village_id, urgency, status)
                VALUES (
                    UUID(),
                    CONCAT('GRV-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(g_count, 6, '0')),
                    random_citizen_id,
                    rand_category,
                    CONCAT('Issue regarding ', rand_category, ' at ', (SELECT name FROM villages WHERE id = cur_village_id)),
                    CONCAT('This is a detailed description of the ', LOWER(rand_category), ' problem reported in this village. Urgent action is requested.'),
                    const_id,
                    cur_village_id,
                    rand_urgency,
                    rand_status
                );

                SET g_count = g_count + 1;
                SET k = k + 1;
            END WHILE;
        END LOOP;

        CLOSE village_cursor;
    END;

END //

DELIMITER ;

-- Execute the procedure to populate the database
CALL PopulateDummyData();

-- Drop the procedure after execution to clean up the database structure
DROP PROCEDURE PopulateDummyData;
