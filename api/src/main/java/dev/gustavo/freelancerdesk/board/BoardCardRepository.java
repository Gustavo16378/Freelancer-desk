package dev.gustavo.freelancerdesk.board;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class BoardCardRepository implements PanacheRepositoryBase<BoardCard, String> {
}
