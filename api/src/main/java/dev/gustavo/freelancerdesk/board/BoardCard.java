package dev.gustavo.freelancerdesk.board;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "board_cards")
public class BoardCard extends PanacheEntityBase {

    @Id
    public String id;

    @Column(name = "project_id")
    @NotBlank
    public String projectId;

    @Column(name = "column_name")
    public String column = "backlog";

    @NotBlank
    public String title;

    @Column(name = "description")
    public String desc;

    public String priority = "media";

    @Column(name = "due_date")
    public LocalDate due;

    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    public LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    @PreUpdate
    void beforeSave() { updatedAt = LocalDateTime.now(); }
}
