"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTasksListTour } from "@/presentation/hooks/useTasksListTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { getTasksDi } from "@/lib/di/tasksDi";
import { useTasks } from "@/presentation/hooks/useTasks";
import { Task, TaskCategory } from "@/domain/entities/Task";
import {
  countTasksCompletedOnDate,
  sortTasksByDueDateDescending,
} from "@/presentation/components/tasks/taskListUtils";
import { formatTaskTime } from "@/presentation/components/dashboard/dashboardUtils";
import { toast } from "@/presentation/lib/feedbackToast";
import { consumeTaskNavigationFeedback } from "@/presentation/components/tasks/taskNavigationFeedback";

export default function TaskListPage() {
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const taskRepository = getTasksDi().taskRepository;
  const { tasks, loading, fetchTasks } = useTasks(taskRepository);
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useTasksListTour({
    userId: user?.id,
    interfaceMode: preferences.interfaceMode,
  });

  const [filterToday, setFilterToday] = useState(false);
  const [filterCategory, setFilterCategory] = useState<TaskCategory | null>(
    null,
  );
  const [filterPriority, setFilterPriority] = useState<
    "high" | "medium" | "low" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Temporary filter state for modal
  const [tempFilterToday, setTempFilterToday] = useState(filterToday);
  const [tempFilterCategory, setTempFilterCategory] = useState(filterCategory);
  const [tempFilterPriority, setTempFilterPriority] = useState(filterPriority);

  useEffect(() => {
    if (user?.id) {
      fetchTasks(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const feedback = consumeTaskNavigationFeedback();

    if (feedback === "created") {
      toast.success("Tarefa criada com sucesso!");
    } else if (feedback === "deleted") {
      toast.success("Tarefa excluída com sucesso!");
    }
  }, []);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filter by today
    if (filterToday) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((t) => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
    }

    // Filter by category
    if (filterCategory) {
      result = result.filter((t) => t.category === filterCategory);
    }

    // Filter by priority
    if (filterPriority) {
      result = result.filter((t) => t.priority === filterPriority);
    }

    // Filter by search
    if (searchQuery.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return sortTasksByDueDateDescending(result);
  }, [tasks, filterToday, filterCategory, filterPriority, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = countTasksCompletedOnDate(tasks, today);

    const scheduledToday = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length;

    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      completedToday,
      scheduledToday,
    };
  }, [tasks]);

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-center min-h-screen"
      >
        <p className="text-muted-foreground">Carregando tarefas...</p>
      </div>
    );
  }

  const getPriorityBadge = (priority?: string) => {
    const map: Record<string, { label: string; className: string }> = {
      high: {
        label: "Alta",
        className:
          "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
      },
      medium: {
        label: "Média",
        className:
          "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      low: {
        label: "Baixa",
        className:
          "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400",
      },
    };
    return priority ? map[priority] : null;
  };

  const getCategoryBadge = (category?: string) => {
    const map: Record<string, { label: string; className: string }> = {
      medication: {
        label: "Medicação",
        className:
          "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
      },
      health: {
        label: "Saúde",
        className:
          "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
      },
      exercise: {
        label: "Exercício",
        className:
          "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
      },
      social: {
        label: "Social",
        className:
          "text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400",
      },
      personal: {
        label: "Pessoal",
        className:
          "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
      },
    };
    return category ? map[category] : null;
  };

  const getCategoryLabel = (category: TaskCategory): string => {
    const map: Record<TaskCategory, string> = {
      medication: "Medicação",
      health: "Saúde",
      exercise: "Exercício",
      social: "Social",
      personal: "Pessoal",
    };
    return map[category] || category;
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priorityBadge = getPriorityBadge(task.priority);
    const categoryBadge = getCategoryBadge(task.category);
    const isCompleted = task.status === "completed";

    return (
      <article
        aria-label={`Tarefa: ${task.title}${isCompleted ? " — concluída" : ""}`}
        className={`flex flex-col md:flex-row md:items-center gap-4 bg-card border rounded-xl px-5 py-4 hover:shadow-sm transition-shadow ${isCompleted ? "opacity-70" : ""}`}
      >
        {/* Status visual */}
        <div className="flex-shrink-0 flex md:block" aria-hidden="true">
          {isCompleted ? (
            <CheckCircle2 className="size-6 text-primary" />
          ) : (
            <div className="size-6 rounded-full border-2 border-muted-foreground/40" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row with inline badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`font-semibold text-base ${isCompleted ? "text-primary line-through" : ""}`}
            >
              {task.title}
            </span>
            {priorityBadge && (
              <span
                className={`advanced-only text-xs font-medium px-2 py-0.5 rounded-full border ${priorityBadge.className}`}
              >
                {priorityBadge.label}
              </span>
            )}
            {categoryBadge && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryBadge.className}`}
              >
                {categoryBadge.label}
              </span>
            )}
          </div>
          {/* Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {task.description}
            </p>
          )}
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formatTaskTime(task.dueDate)}
              </span>
            )}
            {task.steps && task.steps.length > 0 && (
              <span>
                {task.steps.length}{" "}
                {task.steps.length === 1 ? "passo" : "passos"}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full md:w-auto md:flex-shrink-0 flex flex-col md:flex-row md:items-center gap-2">
          {!isCompleted && task.steps && task.steps.length > 0 && (
            <Button
              asChild
              size="sm"
              className="border-0 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href={`/tasks/${task.id}/guided`}>Modo Guiado</Link>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            variant="outline"
            className="md:w-auto w-full"
          >
            <Link href={`/tasks/${task.id}`}>Detalhes</Link>
          </Button>
        </div>
      </article>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent
          className="max-h-[80vh] overflow-y-auto pr-6"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle>Filtrar Tarefas</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Data Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Data</h3>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-input hover:border-primary/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={tempFilterToday}
                  onChange={(e) => setTempFilterToday(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Tarefas de Hoje</div>
                  <div className="text-xs text-muted-foreground">
                    Mostrar apenas tarefas agendadas para hoje
                  </div>
                </div>
              </label>
            </div>

            {/* Category Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Categoria
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "health",
                    "medication",
                    "social",
                    "exercise",
                    "personal",
                  ] as TaskCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setTempFilterCategory(
                        tempFilterCategory === cat ? null : cat,
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      tempFilterCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-input hover:border-primary/50"
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Section — oculto no Modo Básico */}
            <div className="advanced-only space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Prioridade
              </h3>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() =>
                      setTempFilterPriority(
                        tempFilterPriority === priority ? null : priority,
                      )
                    }
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      tempFilterPriority === priority
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-input hover:border-primary/50"
                    }`}
                  >
                    {priority === "high"
                      ? "Alta"
                      : priority === "medium"
                        ? "Média"
                        : "Baixa"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-3 pt-4 border-t">
            {(tempFilterToday || tempFilterCategory || tempFilterPriority) && (
              <button
                onClick={() => {
                  setTempFilterToday(false);
                  setTempFilterCategory(null);
                  setTempFilterPriority(null);
                }}
                className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
              >
                Limpar Filtros
              </button>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsFilterOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setFilterToday(tempFilterToday);
                  setFilterCategory(tempFilterCategory);
                  setFilterPriority(tempFilterPriority);
                  setIsFilterOpen(false);
                }}
              >
                {tempFilterToday || tempFilterCategory || tempFilterPriority
                  ? "Aplicar Filtros"
                  : "Mostrar Tudo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header - Responsive Layout */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        data-tour="tasks-header"
      >
        <div>
          <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
          {stats.scheduledToday > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {stats.completedToday} de {stats.scheduledToday} concluídas hoje
            </p>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2"
            onClick={() => setIsFilterOpen(true)}
            data-tour="tasks-filter"
          >
            <Filter className="size-4" />
            Filtrar
          </Button>
          <Button
            asChild
            size="sm"
            className="flex items-center justify-center"
            data-tour="tasks-create"
          >
            <Link href="/tasks/create">
              <Plus className="size-4 mr-1" />
              Nova Tarefa
            </Link>
          </Button>
          <TourHelpButton
            onClick={beginTour}
            label="Abrir tour guiado das tarefas"
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5" data-tour="tasks-search">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        />
        <label htmlFor="task-search" className="sr-only">
          Pesquisar tarefas
        </label>
        <input
          id="task-search"
          type="search"
          placeholder="Pesquisar tarefas..."
          aria-label="Pesquisar tarefas"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Active Filter Bar - only show when filter is applied */}
      {(filterToday || filterCategory || filterPriority) && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <span className="text-sm text-muted-foreground">Filtrando por:</span>
          <div className="flex flex-wrap gap-2">
            {filterToday && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                Hoje
              </span>
            )}
            {filterCategory && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                {getCategoryLabel(filterCategory)}
              </span>
            )}
            {filterPriority && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                {filterPriority === "high"
                  ? "Alta"
                  : filterPriority === "medium"
                    ? "Média"
                    : "Baixa"}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setFilterToday(false);
              setFilterCategory(null);
              setFilterPriority(null);
            }}
            className="ml-auto text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Remover filtro
          </button>
        </div>
      )}

      {/* Task List */}
      <div data-tour="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-10 text-center">
            <AlertCircle className="size-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-semibold mb-1">Nenhuma tarefa encontrada</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Tente outros termos de busca."
                : "Crie sua primeira tarefa para começar."}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/tasks/create">
                <Plus className="size-4 mr-1" />
                Nova Tarefa
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
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
