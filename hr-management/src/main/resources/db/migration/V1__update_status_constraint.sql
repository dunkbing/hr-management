-- Migration to add PENDING_FACULTY_HEAD to the status check constraint
-- This fixes the error when lecturers try to submit requests

-- Drop the old constraint
ALTER TABLE personnel_requests DROP CONSTRAINT IF EXISTS personnel_requests_status_check;

-- Add the new constraint with PENDING_FACULTY_HEAD included
ALTER TABLE personnel_requests ADD CONSTRAINT personnel_requests_status_check 
    CHECK (status IN ('PENDING_FACULTY_HEAD', 'PENDING_ADMIN', 'PENDING_PRINCIPAL', 'APPROVED', 'REJECTED'));
