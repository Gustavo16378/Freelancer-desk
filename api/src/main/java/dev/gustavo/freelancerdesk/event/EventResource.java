package dev.gustavo.freelancerdesk.event;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/events")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EventResource {

    @Inject
    EventService service;

    @GET
    public List<Event> list() { return service.listAll(); }

    @GET
    @Path("/{id}")
    public Event get(@PathParam("id") String id) { return service.findById(id); }

    @POST
    public Response create(@Valid Event event) {
        return Response.status(Response.Status.CREATED).entity(service.create(event)).build();
    }

    @PUT
    @Path("/{id}")
    public Event update(@PathParam("id") String id, @Valid Event event) {
        return service.update(id, event);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
