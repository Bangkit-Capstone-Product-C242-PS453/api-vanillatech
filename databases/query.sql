DROP TABLE IF EXISTS disease_record;
DROP TABLE IF EXISTS records;
DROP TABLE IF EXISTS diseases;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS refresh_tokens;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    address TEXT NULL,
    phone VARCHAR(50) NULL,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT,
    refresh_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NULL,
    image TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE diseases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    symptoms TEXT NULL,
    prevention TEXT NULL
);

CREATE TABLE disease_record (
    id_disease_record INT PRIMARY KEY AUTO_INCREMENT,
    id_record INT,
    id_disease INT,
    FOREIGN KEY (id_record) REFERENCES records(id) ON DELETE CASCADE,
    FOREIGN KEY (id_disease) REFERENCES diseases(id) ON DELETE CASCADE
);
