package dev.gustavo.freelancerdesk.board;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/api/board-cards")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BoardCardResource {

    @Inject
    BoardCardService service;

    @GET
    public List<BoardCard> list() { return service.listAll(); }

    @GET
    @Path("/{id}")
    public BoardCard get(@PathParam("id") String id) { return service.findById(id); }

    @POST
    public Response create(@Valid BoardCard card) {
        return Response.status(Response.Status.CREATED).entity(service.create(card)).build();
    }

    @PUT
    @Path("/{id}")
    public BoardCard update(@PathParam("id") String id, @Valid BoardCard card) {
        return service.update(id, card);
    }

    @PUT
    @Path("/{id}/move")
    public BoardCard move(@PathParam("id") String id, Map<String, String> body) {
        String column = body.get("column");
        if (column == null) throw new BadRequestException("Missing 'column' field");
        return service.move(id, column);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
