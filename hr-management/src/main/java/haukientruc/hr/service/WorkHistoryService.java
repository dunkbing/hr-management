package haukientruc.hr.service;

import haukientruc.hr.dto.WorkHistoryDTO;
import haukientruc.hr.entity.WorkHistory;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.WorkHistoryRepository;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkHistoryService {

    private final WorkHistoryRepository historyRepo;
    private final UserRepository userRepo;

    public List<WorkHistoryDTO> getAll() {
        return historyRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<WorkHistoryDTO> getByUserId(Long userId) {
        return historyRepo.findByUser_UserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public WorkHistoryDTO create(WorkHistoryDTO req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        WorkHistory wh = new WorkHistory();
        wh.setUser(user);
        wh.setEventDate(req.getEventDate());
        wh.setEventType(req.getEventType());
        wh.setOldPosition(req.getOldPosition());
        wh.setNewPosition(req.getNewPosition());
        wh.setOldDepartment(req.getOldDepartment());
        wh.setNewDepartment(req.getNewDepartment());
        wh.setDescription(req.getDescription());

        return toDTO(historyRepo.save(wh));
    }

    public WorkHistoryDTO update(Long id, WorkHistoryDTO req) {
        WorkHistory wh = historyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quá trình công tác"));

        wh.setEventDate(req.getEventDate());
        wh.setEventType(req.getEventType());
        wh.setOldPosition(req.getOldPosition());
        wh.setNewPosition(req.getNewPosition());
        wh.setOldDepartment(req.getOldDepartment());
        wh.setNewDepartment(req.getNewDepartment());
        wh.setDescription(req.getDescription());

        return toDTO(historyRepo.save(wh));
    }

    public void delete(Long id) {
        historyRepo.deleteById(id);
    }

    private WorkHistoryDTO toDTO(WorkHistory e) {
        WorkHistoryDTO dto = new WorkHistoryDTO();
        dto.setId(e.getId());
        dto.setUserId(e.getUser().getUserId());
        dto.setFullName(e.getUser().getFullName());
        dto.setEventDate(e.getEventDate());
        dto.setEventType(e.getEventType());
        dto.setOldPosition(e.getOldPosition());
        dto.setNewPosition(e.getNewPosition());
        dto.setOldDepartment(e.getOldDepartment());
        dto.setNewDepartment(e.getNewDepartment());
        dto.setDescription(e.getDescription());
        return dto;
    }
}
