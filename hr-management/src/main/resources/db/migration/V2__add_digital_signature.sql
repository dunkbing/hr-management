-- Migration: Add digital signature support
-- Thêm trường chữ ký số cho User và thời gian ký cho PersonnelRequest

-- Thêm trường lưu chữ ký số cho User (Hiệu trưởng)
ALTER TABLE users
ADD COLUMN digital_signature TEXT;

-- Thêm trường lưu thời gian ký duyệt của Hiệu trưởng
ALTER TABLE personnel_requests
ADD COLUMN principal_signature_date TIMESTAMP;
