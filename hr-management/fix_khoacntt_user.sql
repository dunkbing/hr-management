-- Fix user khoacntt to have correct role and faculty
-- Run this SQL script to assign khoacntt as Faculty Head of CNTT

-- Get role_id for truong_don_vi
-- Get faculty_id for CNTT

-- Update khoacntt user
UPDATE users 
SET 
    role_id = (SELECT role_id FROM roles WHERE role_code = 'truong_don_vi'),
    faculty_id = (SELECT id FROM faculties WHERE code = 'CNTT')
WHERE username = 'khoacntt';

-- Verify the update
SELECT 
    u.username,
    u.user_id,
    r.role_code,
    r.role_name,
    f.code as faculty_code,
    f.name as faculty_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.role_id
LEFT JOIN faculties f ON u.faculty_id = f.id
WHERE u.username IN ('khoacntt', 'truongkhoa', 'giangvien01');
