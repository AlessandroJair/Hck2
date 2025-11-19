import type { TasksResponse, TeamMember } from "../types";
import api from "./api";

export const teamService = {
  async getTeamMembers(): Promise<{ members: TeamMember[] }> {
    const response = await api.get("/team/members");
    return response.data;
  },

  async getMemberTasks(memberId: string): Promise<TasksResponse> {
    const response = await api.get(`/team/members/${memberId}/tasks`);
    return response.data;
  },
};
