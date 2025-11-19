import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Loader } from "../components/common/Loader";
import { Modal } from "../components/common/Modal";
import { Select } from "../components/common/Select";
import { Textarea } from "../components/common/Textarea";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import { teamService } from "../services/teamService";
import type {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
  TeamMember,
} from "../types";

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    projectId: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "MEDIUM" as TaskPriority,
    dueDate: "",
    assignedTo: "",
  });

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [projectsRes, membersRes] = await Promise.all([
        projectService.getProjects(1, 100),
        teamService.getTeamMembers(),
      ]);
      setProjects(projectsRes.projects);
      setTeamMembers(membersRes.members);
      fetchTasks();
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const params: {
        status?: TaskStatus;
        priority?: string;
        projectId?: string;
      } = {};

      if (filters.status) params.status = filters.status as TaskStatus;
      if (filters.priority) params.priority = filters.priority;
      if (filters.projectId) params.projectId = filters.projectId;

      const response = await taskService.getTasks(params);
      setTasks(response.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        priority: task.priority,
        dueDate: task.dueDate.split("T")[0],
        assignedTo: task.assignedTo || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        projectId: projects[0]?.id || "",
        priority: "MEDIUM",
        dueDate: "",
        assignedTo: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData);
      } else {
        await taskService.createTask({
          ...formData,
          assignedTo: formData.assignedTo || undefined,
        });
      }
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      try {
        await taskService.deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const priorityColors = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
  };

  const statusColors = {
    TODO: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  const statusLabels = {
    TODO: "Por Hacer",
    IN_PROGRESS: "En Progreso",
    COMPLETED: "Completada",
  };

  const priorityLabels = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    URGENT: "Urgente",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
            <p className="text-gray-600 mt-1">Gestiona tus tareas</p>
          </div>
          <Button onClick={() => handleOpenModal()}>➕ Nueva Tarea</Button>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Estado"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              options={[
                { value: "", label: "Todos" },
                { value: "TODO", label: "Por Hacer" },
                { value: "IN_PROGRESS", label: "En Progreso" },
                { value: "COMPLETED", label: "Completada" },
              ]}
            />
            <Select
              label="Prioridad"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              options={[
                { value: "", label: "Todas" },
                { value: "LOW", label: "Baja" },
                { value: "MEDIUM", label: "Media" },
                { value: "HIGH", label: "Alta" },
                { value: "URGENT", label: "Urgente" },
              ]}
            />
            <Select
              label="Proyecto"
              value={filters.projectId}
              onChange={(e) =>
                setFilters({ ...filters, projectId: e.target.value })
              }
              options={[
                { value: "", label: "Todos" },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
          </div>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600">
                No hay tareas que coincidan con los filtros
              </p>
              <Button onClick={() => handleOpenModal()} className="mt-4">
                Crear Primera Tarea
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[task.status]
                        }`}
                      >
                        {statusLabels[task.status]}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>
                        📅 Vence: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.assignedTo && <span>👤 Asignado</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.value as TaskStatus
                        )
                      }
                      options={[
                        { value: "TODO", label: "⏳ Por Hacer" },
                        { value: "IN_PROGRESS", label: "🔄 En Progreso" },
                        { value: "COMPLETED", label: "✅ Completada" },
                      ]}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(task)}
                        className="flex-1"
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(task.id)}
                        className="flex-1"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Editar Tarea" : "Nueva Tarea"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título de la Tarea"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Ej: Implementar login"
          />

          <Textarea
            label="Descripción"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={4}
            placeholder="Describe la tarea..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Proyecto"
              value={formData.projectId}
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value })
              }
              required
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />

            <Select
              label="Prioridad"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as TaskPriority,
                })
              }
              options={[
                { value: "LOW", label: "Baja" },
                { value: "MEDIUM", label: "Media" },
                { value: "HIGH", label: "Alta" },
                { value: "URGENT", label: "Urgente" },
              ]}
            />

            <Input
              label="Fecha de Vencimiento"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
            />

            <Select
              label="Asignar a"
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              options={[
                { value: "", label: "Sin asignar" },
                ...teamMembers.map((m) => ({ value: m.id, label: m.name })),
              ]}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingTask ? "Actualizar" : "Crear"} Tarea
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
