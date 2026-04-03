CREATE DATABASE IF NOT EXISTS water_data_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE water_data_system;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(50) NOT NULL,
  role ENUM('user', 'admin', 'repair') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  water_price DECIMAL(10, 2) NOT NULL,
  base_quota INT NOT NULL,
  warning_threshold INT NOT NULL,
  push_strategy VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, name, role)
SELECT 'user001', '123456', '普通用户', 'user'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user001');

INSERT INTO users (username, password, name, role)
SELECT 'admin001', '123456', '系统管理员', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin001');

INSERT INTO users (username, password, name, role)
SELECT 'repair001', '123456', '维修人员', 'repair'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'repair001');

INSERT INTO system_config (water_price, base_quota, warning_threshold, push_strategy)
SELECT 3.58, 1200, 85, '每日 09:00 自动推送节水建议'
WHERE NOT EXISTS (SELECT 1 FROM system_config);
