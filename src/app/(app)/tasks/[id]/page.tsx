"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTaskDetailsTour } from "@/presentation/hooks/useTaskDetailsTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { Card, CardContent } from "@/presentation/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/presentation/components/ui/dialog";
import { ChevronLeft, CheckCircle2, Play, Trash2, Clock } from "lucide-react";
import { getTasksDi } from "@/lib/di/tasksDi";
import { useTasks } from "@/presentation/hooks/useTasks";
import type { Task } from "@/domain/entities/Task";
import type { TaskStep } from "@/domain/entities/TaskStep";
import { useSeniorFeedback } from "@/lib/feedback/useSeniorFeedback";

export default function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: taskId } = use(params);
  const router = useRouter();
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useTaskDetailsTour({
    userId: user?.id,
    interfaceMode: preferences.interfaceMode,
  });

  const taskRepository = getTasksDi().taskRepository;
  const { fetchTaskById } = useTasks(taskRepository);
  const feedback = useSeniorFeedback();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      feedback.success();
      if (task) setTask({ ...task, status: "completed" });
    } catch (error) {
      console.error("Erro ao marcar como concluída:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const deleteUseCase = getTasksDi().deleteTaskUseCase;
      await deleteUseCase.execute(taskId);
      router.push("/tasks");
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getPriorityBadge = (priority?: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      high: {
        label: "Alta Prioridade",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      medium: {
        label: "Média Prioridade",
        color:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      low: {
        label: "Baixa Prioridade",
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
      health: "Saúde",
      exercise: "Exercício",
      social: "Social",
      personal: "Pessoal",
    };
    return labels[category || ""] || category || "";
  };

  const getStatusBadge = (status?: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      pending: {
        label: "Pendente",
        color:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      },
      in_progress: {
        label: "Em Andamento",
        color:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      },
      completed: {
        label: "Concluída",
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
    return isToday ? "Hoje" : d.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando tarefa...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">
          {error || "Tarefa não encontrada"}
        </p>
        <Button asChild variant="outline">
          <Link href="/tasks">Voltar para Minhas Tarefas</Link>
        </Button>
      </div>
    );
  }

  const priorityBadge = getPriorityBadge(task.priority);
  const statusBadge = getStatusBadge(task.status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
      {/* Modal de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Excluir tarefa?</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir esta tarefa?
              <br />
              Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header - Back Button */}
      <Link href="/tasks">
        <Button variant="ghost" size="sm" className="mb-6">
          <ChevronLeft className="size-4 mr-2" />
          Voltar para Tarefas
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
              <div
                className="flex items-start justify-between gap-4"
                data-tour="task-details-header"
              >
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                </div>
                <div className="flex gap-2">
                  <TourHelpButton
                    onClick={beginTour}
                    label="Abrir tour guiado dos detalhes da tarefa"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Excluir tarefa"
                    onClick={() => setIsDeleteDialogOpen(true)}
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
              <div className="rounded-lg border border-border bg-muted p-4">
                <div className="grid grid-cols-3 gap-6">
                  {/* Due Time */}
                  {task.dueDate && (
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wide">
                        Horário de Entrega
                      </p>
                      <p className="text-lg font-semibold text-foreground">
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
                      <p className="text-lg font-semibold text-foreground">
                        {getCategoryLabel(task.category)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Checklist Card */}
          {task.steps && task.steps.length > 0 && (
            <Card data-tour="task-details-steps">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-semibold">
                  Checklist Passo a Passo
                </h2>
                <div className="space-y-3">
                  {task.steps.map((step: TaskStep, index: number) => (
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
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4"
                  data-tour="task-details-actions"
                >
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
                defaultValue={task.description || ""}
                placeholder="Adicionar notas sobre esta tarefa..."
                readOnly
                className="w-full h-24 p-3 border rounded-lg bg-muted/50 text-sm resize-none"
              />
            </CardContent>
          </Card>

          {/* Notification Card — aviso baseado no dueDate (ADR-020) */}
          {task.dueDate && (
            <Card className="border-warning/40 bg-warning-light">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                  <Clock className="size-4 text-warning" aria-hidden />
                  Notificação
                </h3>
                <div className="rounded-lg border border-warning/30 bg-card p-3">
                  <p className="text-sm font-semibold text-foreground">
                    {formatTime(task.dueDate)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    O aviso é enviado conforme as preferências de notificação de
                    tarefas (antecedência configurada no perfil).
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TourOfferDialog
        open={showOfferDialog}
        title={offerTitle}
        description={offerDescription}
        onDismiss={dismissOffer}
        onStart={beginTour}
      />
    </div>
  );
}
