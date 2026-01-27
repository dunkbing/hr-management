package haukientruc.hr.service;

import haukientruc.hr.dto.RewardDisciplineDTO;
import haukientruc.hr.entity.RewardDiscipline;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.RewardDisciplineRepository;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RewardDisciplineService {

    private final RewardDisciplineRepository rewardDisciplineRepository;
    private final UserRepository userRepository;
    private final Path fileStorageLocation = Paths.get("uploads/decisions").toAbsolutePath().normalize();

    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<RewardDisciplineDTO> getAll() {
        return rewardDisciplineRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RewardDisciplineDTO> getByUserId(Long userId) {
        return rewardDisciplineRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public RewardDiscipline create(RewardDisciplineDTO dto, MultipartFile file) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

        String fileName = null;
        if (file != null && !file.isEmpty()) {
            fileName = storeFile(file);
        }

        RewardDiscipline entity = RewardDiscipline.builder()
                .user(user)
                .type(dto.getType())
                .reason(dto.getReason())
                .decisionNumber(dto.getDecisionNumber())
                .decisionDate(dto.getDecisionDate())
                .effectiveDate(dto.getEffectiveDate())
                .attachmentPath(fileName)
                .build();

        return rewardDisciplineRepository.save(entity);
    }

    public void delete(Long id) {
        rewardDisciplineRepository.deleteById(id);
    }

    private String storeFile(MultipartFile file) {
        // Init dir if needed
        init();

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        // Generate unique name to avoid collision
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Path getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }

    private RewardDisciplineDTO convertToDto(RewardDiscipline entity) {
        return RewardDisciplineDTO.builder()
                .id(entity.getId())
                .userId(entity.getUser().getUserId())
                .employeeName(entity.getUser().getFullName())
                .type(entity.getType())
                .reason(entity.getReason())
                .decisionNumber(entity.getDecisionNumber())
                .decisionDate(entity.getDecisionDate())
                .effectiveDate(entity.getEffectiveDate())
                .attachmentPath(entity.getAttachmentPath())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
