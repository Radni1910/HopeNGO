-- ============================================
--  NGO MANAGEMENT SYSTEM - Database Setup SQL
--  Run this in MySQL Workbench or CLI
-- ============================================

CREATE DATABASE IF NOT EXISTS ngo_management;
USE ngo_management;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
    donor_id    INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100),
    phone       VARCHAR(15) NOT NULL,
    address     VARCHAR(255)
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    donation_id   INT PRIMARY KEY AUTO_INCREMENT,
    donor_id      INT NOT NULL,
    amount        DOUBLE NOT NULL,
    donation_date DATE NOT NULL,
    purpose       VARCHAR(100),
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE
);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    volunteer_id  INT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100),
    phone         VARCHAR(15),
    assigned_work VARCHAR(100)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    event_id    INT PRIMARY KEY AUTO_INCREMENT,
    event_name  VARCHAR(100) NOT NULL,
    event_date  DATE NOT NULL,
    location    VARCHAR(150),
    description VARCHAR(500)
);

-- Beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
    beneficiary_id INT PRIMARY KEY AUTO_INCREMENT,
    name           VARCHAR(100) NOT NULL,
    age            INT,
    help_type      VARCHAR(100),
    contact        VARCHAR(100)
);

-- ============================================
--  SEED DATA
-- ============================================

-- Default admin (username: admin, password: admin123)
INSERT INTO admin (username, password) VALUES ('admin', 'admin123');

-- Sample donors
INSERT INTO donors (name, email, phone, address) VALUES
('Rahul Sharma',  'rahul@email.com',  '9876543210', 'Panaji, Goa'),
('Priya Nair',    'priya@email.com',  '9123456789', 'Margao, Goa'),
('Amit Desai',    'amit@email.com',   '9988776655', 'Vasco, Goa'),
('Sunita Mehta',  'sunita@email.com', '9870012345', 'Mapusa, Goa'),
('Kiran Patil',   'kiran@email.com',  '9345678901', 'Ponda, Goa');

-- Sample donations
INSERT INTO donations (donor_id, amount, donation_date, purpose) VALUES
(1, 15000, CURDATE() - INTERVAL 2 DAY,  'Education'),
(2, 8500,  CURDATE() - INTERVAL 3 DAY,  'Food Aid'),
(3, 20000, CURDATE() - INTERVAL 4 DAY,  'Healthcare'),
(4, 5000,  CURDATE() - INTERVAL 5 DAY,  'Shelter'),
(5, 12000, CURDATE() - INTERVAL 10 DAY, 'Education'),
(1, 7500,  CURDATE() - INTERVAL 30 DAY, 'Food Aid'),
(2, 10000, CURDATE() - INTERVAL 45 DAY, 'Healthcare'),
(3, 25000, CURDATE() - INTERVAL 60 DAY, 'Education');

-- Sample volunteers
INSERT INTO volunteers (name, email, phone, assigned_work) VALUES
('Anjali Naik',   'anjali@email.com', '9001122334', 'Blood Donation Camp'),
('Rohit Kamat',   'rohit@email.com',  '9112233445', 'Food Distribution'),
('Pooja Salgaonkar', 'pooja@email.com', '9223344556', 'Teaching'),
('Nikhil Sawant', 'nikhil@email.com', '9334455667', 'Medical Camp');

-- Sample events
INSERT INTO events (event_name, event_date, location, description) VALUES
('Blood Donation Camp',    CURDATE() + INTERVAL 5 DAY,  'Civil Hospital, Panaji',  'Annual blood donation drive for Civil Hospital.'),
('Charity Food Drive',     CURDATE() + INTERVAL 12 DAY, 'Margao Community Hall',   'Food distribution for underprivileged families.'),
('Scholarship Distribution', CURDATE() + INTERVAL 20 DAY, 'Vasco Town Hall',       'Merit scholarships for deserving students.'),
('Health Awareness Camp',  CURDATE() - INTERVAL 10 DAY, 'Mapusa Primary School',   'Free health checkup and awareness camp.');

-- Sample beneficiaries
INSERT INTO beneficiaries (name, age, help_type, contact) VALUES
('Ramesh Kumar',  35, 'Food Aid',    '9871234567'),
('Meera Bai',     62, 'Healthcare',  '9762345678'),
('Arjun Das',     12, 'Education',   'Guardian: 9653456789'),
('Fatima Shaikh', 28, 'Shelter',     '9544567890'),
('Suresh Naidu',  45, 'Food Aid',    '9435678901');

-- ============================================
SELECT 'Database setup complete! Login with admin / admin123' AS STATUS;
