import type {
  CreateTaskRequest,
  Task,
  TasksResponse,
  TaskStatus,
  UpdateTaskRequest,
} from "../types";
import api from "./api";

export const taskService = {
  async getTasks(params?: {
    projectId?: string;
    status?: TaskStatus;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<TasksResponse> {
    const response = await api.get<TasksResponse>("/tasks", { params });
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>("/tasks", task);
    return response.data;
  },

  async updateTask(id: string, task: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async deleteTask(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
