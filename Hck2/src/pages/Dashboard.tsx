import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Card } from "../components/common/Card";
import { Loader } from "../components/common/Loader";
import { taskService } from "../services/taskService";
import type { DashboardStats } from "../types";

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [allTasks, completedTasks] = await Promise.all([
        taskService.getTasks(),
        taskService.getTasks({ status: "COMPLETED" }),
      ]);

      const now = new Date();
      const overdue = allTasks.tasks.filter(
        (task) => new Date(task.dueDate) < now && task.status !== "COMPLETED"
      ).length;

      setStats({
        totalTasks: allTasks.tasks.length,
        completedTasks: completedTasks.tasks.length,
        pendingTasks: allTasks.tasks.filter((t) => t.status !== "COMPLETED")
          .length,
        overdueTasks: overdue,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      title: "Total de Tareas",
      value: stats.totalTasks,
      color: "bg-blue-500",
      icon: "📝",
    },
    {
      title: "Completadas",
      value: stats.completedTasks,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      title: "Pendientes",
      value: stats.pendingTasks,
      color: "bg-yellow-500",
      icon: "⏳",
    },
    {
      title: "Vencidas",
      value: stats.overdueTasks,
      color: "bg-red-500",
      icon: "⚠️",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido a TechFlow Task Management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Acciones Rápidas">
            <div className="space-y-3">
              <Link
                to="/tasks"
                className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">➕</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Crear Nueva Tarea
                    </h4>
                    <p className="text-sm text-gray-600">
                      Agrega una tarea a tu proyecto
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                to="/projects"
                className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📁</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Ver Proyectos
                    </h4>
                    <p className="text-sm text-gray-600">
                      Gestiona tus proyectos activos
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                to="/team"
                className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ver Equipo</h4>
                    <p className="text-sm text-gray-600">
                      Colabora con tu equipo
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>

          <Card title="Estadísticas del Proyecto">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Progreso General
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.totalTasks > 0
                      ? Math.round(
                          (stats.completedTasks / stats.totalTasks) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        stats.totalTasks > 0
                          ? (stats.completedTasks / stats.totalTasks) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Tienes <strong>{stats.pendingTasks}</strong> tareas pendientes
                </p>
                {stats.overdueTasks > 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ <strong>{stats.overdueTasks}</strong> tareas vencidas
                    requieren atención
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
