package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "departments")
@Getter
@Setter
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String departmentCode;

    @Column(name = "name", nullable = false)
    private String departmentName;

    @Column(name = "order_index")
    private Integer orderIndex;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Department parent;

    @OneToMany(mappedBy = "parent")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Department> children;

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "manager_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User manager;
}
