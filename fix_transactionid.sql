-- Script để sửa lỗi transactionID bị cắt giá trị
-- Chạy script này để đổi kiểu dữ liệu transactionID từ INT sang BIGINT

USE babysitter_dev;

-- Kiểm tra cấu trúc bảng hiện tại
DESCRIBE data_powerapp;

-- Đổi kiểu dữ liệu transactionID từ INT sang BIGINT
ALTER TABLE data_powerapp 
MODIFY COLUMN transactionID BIGINT NOT NULL;

-- Kiểm tra lại cấu trúc bảng sau khi sửa
DESCRIBE data_powerapp;

