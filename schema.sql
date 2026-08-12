-- 1. Constituencies Table
CREATE TABLE constituencies (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    district VARCHAR(100) NOT NULL,
    boundary MULTIPOLYGON SRID 4326 NOT NULL
);

-- 2. Mandals Table
CREATE TABLE mandals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    constituency_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_mandal_constituency FOREIGN KEY (constituency_id) REFERENCES constituencies(id) ON DELETE CASCADE,
    CONSTRAINT uq_mandal_constituency UNIQUE (id, constituency_id)
);

-- 3. Villages Table
CREATE TABLE villages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    constituency_id VARCHAR(36) NOT NULL,
    mandal_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    boundary POLYGON SRID 4326 NOT NULL,
    CONSTRAINT fk_village_constituency FOREIGN KEY (constituency_id) REFERENCES constituencies(id) ON DELETE CASCADE,
    CONSTRAINT fk_village_mandal FOREIGN KEY (mandal_id, constituency_id) REFERENCES mandals(id, constituency_id) ON DELETE RESTRICT,
    CONSTRAINT uq_village_constituency UNIQUE (id, constituency_id)
);

-- 3. Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id VARCHAR(50) UNIQUE,
    sso_uid VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL CHECK (role IN ('citizen', 'fieldofficer', 'mla', 'coordinator')),
    constituency_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_constituency FOREIGN KEY (constituency_id) REFERENCES constituencies(id) ON DELETE SET NULL
);

-- 4. Field Officer Profiles Table
CREATE TABLE field_officer_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL UNIQUE,
    designation VARCHAR(100),
    assigned_constituency_id VARCHAR(36) NOT NULL,
    active_zone_wards JSON,
    CONSTRAINT fk_foprofile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_foprofile_constituency FOREIGN KEY (assigned_constituency_id) REFERENCES constituencies(id) ON DELETE RESTRICT,
    CONSTRAINT uq_fo_constituency UNIQUE (id, assigned_constituency_id)
);

-- 5. Grievances Table
CREATE TABLE grievances (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reference_code VARCHAR(50) NOT NULL UNIQUE,
    citizen_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Road', 'Water', 'Electricity', 'Health', 'Education', 'Environment')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    constituency_id VARCHAR(36) NOT NULL,
    village_id VARCHAR(36) NOT NULL,
    urgency VARCHAR(10) NOT NULL CHECK (urgency IN ('Low', 'Medium', 'High')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('Pending', 'Acknowledged', 'EnRoute', 'Visited', 'Resolved', 'Escalated', 'Withdrawn')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_grievance_citizen FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_grievance_village FOREIGN KEY (village_id, constituency_id) REFERENCES villages(id, constituency_id) ON DELETE RESTRICT,
    CONSTRAINT uq_grievance_constituency UNIQUE (id, constituency_id)
);

-- 6. Grievance Assignments Table
CREATE TABLE grievance_assignments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    grievance_id VARCHAR(36) NOT NULL UNIQUE,
    constituency_id VARCHAR(36) NOT NULL,
    field_officer_id VARCHAR(36) NOT NULL,
    stop_sequence INT NOT NULL CHECK (stop_sequence > 0),
    assignment_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('Pending', 'EnRoute', 'Visited', 'Resolved')),
    checked_in_at TIMESTAMP NULL DEFAULT NULL,
    field_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignment_grievance FOREIGN KEY (grievance_id, constituency_id) REFERENCES grievances(id, constituency_id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_officer FOREIGN KEY (field_officer_id, constituency_id) REFERENCES field_officer_profiles(id, assigned_constituency_id) ON DELETE RESTRICT
);

-- 7. Grievance Attachments Table
CREATE TABLE grievance_attachments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    grievance_id VARCHAR(36) NOT NULL,
    uploader_role VARCHAR(20) NOT NULL CHECK (uploader_role IN ('citizen', 'fieldofficer')),
    storage_url VARCHAR(1024) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_grievance FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE
);

-- 8. Grievance Timelines Table
CREATE TABLE grievance_timelines (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    grievance_id VARCHAR(36) NOT NULL,
    action_status VARCHAR(30) NOT NULL,
    actor_user_id VARCHAR(36) NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_timeline_grievance FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    CONSTRAINT fk_timeline_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Spatial Indices for MySQL GIS geometries
CREATE SPATIAL INDEX idx_constituencies_boundary ON constituencies (boundary);
CREATE SPATIAL INDEX idx_villages_boundary ON villages (boundary);

-- Standard & Compound Indexes for Government Scale Query Performance (100k DAU)
CREATE INDEX idx_grievances_status_urgency ON grievances (status, urgency);
CREATE INDEX idx_grievances_constituency ON grievances (constituency_id);
CREATE INDEX idx_grievances_citizen_created ON grievances (citizen_id, created_at DESC);
CREATE INDEX idx_grievances_const_status_urgency ON grievances (constituency_id, status, urgency, created_at DESC);
CREATE INDEX idx_grievances_village_status ON grievances (village_id, status);
CREATE INDEX idx_grievance_assignments_dispatch ON grievance_assignments (field_officer_id, assignment_date, stop_sequence);
CREATE INDEX idx_users_phone_role ON users (phone, role);

