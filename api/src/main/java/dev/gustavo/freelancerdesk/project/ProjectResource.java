package dev.gustavo.freelancerdesk.project;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProjectResource {

    @Inject
    ProjectService service;

    @GET
    public List<Project> list() {
        return service.listAll();
    }

    @GET
    @Path("/{id}")
    public Project get(@PathParam("id") String id) {
        return service.findById(id);
    }

    @POST
    public Response create(@Valid Project project) {
        return Response.status(Response.Status.CREATED).entity(service.create(project)).build();
    }

    @PUT
    @Path("/{id}")
    public Project update(@PathParam("id") String id, @Valid Project project) {
        return service.update(id, project);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
