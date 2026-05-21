package dev.gustavo.freelancerdesk.payment;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment extends PanacheEntityBase {

    @Id
    public String id;

    @Column(name = "project_id")
    public String projectId;

    public String category = "projeto";

    @NotBlank
    public String description;

    @NotNull
    public BigDecimal value = BigDecimal.ZERO;

    @Column(name = "due_date")
    @NotNull
    public LocalDate dueDate;

    public String status = "pendente";

    @Column(name = "paid_at")
    public LocalDate paidAt;

    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    public LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    @PreUpdate
    void beforeSave() { updatedAt = LocalDateTime.now(); }
}
