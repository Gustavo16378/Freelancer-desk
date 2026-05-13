package dev.gustavo.freelancerdesk.payment;

import dev.gustavo.freelancerdesk.util.IdGenerator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class PaymentService {

    @Inject
    PaymentRepository repo;

    public List<Payment> listAll() { return repo.listAll(); }

    public Payment findById(String id) {
        return repo.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("Payment not found: " + id));
    }

    @Transactional
    public Payment create(Payment payment) {
        payment.id = IdGenerator.next("pg");
        repo.persist(payment);
        return payment;
    }

    @Transactional
    public Payment update(String id, Payment patch) {
        Payment existing = findById(id);
        existing.projectId   = patch.projectId;
        existing.description = patch.description;
        existing.value       = patch.value;
        existing.dueDate     = patch.dueDate;
        existing.status      = patch.status;
        existing.paidAt      = patch.paidAt;
        return existing;
    }

    @Transactional
    public Payment markReceived(String id) {
        Payment p = findById(id);
        p.status = "recebido";
        p.paidAt = LocalDate.now();
        return p;
    }

    @Transactional
    public Payment markPending(String id) {
        Payment p = findById(id);
        p.status = "pendente";
        p.paidAt = null;
        return p;
    }

    @Transactional
    public void delete(String id) { repo.deleteById(id); }
}
