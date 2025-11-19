import type { Project, ProjectsResponse } from "../types";
import api from "./api";

export const projectService = {
  async getProjects(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<ProjectsResponse> {
    const response = await api.get<ProjectsResponse>("/projects", {
      params: { page, limit, search },
    });
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    const response = await api.post<Project>("/projects", project);
    return response.data;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, project);
    return response.data;
  },

  async deleteProject(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
