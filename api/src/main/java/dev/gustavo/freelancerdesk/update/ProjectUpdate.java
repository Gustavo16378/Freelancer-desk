package dev.gustavo.freelancerdesk.update;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_updates")
public class ProjectUpdate extends PanacheEntityBase {

    @Id
    public String id;

    @Column(name = "project_id")
    @NotBlank
    public String projectId;

    @NotBlank
    public String text;

    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();
}
