package dev.gustavo.freelancerdesk.update;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/updates")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProjectUpdateResource {

    @Inject
    ProjectUpdateService service;

    @GET
    public List<ProjectUpdate> list(@QueryParam("projectId") String projectId) {
        if (projectId != null) return service.listByProject(projectId);
        return service.listAll();
    }

    @GET
    @Path("/{id}")
    public ProjectUpdate get(@PathParam("id") String id) { return service.findById(id); }

    @POST
    public Response create(@Valid ProjectUpdate update) {
        return Response.status(Response.Status.CREATED).entity(service.create(update)).build();
    }

    @PUT
    @Path("/{id}")
    public ProjectUpdate update(@PathParam("id") String id, @Valid ProjectUpdate update) {
        return service.update(id, update);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
