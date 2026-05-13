package dev.gustavo.freelancerdesk.update;

import dev.gustavo.freelancerdesk.util.IdGenerator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class ProjectUpdateService {

    @Inject
    ProjectUpdateRepository repo;

    public List<ProjectUpdate> listAll() { return repo.listAll(); }

    public List<ProjectUpdate> listByProject(String projectId) {
        return repo.findByProjectId(projectId);
    }

    public ProjectUpdate findById(String id) {
        return repo.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("ProjectUpdate not found: " + id));
    }

    @Transactional
    public ProjectUpdate create(ProjectUpdate update) {
        update.id = IdGenerator.next("u");
        repo.persist(update);
        return update;
    }

    @Transactional
    public ProjectUpdate update(String id, ProjectUpdate patch) {
        ProjectUpdate existing = findById(id);
        existing.text = patch.text;
        return existing;
    }

    @Transactional
    public void delete(String id) { repo.deleteById(id); }
}
