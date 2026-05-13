package dev.gustavo.freelancerdesk.event;

import dev.gustavo.freelancerdesk.util.IdGenerator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class EventService {

    @Inject
    EventRepository repo;

    public List<Event> listAll() { return repo.listAll(); }

    public Event findById(String id) {
        return repo.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("Event not found: " + id));
    }

    @Transactional
    public Event create(Event event) {
        event.id = IdGenerator.next("e");
        repo.persist(event);
        return event;
    }

    @Transactional
    public Event update(String id, Event patch) {
        Event existing = findById(id);
        existing.title     = patch.title;
        existing.date      = patch.date;
        existing.time      = patch.time;
        existing.type      = patch.type;
        existing.projectId = patch.projectId;
        existing.notes     = patch.notes;
        return existing;
    }

    @Transactional
    public void delete(String id) { repo.deleteById(id); }
}
