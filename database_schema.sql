-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS powerapp_data;
USE powerapp_data;

-- Tạo bảng data_powerapp với các cột phù hợp với data từ Power Apps
CREATE TABLE IF NOT EXISTS data_powerapp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area VARCHAR(255) COMMENT 'エリア (Khu vực)',
  forecast_ratio INT COMMENT '予想比 (Tỷ lệ dự báo)',
  budget INT COMMENT '予算 (Ngân sách)',
  actual INT COMMENT '実績 (Thực tế)',
  month INT COMMENT '月 (Tháng)',
  product_name VARCHAR(255) COMMENT '製品名 (Tên sản phẩm)',
  outlook INT COMMENT '見込 (Triển vọng)',
  customer_name VARCHAR(255) COMMENT '顧客名 (Tên khách hàng)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_month (month),
  INDEX idx_customer (customer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

