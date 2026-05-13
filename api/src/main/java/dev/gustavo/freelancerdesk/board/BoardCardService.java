package dev.gustavo.freelancerdesk.board;

import dev.gustavo.freelancerdesk.util.IdGenerator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class BoardCardService {

    @Inject
    BoardCardRepository repo;

    public List<BoardCard> listAll() { return repo.listAll(); }

    public BoardCard findById(String id) {
        return repo.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("BoardCard not found: " + id));
    }

    @Transactional
    public BoardCard create(BoardCard card) {
        card.id = IdGenerator.next("c");
        repo.persist(card);
        return card;
    }

    @Transactional
    public BoardCard update(String id, BoardCard patch) {
        BoardCard existing = findById(id);
        existing.title     = patch.title;
        existing.desc      = patch.desc;
        existing.priority  = patch.priority;
        existing.column    = patch.column;
        existing.due       = patch.due;
        return existing;
    }

    @Transactional
    public BoardCard move(String id, String column) {
        BoardCard card = findById(id);
        card.column = column;
        return card;
    }

    @Transactional
    public void delete(String id) { repo.deleteById(id); }
}
