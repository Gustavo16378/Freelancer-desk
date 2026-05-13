package dev.gustavo.freelancerdesk.event;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event extends PanacheEntityBase {

    @Id
    public String id;

    @NotBlank
    public String title;

    @NotNull
    public LocalDate date;

    public String time;

    public String type = "outro";

    @Column(name = "project_id")
    public String projectId;

    public String notes;

    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    public LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    @PreUpdate
    void beforeSave() { updatedAt = LocalDateTime.now(); }
}
