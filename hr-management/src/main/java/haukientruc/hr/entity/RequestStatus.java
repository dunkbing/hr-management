package haukientruc.hr.entity;

public enum RequestStatus {
    PENDING_FACULTY_HEAD, // First approval: Faculty Head (Trưởng khoa)
    PENDING_ADMIN, // Second approval: Admin
    PENDING_PRINCIPAL, // Third approval: Principal (Hiệu trưởng)
    APPROVED, // Final approved status
    REJECTED // Rejected at any stage
}
