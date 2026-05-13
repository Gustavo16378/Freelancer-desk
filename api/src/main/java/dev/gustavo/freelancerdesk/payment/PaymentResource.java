package dev.gustavo.freelancerdesk.payment;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/payments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentResource {

    @Inject
    PaymentService service;

    @GET
    public List<Payment> list() { return service.listAll(); }

    @GET
    @Path("/{id}")
    public Payment get(@PathParam("id") String id) { return service.findById(id); }

    @POST
    public Response create(@Valid Payment payment) {
        return Response.status(Response.Status.CREATED).entity(service.create(payment)).build();
    }

    @PUT
    @Path("/{id}")
    public Payment update(@PathParam("id") String id, @Valid Payment payment) {
        return service.update(id, payment);
    }

    @PUT
    @Path("/{id}/received")
    public Payment markReceived(@PathParam("id") String id) {
        return service.markReceived(id);
    }

    @PUT
    @Path("/{id}/pending")
    public Payment markPending(@PathParam("id") String id) {
        return service.markPending(id);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
