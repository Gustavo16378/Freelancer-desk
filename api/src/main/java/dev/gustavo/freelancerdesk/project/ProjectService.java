package dev.gustavo.freelancerdesk.project;

import dev.gustavo.freelancerdesk.util.IdGenerator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class ProjectService {

    @Inject
    ProjectRepository repo;

    public List<Project> listAll() {
        return repo.listAll();
    }

    public Project findById(String id) {
        return repo.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("Project not found: " + id));
    }

    @Transactional
    public Project create(Project project) {
        project.id = IdGenerator.next("p");
        repo.persist(project);
        return project;
    }

    @Transactional
    public Project update(String id, Project patch) {
        Project existing = findById(id);
        existing.name         = patch.name;
        existing.client       = patch.client;
        existing.type         = patch.type;
        existing.status       = patch.status;
        existing.value        = patch.value;
        existing.paid         = patch.paid;
        existing.startDate    = patch.startDate;
        existing.deadline     = patch.deadline;
        existing.progress     = patch.progress;
        existing.description  = patch.description;
        existing.tech         = patch.tech;
        existing.isPortfolio  = patch.isPortfolio;
        existing.portfolioUrl = patch.portfolioUrl;
        return existing;
    }

    @Transactional
    public void delete(String id) {
        repo.deleteById(id);
    }
}
