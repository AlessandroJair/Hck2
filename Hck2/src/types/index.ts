// Types for API responses and data models

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
  tasks?: Task[];
}

export interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  project?: Project;
  assignedUser?: User;
}

export interface TasksResponse {
  tasks: Task[];
  totalPages: number;
  currentPage?: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: string;
  priority: TaskPriority;
  dueDate: string;
  assignedTo?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
}

export interface TeamMembersResponse {
  members: TeamMember[];
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}
