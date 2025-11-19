import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Card } from "../components/common/Card";
import { Loader } from "../components/common/Loader";
import { teamService } from "../services/teamService";
import type { Task, TeamMember } from "../types";

export const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await teamService.getTeamMembers();
      setTeamMembers(response.members);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberTasks = async (memberId: string) => {
    try {
      setIsLoadingTasks(true);
      const response = await teamService.getMemberTasks(memberId);
      setMemberTasks(response.tasks);
    } catch (error) {
      console.error("Error fetching member tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
    fetchMemberTasks(member.id);
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipo</h1>
          <p className="text-gray-600 mt-1">Colabora con tu equipo</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Miembros del Equipo" className="lg:col-span-1">
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedMember?.id === member.id
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="lg:col-span-2">
              {selectedMember ? (
                <Card title={`Tareas de ${selectedMember.name}`}>
                  {isLoadingTasks ? (
                    <div className="flex justify-center py-8">
                      <Loader />
                    </div>
                  ) : memberTasks.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                      Este miembro no tiene tareas asignadas
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {memberTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    statusColors[task.status]
                                  }`}
                                >
                                  {statusLabels[task.status]}
                                </span>
                                <span className="text-xs text-gray-500">
                                  📅{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ) : (
                <Card>
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Selecciona un miembro del equipo para ver sus tareas
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
