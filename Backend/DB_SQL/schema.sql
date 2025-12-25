CREATE DATABASE IF NOT EXISTS onmyway;
USE onmyway;

-- Drop tables if they exist to allow clean reset
DROP TABLE IF EXISTS Confirmation;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS Address;

-- Create Address table
CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    x_coordinate FLOAT,
    y_coordinate FLOAT,
    full_address VARCHAR(255)
);

-- Create Person table
CREATE TABLE Person (
    id INT PRIMARY KEY AUTO_INCREMENT,
    f_name VARCHAR(255),
    l_name VARCHAR(255),
    address_id INT,
    FOREIGN KEY (address_id) REFERENCES Address(id)
);

-- Insert dummy data into Address
INSERT INTO Address (x_coordinate, y_coordinate, full_address) VALUES
(32.0780, 34.7741, 'Dizengoff Square, Tel Aviv'),      -- כיכר דיזנגוף
(32.0716, 34.7876, 'Sarona Market, Tel Aviv'),         -- שרונה מרקט
(32.0963, 34.7738, 'Tel Aviv Port, Tel Aviv'),         -- נמל תל אביב
(32.0726, 34.7794, 'Habima Square, Tel Aviv'),         -- כיכר הבימה
(32.0743, 34.7921, 'Azrieli Center, Tel Aviv'),        -- עזריאלי
(32.0583, 34.7709, 'Florentin St, Tel Aviv'),          -- פלורנטין
(32.0628, 34.7713, 'Rothschild Blvd, Tel Aviv'),       -- שדרות רוטשילד
(32.0806, 34.7806, 'Rabin Square, Tel Aviv'),          -- כיכר רבין
(32.0553, 34.7563, 'Jaffa Clock Tower, Tel Aviv'),     -- שעון יפו (טכנית ת"א-יפו)
(32.0827, 34.7675, 'Gordon Beach, Tel Aviv');         -- חוף גורדון

-- Insert dummy data into Person
INSERT INTO Person (id, f_name, l_name, address_id) VALUES
(101, 'Yossi', 'Cohen', 1),
(102, 'Sarah', 'Levi', 2),
(103, 'David', 'Mizrahi', 3),
(104, 'Rachel', 'Peretz', 4),
(105, 'Moshe', 'Biton', 5),
(106, 'Noa', 'Friedman', 6),
(107, 'Itay', 'Azulai', 7),
(108, 'Maya', 'Golan', 8),
(109, 'Omer', 'Katz', 9),
(110, 'Tamar', 'Shapiro', 10);

CREATE TABLE Confirmation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    person_id INT,
    status_ride boolean,
    FOREIGN KEY (person_id) REFERENCES Person(id)
);

Insert INTO Confirmation (person_id, status_ride) VALUES
(101, true),
(102, false),
(103, true),
(104, false),
(105, true),
(106, false),
(107, true),
(108, false),
(109, true),
(110, false);