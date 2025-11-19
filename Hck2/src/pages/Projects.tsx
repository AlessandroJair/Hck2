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
import type { Project, ProjectStatus } from "../types";

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE" as ProjectStatus,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectService.getProjects(
        currentPage,
        10,
        searchTerm
      );
      setProjects(response.projects);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: "",
        description: "",
        status: "ACTIVE",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      status: "ACTIVE",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData);
      } else {
        await projectService.createProject(formData);
      }
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        await projectService.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    ON_HOLD: "bg-yellow-100 text-yellow-800",
  };

  const statusLabels = {
    ACTIVE: "Activo",
    COMPLETED: "Completado",
    ON_HOLD: "En Espera",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <p className="text-gray-600 mt-1">Gestiona tus proyectos</p>
          </div>
          <Button onClick={() => handleOpenModal()}>➕ Nuevo Proyecto</Button>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600">No hay proyectos todavía</p>
              <Button onClick={() => handleOpenModal()} className="mt-4">
                Crear Primer Proyecto
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {project.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[project.status]
                          }`}
                        >
                          {statusLabels[project.status]}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(project)}
                        className="flex-1"
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(project.id)}
                        className="flex-1"
                      >
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Anterior
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente →
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Proyecto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Ej: Proyecto Alpha"
          />

          <Textarea
            label="Descripción"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={4}
            placeholder="Describe el proyecto..."
          />

          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as ProjectStatus,
              })
            }
            options={[
              { value: "ACTIVE", label: "Activo" },
              { value: "COMPLETED", label: "Completado" },
              { value: "ON_HOLD", label: "En Espera" },
            ]}
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingProject ? "Actualizar" : "Crear"} Proyecto
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
