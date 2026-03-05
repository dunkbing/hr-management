package haukientruc.hr.service;

import haukientruc.hr.dto.PersonnelRequestDTO;
import haukientruc.hr.dto.UserDTO;
import haukientruc.hr.entity.PersonnelRequest;
import haukientruc.hr.entity.RequestStatus;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.PersonnelRequestRepository;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PersonnelRequestService {

        private final PersonnelRequestRepository repository;
        private final UserRepository userRepository;
        private final UserService userService;
        private final LuceneService luceneService;
        private final NotificationService notificationService;
        private final ReportService reportService;
        private final DigitalSignatureService digitalSignatureService;

        public PersonnelRequestDTO createRequest(PersonnelRequestDTO dto) {
                UserDTO currentUserDto = userService.getCurrentUser();
                User requester = userRepository.findById(currentUserDto.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Determine initial status based on role
                RequestStatus initialStatus = RequestStatus.PENDING_FACULTY_HEAD;
                String roleCode = requester.getRole() != null ? requester.getRole().getRoleCode() : "";

                log.info("Creating request for user: {} with role: {}", requester.getUsername(), roleCode);

                if ("truong_don_vi".equalsIgnoreCase(roleCode) || "truongkhoa".equalsIgnoreCase(roleCode)) {
                        initialStatus = RequestStatus.PENDING_ADMIN;
                } else if ("admin".equalsIgnoreCase(roleCode) || "superadmin".equalsIgnoreCase(roleCode)) {
                        initialStatus = RequestStatus.PENDING_PRINCIPAL;
                } else if ("hieu_truong".equalsIgnoreCase(roleCode) || "hieutruong".equalsIgnoreCase(roleCode)) {
                        initialStatus = RequestStatus.APPROVED;
                }

                PersonnelRequest request = PersonnelRequest.builder()
                                .requester(requester)
                                .title(dto.getTitle())
                                .content(dto.getContent())
                                .type(dto.getType())
                                .status(initialStatus)
                                .build();

                PersonnelRequest saved = repository.save(request);
                luceneService.indexPersonnelRequest(saved);

                // Send notifications based on initial status
                try {
                        if (initialStatus == RequestStatus.PENDING_FACULTY_HEAD) {
                                sendNotificationToFacultyHeads(saved, requester);
                        } else if (initialStatus == RequestStatus.PENDING_ADMIN) {
                                sendNotificationToAdmins(saved, requester, null);
                        } else if (initialStatus == RequestStatus.PENDING_PRINCIPAL) {
                                sendNotificationToPrincipals(saved, requester, null);
                        }
                } catch (Exception e) {
                        log.error("Failed to send initial notifications", e);
                }

                return convertToDto(saved);
        }

        private void sendNotificationToFacultyHeads(PersonnelRequest saved, User requester) {
                List<User> facultyHeads;
                if (requester.getFaculty() != null) {
                        facultyHeads = userRepository.findByRole_RoleCodeAndFaculty_Id(
                                        "truong_don_vi", requester.getFaculty().getId());
                } else {
                        facultyHeads = userRepository.findByRole_RoleCode("truong_don_vi");
                }

                String notifTitle = "📩 Yêu cầu mới từ giảng viên";
                String notifMessage = String.format("Bạn có yêu cầu mới từ %s cần phê duyệt.\n\nTiêu đề: %s",
                                requester.getFullName() != null ? requester.getFullName() : requester.getUsername(),
                                saved.getTitle());

                for (User fh : facultyHeads) {
                        notificationService.createNotification(fh, notifTitle, notifMessage);
                }
        }

        private void sendNotificationToAdmins(PersonnelRequest saved, User requester, String note) {
                List<User> admins = userRepository.findByRole_RoleCode("admin");
                String title = "📋 Yêu cầu mới cần thẩm định";
                String message = String.format("Yêu cầu \"%s\" từ %s cần Admin thẩm định.\n\n" +
                                "Ghi chú từ cấp trước: %s",
                                saved.getTitle(),
                                requester.getFullName() != null ? requester.getFullName() : requester.getUsername(),
                                note != null && !note.isEmpty() ? note : "Không có ghi chú");

                for (User admin : admins) {
                        notificationService.createNotification(admin, title, message);
                }
        }

        private void sendNotificationToPrincipals(PersonnelRequest saved, User requester, String note) {
                List<User> principals = userRepository.findByRole_RoleCode("hieu_truong");
                String title = "🎓 Yêu cầu cần ký duyệt";
                String message = String.format("Yêu cầu \"%s\" từ %s cần Hiệu trưởng ký duyệt.\n\n" +
                                "Ghi chú từ Admin: %s",
                                saved.getTitle(),
                                requester.getFullName() != null ? requester.getFullName() : requester.getUsername(),
                                note != null && !note.isEmpty() ? note : "Không có ghi chú");

                for (User principal : principals) {
                        notificationService.createNotification(principal, title, message);
                }
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
                UserDTO currentUserDto = userService.getCurrentUser();
                User currentUser = userRepository.findById(currentUserDto.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (currentUser.getFaculty() != null) {
                        Long facultyId = currentUser.getFaculty().getId();
                        return repository.findByStatus(RequestStatus.PENDING_FACULTY_HEAD)
                                        .stream()
                                        .filter(req -> req.getRequester().getFaculty() == null ||
                                                        req.getRequester().getFaculty().getId().equals(facultyId))
                                        .map(this::convertToDto)
                                        .collect(Collectors.toList());
                }

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
                try {
                        sendNotificationToAdmins(request, request.getRequester(), note);
                } catch (Exception e) {
                        log.error("Failed to notify admins", e);
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
                try {
                        sendNotificationToPrincipals(request, request.getRequester(), note);
                } catch (Exception e) {
                        log.error("Failed to notify principal", e);
                }
        }

        @Transactional
        public void approveByPrincipal(Long id, String note) {
                PersonnelRequest request = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                UserDTO currentUserDto = userService.getCurrentUser();
                User principal = userRepository.findById(currentUserDto.getUserId())
                                .orElseThrow(() -> new RuntimeException("Principal not found"));

                request.setPrincipalSignature(principal.getDigitalSignature());
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
