package haukientruc.hr.service;

import haukientruc.hr.dto.AssignDeanDTO;
import haukientruc.hr.dto.FacultyDTO;
import haukientruc.hr.dto.UserDTO;

import java.util.List;

public interface FacultyService {

    List<FacultyDTO> getAll(String search, String status);

    FacultyDTO getById(Long id);

    FacultyDTO create(FacultyDTO dto);

    FacultyDTO update(Long id, FacultyDTO dto);

    void delete(Long id);

    List<UserDTO> getStaffByFacultyId(Long id);

    FacultyDTO assignDean(Long facultyId, AssignDeanDTO dto);
}
