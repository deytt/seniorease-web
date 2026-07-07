"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ChevronLeft, CheckCircle2, Play, Trash2, Clock } from "lucide-react";
import { getTasksDi } from "@/lib/di/tasksDi";
import { useTasks } from "@/presentation/hooks/useTasks";

export default function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: taskId } = use(params);
  const router = useRouter();
  const { user } = useAuthContext();

  const taskRepository = getTasksDi().taskRepository;
  const { fetchTaskById } = useTasks(taskRepository);

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const loadTask = async () => {
      try {
        setLoading(true);
        const loadedTask = await fetchTaskById(taskId);
        setTask(loadedTask);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar tarefa",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId, fetchTaskById]);

  const handleMarkAsComplete = async () => {
    try {
      const completeUseCase = getTasksDi().completeTaskUseCase;
      await completeUseCase.execute(taskId);
      setTask({ ...task, status: "completed" });
    } catch (error) {
      console.error("Erro ao marcar como concluída:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta atividade?")) return;
    try {
      const deleteUseCase = getTasksDi().deleteTaskUseCase;
      await deleteUseCase.execute(taskId);
      router.push("/tasks");
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const getPriorityBadge = (priority?: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      high: {
        label: "High Priority",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      medium: {
        label: "Medium Priority",
        color:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      low: {
        label: "Low Priority",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      },
    };
    const config = configs[priority || ""] || {
      label: priority || "",
      color: "",
    };
    return config;
  };

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      medication: "Medicação",
      health: "Health",
      exercise: "Exercise",
      social: "Social",
      personal: "Personal",
    };
    return labels[category || ""] || category || "";
  };

  const getStatusBadge = (status?: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      pending: {
        label: "Pending",
        color:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      },
      in_progress: {
        label: "In Progress",
        color:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      },
      completed: {
        label: "Completed",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      },
    };
    const config = configs[status || ""] || { label: status || "", color: "" };
    return config;
  };

  const formatTime = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    return isToday ? "Today" : d.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando atividade...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">
          {error || "Atividade não encontrada"}
        </p>
        <Button asChild variant="outline">
          <Link href="/tasks">Voltar para Minhas Atividades</Link>
        </Button>
      </div>
    );
  }

  const priorityBadge = getPriorityBadge(task.priority);
  const statusBadge = getStatusBadge(task.status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
      {/* Header - Back Button */}
      <Link href="/tasks">
        <Button variant="ghost" size="sm" className="mb-6">
          <ChevronLeft className="size-4 mr-2" />
          Voltar para Atividades
        </Button>
      </Link>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Information Card */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {task.priority && (
                  <Badge className={`${priorityBadge.color} border-0`}>
                    {priorityBadge.label}
                  </Badge>
                )}
                {task.category && (
                  <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0">
                    {getCategoryLabel(task.category)}
                  </Badge>
                )}
                {task.status && (
                  <Badge className={`${statusBadge.color} border-0`}>
                    {statusBadge.label}
                  </Badge>
                )}
              </div>

              {/* Title and Action Buttons */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-base text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Meta Information - 3 Columns */}
              <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-6">
                  {/* Due Time */}
                  {task.dueDate && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wide">
                        Horário de Entrega
                      </p>
                      <p className="text-lg font-semibold">
                        {formatTime(task.dueDate)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(task.dueDate)}
                      </p>
                    </div>
                  )}

                  {/* Category */}
                  {task.category && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wide">
                        Categoria
                      </p>
                      <p className="text-lg font-semibold">
                        {getCategoryLabel(task.category)}
                      </p>
                    </div>
                  )}

                  {/* Reminder */}
                  {task.reminderTime && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wide">
                        Lembrete
                      </p>
                      <p className="text-lg font-semibold">
                        {task.reminderTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Checklist Card */}
          {task.steps && task.steps.length > 0 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">
                  Checklist Passo a Passo
                </h2>
                <div className="space-y-3">
                  {task.steps.map((step: any, index: number) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {/* Step Number Circle */}
                      <div className="flex-shrink-0">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm text-white ${
                            step.isCompleted ? "bg-green-500" : "bg-blue-500"
                          }`}
                        >
                          {step.isCompleted ? (
                            <CheckCircle2 className="size-5" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-base ${
                            step.isCompleted
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {step.title || step.instruction}
                        </p>
                        {step.title && step.instruction && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.instruction}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {task.steps &&
                    task.steps.length > 0 &&
                    task.status !== "completed" && (
                      <Button
                        asChild
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Link href={`/tasks/${taskId}/guided`}>
                          <Play className="size-4 mr-2" />
                          Modo Guiado
                        </Link>
                      </Button>
                    )}
                  {task.status !== "completed" && (
                    <Button
                      onClick={handleMarkAsComplete}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="size-4 mr-2" />
                      Concluir Tarefa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Task Notes Card */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-semibold text-base">Notas da Tarefa</h3>
              <textarea
                defaultValue={task.notes || ""}
                placeholder="Adicionar notas sobre esta atividade..."
                readOnly
                className="w-full h-24 p-3 border rounded-lg bg-muted/50 text-sm resize-none"
              />
            </CardContent>
          </Card>

          {/* Reminder Card */}
          {task.dueDate && (
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <Clock className="size-4 text-amber-600" />
                  Lembrete
                </h3>
                <div className="bg-amber-100/50 dark:bg-amber-900/30 rounded-lg p-3">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {formatTime(task.dueDate)}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                    {task.reminderTime || "Nenhum lembrete configurado"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
