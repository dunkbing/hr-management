-- URGENT FIX: Run this SQL script in your PostgreSQL database to fix the request submission error
-- This updates the status constraint to allow the new PENDING_FACULTY_HEAD status

-- Step 1: Drop the old constraint
ALTER TABLE personnel_requests DROP CONSTRAINT IF EXISTS personnel_requests_status_check;

-- Step 2: Add the updated constraint with all 5 statuses
ALTER TABLE personnel_requests 
ADD CONSTRAINT personnel_requests_status_check 
CHECK (status::text = ANY (ARRAY[
    'PENDING_FACULTY_HEAD'::character varying, 
    'PENDING_ADMIN'::character varying, 
    'PENDING_PRINCIPAL'::character varying, 
    'APPROVED'::character varying, 
    'REJECTED'::character varying
]::text[]));

-- Verify the constraint was created
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'personnel_requests_status_check';
