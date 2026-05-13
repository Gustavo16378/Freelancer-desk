package dev.gustavo.freelancerdesk.update;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ProjectUpdateRepository implements PanacheRepositoryBase<ProjectUpdate, String> {

    public List<ProjectUpdate> findByProjectId(String projectId) {
        return list("projectId", projectId);
    }
}
