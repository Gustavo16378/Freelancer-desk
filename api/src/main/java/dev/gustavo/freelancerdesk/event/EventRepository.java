package dev.gustavo.freelancerdesk.event;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class EventRepository implements PanacheRepositoryBase<Event, String> {

    public List<Event> findByProjectId(String projectId) {
        return list("projectId", projectId);
    }
}
