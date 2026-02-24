-- Fix Position Names from English to Vietnamese
-- Run this script to update all existing Position records to Vietnamese

-- Update common English position names to Vietnamese
UPDATE positions SET name = 'Trưởng khoa' WHERE name IN ('Faculty Head', 'Dean');
UPDATE positions SET name = 'Phó khoa' WHERE name IN ('Vice Dean', 'Vice Faculty Head');
UPDATE positions SET name = 'Giảng viên' WHERE name IN ('Lecturer', 'Teacher');
UPDATE positions SET name = 'Giáo sư' WHERE name = 'Professor';
UPDATE positions SET name = 'Phó giáo sư' WHERE name = 'Associate Professor';
UPDATE positions SET name = 'Tiến sĩ' WHERE name IN ('Doctor', 'PhD');
UPDATE positions SET name = 'Thạc sĩ' WHERE name = 'Master';
UPDATE positions SET name = 'Trưởng bộ môn' WHERE name = 'Department Head';
UPDATE positions SET name = 'Phó hiệu trưởng' WHERE name = 'Vice Principal';
UPDATE positions SET name = 'Hiệu trưởng' WHERE name = 'Principal';
UPDATE positions SET name = 'Trợ lý giảng dạy' WHERE name = 'Teaching Assistant';
UPDATE positions SET name = 'Nghiên cứu viên' WHERE name = 'Researcher';

-- Verify the changes
SELECT id, code, name, description 
FROM positions 
ORDER BY id;
