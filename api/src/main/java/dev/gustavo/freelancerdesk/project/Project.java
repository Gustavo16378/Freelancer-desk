package dev.gustavo.freelancerdesk.project;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project extends PanacheEntityBase {

    @Id
    public String id;

    @NotBlank
    public String name;

    @NotBlank
    public String client;

    @NotBlank
    public String type;

    public String status = "aguardando";

    public BigDecimal value = BigDecimal.ZERO;

    public BigDecimal paid = BigDecimal.ZERO;

    @Column(name = "start_date")
    @NotNull
    public LocalDate startDate;

    @NotNull
    public LocalDate deadline;

    public int progress = 0;

    public String description;

    @Column(name = "tech")
    private String techRaw;

    @Column(name = "is_portfolio")
    public boolean isPortfolio = false;

    @Column(name = "portfolio_url")
    public String portfolioUrl;

    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    public LocalDateTime updatedAt = LocalDateTime.now();

    @Transient
    public List<String> tech;

    @PostLoad
    @PostPersist
    @PostUpdate
    void syncTech() {
        if (techRaw != null && !techRaw.isBlank()) {
            tech = Arrays.asList(techRaw.split(","));
        } else {
            tech = List.of();
        }
    }

    @PrePersist
    @PreUpdate
    void beforeSave() {
        updatedAt = LocalDateTime.now();
        techRaw = (tech != null && !tech.isEmpty()) ? String.join(",", tech) : null;
    }
}
