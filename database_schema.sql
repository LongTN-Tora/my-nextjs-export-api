-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS babysitter_dev;
USE babysitter_dev;

-- Tạo bảng data_powerapp với cấu trúc đúng
-- Lưu ý: transactionID dùng BIGINT để lưu được số lớn (timestamp)
CREATE TABLE IF NOT EXISTS data_powerapp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transactionID BIGINT NOT NULL COMMENT 'Giao dịch ID (số lớn, có thể là timestamp)',
  body JSON NOT NULL COMMENT 'Dữ liệu JSON chứa records array',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  INDEX idx_transactionID (transactionID),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
