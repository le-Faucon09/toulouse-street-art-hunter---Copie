-- ✅ Crée la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS street_art_hunter
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE street_art_hunter;

-- ⚠️ Supprime les tables existantes dans le bon ordre à cause des clés étrangères
DROP TABLE IF EXISTS discovered_artwork;
DROP TABLE IF EXISTS score;
DROP TABLE IF EXISTS artwork;
DROP TABLE IF EXISTS artist;
DROP TABLE IF EXISTS user;

-- ✅ Table: user
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    zip_code INT,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    pseudo VARCHAR(20) NOT NULL,
    is_admin TINYINT(1) DEFAULT 0
);

-- ✅ Table: artist
CREATE TABLE artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    profile_image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Table: artwork
CREATE TABLE artwork (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    image_url VARCHAR(255),
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    artist_id INT,
    points INT DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artist(id)
);

-- ✅ Table: discovered_artwork
CREATE TABLE discovered_artwork (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    artwork_id INT NOT NULL,
    photo_url VARCHAR(255),
    discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (artwork_id) REFERENCES artwork(id),
    UNIQUE (user_id, artwork_id)
);

-- ✅ Table: score
CREATE TABLE score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_points INT DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- ✅ Données de test
INSERT INTO user (pseudo, email, last_name, first_name, password_hash, zip_code)
VALUES ('Dodolasaumure', 'test@example.com', 'Durand', 'Alice', 'hashedpassword123', 75001);

INSERT INTO artist (name, bio)
VALUES ('Banksy', 'Artiste anonyme connu pour ses œuvres engagées.');

INSERT INTO artwork (title, description, image_url, latitude, longitude, artist_id)
VALUES (
    'Street Art Example',
    'Un graffiti dans le centre-ville.',
    'https://example.com/art.jpg',
    48.8566,
    2.3522,
    1
);

INSERT INTO discovered_artwork (user_id, artwork_id)
VALUES (1, 1);

INSERT INTO score (user_id, total_points)
VALUES (1, 10);
