package haukientruc.hr.service;

import haukientruc.hr.dto.ContractDTO;
import haukientruc.hr.entity.Contract;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.ContractRepository;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepo;
    private final UserRepository userRepo;

    public List<ContractDTO> getAll() {
        return contractRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ContractDTO> getByUserId(Long userId) {
        return contractRepo.findByUser_UserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ContractDTO create(ContractDTO req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        Contract contract = new Contract();
        contract.setUser(user);
        contract.setContractCode(req.getContractCode());
        contract.setContractType(req.getContractType());
        contract.setSignDate(req.getSignDate());
        contract.setStartDate(req.getStartDate());
        contract.setEndDate(req.getEndDate());
        contract.setStatus(req.getStatus());
        contract.setNote(req.getNote());

        return toDTO(contractRepo.save(contract));
    }

    public ContractDTO update(Long id, ContractDTO req) {
        Contract contract = contractRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        // Update fields
        contract.setContractCode(req.getContractCode());
        contract.setContractType(req.getContractType());
        contract.setSignDate(req.getSignDate());
        contract.setStartDate(req.getStartDate());
        contract.setEndDate(req.getEndDate());
        contract.setStatus(req.getStatus());
        contract.setNote(req.getNote());

        return toDTO(contractRepo.save(contract));
    }

    public void delete(Long id) {
        contractRepo.deleteById(id);
    }

    private ContractDTO toDTO(Contract e) {
        ContractDTO dto = new ContractDTO();
        dto.setId(e.getId());
        dto.setUserId(e.getUser().getUserId());
        dto.setFullName(e.getUser().getFullName());
        dto.setContractCode(e.getContractCode());
        dto.setContractType(e.getContractType());
        dto.setSignDate(e.getSignDate());
        dto.setStartDate(e.getStartDate());
        dto.setEndDate(e.getEndDate());
        dto.setStatus(e.getStatus());
        dto.setNote(e.getNote());
        return dto;
    }
}
