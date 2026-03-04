package haukientruc.hr.service;

import haukientruc.hr.dto.PersonnelRequestDTO;
import haukientruc.hr.entity.PersonnelRequest;
import haukientruc.hr.entity.RequestStatus;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.PersonnelRequestRepository;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonnelRequestService {

        private final PersonnelRequestRepository repository;
        private final UserRepository userRepository;
        private final UserService userService;
        private final LuceneService luceneService;
        private final NotificationService notificationService;
        private final ReportService reportService;
        private final DigitalSignatureService digitalSignatureService;

        public PersonnelRequestDTO createRequest(PersonnelRequestDTO dto) {
                // Use current user from security context for better security and reliability
                haukientruc.hr.dto.UserDTO currentUserDto = userService.getCurrentUser();
                User requester = userRepository.findById(currentUserDto.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                PersonnelRequest request = PersonnelRequest.builder()
                                .requester(requester)
                                .title(dto.getTitle())
                                .content(dto.getContent())
                                .type(dto.getType())
                                .status(RequestStatus.PENDING_FACULTY_HEAD)
                                .build();

                PersonnelRequest saved = repository.save(request);
                luceneService.indexPersonnelRequest(saved);

                System.out.println("📝 CREATE REQUEST DEBUG:");
                System.out.println("  Request ID: " + saved.getId());
                System.out.println("  Title: " + saved.getTitle());
                System.out.println("  Requester: " + requester.getUsername() + " (ID: " + requester.getUserId() + ")");
                System.out.println("  Requester Faculty: " + (requester.getFaculty() != null
                                ? requester.getFaculty().getName() + " (ID: " + requester.getFaculty().getId() + ")"
                                : "NULL"));
                System.out.println("  Status: " + saved.getStatus());

                // Send notification to Faculty Head(s)
                List<User> facultyHeads;

                if (requester.getFaculty() != null) {
                        // If requester has faculty, send to faculty heads of that faculty
                        facultyHeads = userRepository.findByRole_RoleCodeAndFaculty_Id(
                                        "truong_don_vi", requester.getFaculty().getId());
                        System.out.println("  Found " + facultyHeads.size() + " faculty heads in "
                                        + requester.getFaculty().getName());
                } else {
                        // If requester has NO faculty, send to ALL faculty heads
                        System.out.println("  ⚠️ Requester has no faculty! Sending notification to ALL faculty heads.");
                        facultyHeads = userRepository.findByRole_RoleCode("truong_don_vi");
                        System.out.println("  Found " + facultyHeads.size() + " faculty heads total");
                }
                String notifTitle = "📩 Yêu cầu mới từ giảng viên";
                String notifMessage = String.format(
                                "Bạn có yêu cầu mới từ %s cần phê duyệt.\n\n" +
                                                "Tiêu đề: %s\n" +
                                                "Loại: %s\n" +
                                                "Nội dung: %s",
                                requester.getFullName() != null ? requester.getFullName() : requester.getUsername(),
                                saved.getTitle(),
                                saved.getType(),
                                saved.getContent().length() > 100 ? saved.getContent().substring(0, 100) + "..."
                                                : saved.getContent());

                for (User facultyHead : facultyHeads) {
                        System.out.println("  📧 Sending notification to: " + facultyHead.getUsername());
                        notificationService.createNotification(facultyHead, notifTitle, notifMessage);
                }

                if (facultyHeads.isEmpty()) {
                        System.out.println("  ⚠️ WARNING: No faculty heads found! No notifications sent.");
                }

                return convertToDto(saved);
        }

        public List<PersonnelRequestDTO> getMyRequests(Long userId) {
                Long targetId = userId;
                if (targetId == null) {
                        targetId = userService.getCurrentUser().getUserId();
                }
                return repository.findByRequesterUserId(targetId).stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        public List<PersonnelRequestDTO> getPendingForFacultyHead() {
                // Get current user's faculty
                haukientruc.hr.dto.UserDTO currentUserDto = userService.getCurrentUser();
                User currentUser = userRepository.findById(currentUserDto.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                System.out.println("🔍 DEBUG getPendingForFacultyHead:");
                System.out.println("  Current User: " + currentUser.getUsername() + " (ID: " + currentUser.getUserId()
                                + ")");
                System.out.println("  Current User Faculty: " + (currentUser.getFaculty() != null
                                ? currentUser.getFaculty().getName() + " (ID: " + currentUser.getFaculty().getId() + ")"
                                : "NULL"));

                // Get all pending requests for debugging
                List<PersonnelRequest> allPending = repository.findByStatus(RequestStatus.PENDING_FACULTY_HEAD);
                System.out.println("  Total PENDING_FACULTY_HEAD requests: " + allPending.size());

                for (PersonnelRequest req : allPending) {
                        System.out.println("    - Request ID: " + req.getId() +
                                        ", Title: " + req.getTitle() +
                                        ", Requester: " + req.getRequester().getUsername() +
                                        ", Requester Faculty: "
                                        + (req.getRequester().getFaculty() != null
                                                        ? req.getRequester().getFaculty().getName() + " (ID: "
                                                                        + req.getRequester().getFaculty().getId() + ")"
                                                        : "NULL"));
                }

                // Filter by faculty if user has one
                if (currentUser.getFaculty() != null) {
                        Long facultyId = currentUser.getFaculty().getId();

                        // Show requests from same faculty OR requests with no faculty
                        List<PersonnelRequest> filtered = repository.findByStatus(RequestStatus.PENDING_FACULTY_HEAD)
                                        .stream()
                                        .filter(req -> req.getRequester().getFaculty() == null ||
                                                        req.getRequester().getFaculty().getId().equals(facultyId))
                                        .collect(Collectors.toList());

                        System.out.println("  Filtered requests for faculty " + currentUser.getFaculty().getName()
                                        + ": " + filtered.size());
                        System.out.println("  (Includes requests with no faculty assignment)");

                        return filtered.stream()
                                        .map(this::convertToDto)
                                        .collect(Collectors.toList());
                }

                // If faculty head has no faculty, return all
                System.out.println("  ⚠️ Faculty Head has no faculty assigned! Returning ALL requests.");
                return repository.findByStatus(RequestStatus.PENDING_FACULTY_HEAD).stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        public List<PersonnelRequestDTO> getPendingForAdmin() {
                return repository.findByStatus(RequestStatus.PENDING_ADMIN).stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        public List<PersonnelRequestDTO> getPendingForPrincipal() {
                return repository.findByStatus(RequestStatus.PENDING_PRINCIPAL).stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        @Transactional
        public void approveByFacultyHead(Long id, String note) {
                PersonnelRequest request = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));
                request.setStatus(RequestStatus.PENDING_ADMIN);
                request.setFacultyHeadNote(note);
                repository.save(request);
                luceneService.indexPersonnelRequest(request);

                // Send notification to requester
                String title = "Yêu cầu đã được phê duyệt bởi Trưởng đơn vị";
                String message = String.format(
                                "Yêu cầu \"%s\" của bạn đã được Trưởng đơn vị phê duyệt và chuyển tiếp cho Quản trị viên.\n\n"
                                                +
                                                "Ghi chú: %s",
                                request.getTitle(),
                                note != null && !note.isEmpty() ? note : "Không có ghi chú");
                notificationService.createNotification(request.getRequester(), title, message);

                // Send notification to Admin(s)
                List<User> admins = userRepository.findByRole_RoleCode("admin");
                String adminNotifTitle = "📋 Yêu cầu mới cần thẩm định";
                String adminNotifMessage = String.format(
                                "Có yêu cầu \"%s\" từ %s đã được Trưởng đơn vị phê duyệt và cần Admin thẩm định.\n\n"
                                                +
                                                "Loại: %s\n" +
                                                "Ghi chú từ Trưởng đơn vị: %s",
                                request.getTitle(),
                                request.getRequester().getFullName() != null ? request.getRequester().getFullName()
                                                : request.getRequester().getUsername(),
                                request.getType(),
                                note != null && !note.isEmpty() ? note : "Không có ghi chú");

                for (User admin : admins) {
                        notificationService.createNotification(admin, adminNotifTitle, adminNotifMessage);
                }
        }

        @Transactional
        public void approveByAdmin(Long id, String note) {
                PersonnelRequest request = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));
                request.setStatus(RequestStatus.PENDING_PRINCIPAL);
                request.setAdminNote(note);
                repository.save(request);
                luceneService.indexPersonnelRequest(request);

                // Send notification to requester
                String title = "Yêu cầu đã được phê duyệt bởi Quản trị viên";
                String message = String.format(
                                "Yêu cầu \"%s\" của bạn đã được Quản trị viên phê duyệt và chuyển tiếp cho Hiệu trưởng.\n\n"
                                                +
                                                "Ghi chú: %s",
                                request.getTitle(),
                                note != null && !note.isEmpty() ? note : "Không có ghi chú");
                notificationService.createNotification(request.getRequester(), title, message);

                // Send notification to Principal(s)
                List<User> principals = userRepository.findByRole_RoleCode("hieu_truong");
                String principalNotifTitle = "🎓 Yêu cầu cần ký duyệt";
                String principalNotifMessage = String.format(
                                "Có yêu cầu \"%s\" từ %s đã được Admin phê duyệt và cần Hiệu trưởng ký duyệt.\n\n"
                                                +
                                                "Loại: %s\n" +
                                                "Ghi chú từ Admin: %s",
                                request.getTitle(),
                                request.getRequester().getFullName() != null ? request.getRequester().getFullName()
                                                : request.getRequester().getUsername(),
                                request.getType(),
                                note != null && !note.isEmpty() ? note : "Không có ghi chú");

                for (User principal : principals) {
                        notificationService.createNotification(principal, principalNotifTitle,
                                        principalNotifMessage);
                }
        }

        @Transactional
        public void approveByPrincipal(Long id, String note) {
                PersonnelRequest request = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                // 🔏 Tự động gắn thời gian ký duyệt
                request.setPrincipalSignatureDate(LocalDateTime.now());

                request.setStatus(RequestStatus.APPROVED);
                request.setPrincipalNote(note);

                // Generate and cryptographically sign the PDF
                try {
                        byte[] unsignedPdf = reportService.generatePersonnelRequestPdf(request);
                        byte[] signedPdf = digitalSignatureService.signPdf(unsignedPdf);
                        request.setSignedPdfData(signedPdf);
                } catch (Exception e) {
                        throw new RuntimeException("Failed to generate signed PDF", e);
                }

                repository.save(request);
                luceneService.indexPersonnelRequest(request);

                // Send notification to requester
                String title = "🎉 Yêu cầu đã được phê duyệt hoàn tất";
                String message = String.format(
                                "Chúc mừng! Yêu cầu \"%s\" của bạn đã được Hiệu trưởng phê duyệt và hoàn tất.\n\n" +
                                                "Ghi chú: %s\n\n" +
                                                "Yêu cầu của bạn sẽ được xử lý trong thời gian sớm nhất.",
                                request.getTitle(),
                                note != null && !note.isEmpty() ? note : "Không có ghi chú");
                notificationService.createNotification(request.getRequester(), title, message);
        }

        @Transactional
        public void reject(Long id, String note, String rejectedBy) {
                PersonnelRequest request = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));
                request.setStatus(RequestStatus.REJECTED);

                String rejectorName = "";
                // Set note based on who rejected it
                switch (rejectedBy.toLowerCase()) {
                        case "faculty_head":
                                request.setFacultyHeadNote(note);
                                rejectorName = "Trưởng đơn vị";
                                break;
                        case "admin":
                                request.setAdminNote(note);
                                rejectorName = "Quản trị viên";
                                break;
                        case "principal":
                                request.setPrincipalNote(note);
                                rejectorName = "Hiệu trưởng";
                                break;
                        default:
                                request.setAdminNote(note);
                                rejectorName = "Quản trị viên";
                }

                repository.save(request);
                luceneService.indexPersonnelRequest(request);

                // Send notification to requester
                String title = "❌ Yêu cầu đã bị từ chối";
                String message = String.format(
                                "Yêu cầu \"%s\" của bạn đã bị từ chối bởi %s.\n\n" +
                                                "Lý do: %s\n\n" +
                                                "Vui lòng xem lại yêu cầu và liên hệ với bộ phận liên quan nếu cần thêm thông tin.",
                                request.getTitle(),
                                rejectorName,
                                note != null && !note.isEmpty() ? note : "Không có lý do cụ thể");
                notificationService.createNotification(request.getRequester(), title, message);
        }

        private PersonnelRequestDTO convertToDto(PersonnelRequest req) {
                PersonnelRequestDTO dto = new PersonnelRequestDTO();
                dto.setId(req.getId());
                dto.setRequesterId(req.getRequester().getUserId());
                dto.setRequesterName(req.getRequester().getFullName());
                dto.setTitle(req.getTitle());
                dto.setContent(req.getContent());
                dto.setType(req.getType());
                dto.setStatus(req.getStatus());
                dto.setCreatedAt(req.getCreatedAt());
                dto.setUpdatedAt(req.getUpdatedAt());
                dto.setFacultyHeadNote(req.getFacultyHeadNote());
                dto.setAdminNote(req.getAdminNote());
                dto.setPrincipalNote(req.getPrincipalNote());
                dto.setPrincipalSignatureDate(req.getPrincipalSignatureDate()); // Map thời gian ký
                dto.setHasSignedPdf(req.getSignedPdfData() != null && req.getSignedPdfData().length > 0);
                return dto;
        }

        public PersonnelRequest getRequestEntity(Long id) {
                return repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));
        }

        public List<PersonnelRequestDTO> searchRequests(String query) {
                List<Long> ids = luceneService.searchEntities("request", query,
                                new String[] { "title", "content", "requester" });
                return repository.findAllById(ids).stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }
}
