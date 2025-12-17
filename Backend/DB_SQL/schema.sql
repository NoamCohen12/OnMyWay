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
    y_coordinate FLOAT
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
-- Note: We specify ID here to keep relationships consistent, but future inserts can omit it
INSERT INTO Address (id, x_coordinate, y_coordinate) VALUES
(1, 32.0853, 34.7818),
(2, 31.7683, 35.2137),
(3, 32.7940, 34.9896),
(4, 29.5581, 34.9482),
(5, 32.1663, 34.8432),
(6, 31.2518, 34.7913),
(7, 32.9324, 35.1872),
(8, 31.8903, 34.8113),
(9, 32.7019, 35.3035),
(10, 31.8044, 34.6553);

-- Insert dummy data into Person
-- Note: We specify ID here to keep relationships consistent, but future inserts can omit it
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