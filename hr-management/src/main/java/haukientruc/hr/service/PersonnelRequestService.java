package haukientruc.hr.service;

import haukientruc.hr.dto.PersonnelRequestDTO;
import haukientruc.hr.entity.PersonnelRequest;
import haukientruc.hr.entity.RequestStatus;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.PersonnelRequestRepository;
import haukientruc.hr.repository.UserRepository;
import haukientruc.hr.service.LuceneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonnelRequestService {

    private final PersonnelRequestRepository repository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final LuceneService luceneService;

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
                .status(RequestStatus.PENDING_ADMIN)
                .build();

        PersonnelRequest saved = repository.save(request);
        luceneService.indexPersonnelRequest(saved);
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
    public void approveByAdmin(Long id, String note) {
        PersonnelRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(RequestStatus.PENDING_PRINCIPAL);
        request.setAdminNote(note);
        repository.save(request);
        luceneService.indexPersonnelRequest(request);
    }

    @Transactional
    public void approveByPrincipal(Long id, String note) {
        PersonnelRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(RequestStatus.APPROVED);
        request.setPrincipalNote(note);
        repository.save(request);
        luceneService.indexPersonnelRequest(request);
    }

    @Transactional
    public void reject(Long id, String note, boolean isAdmin) {
        PersonnelRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(RequestStatus.REJECTED);
        if (isAdmin) {
            request.setAdminNote(note);
        } else {
            request.setPrincipalNote(note);
        }
        repository.save(request);
        luceneService.indexPersonnelRequest(request);
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
        dto.setAdminNote(req.getAdminNote());
        dto.setPrincipalNote(req.getPrincipalNote());
        return dto;
    }

    public List<PersonnelRequestDTO> searchRequests(String query) {
        List<Long> ids = luceneService.searchEntities("request", query,
                new String[] { "title", "content", "requester" });
        return repository.findAllById(ids).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}
