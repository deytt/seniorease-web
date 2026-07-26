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
import { PageHeader } from "@/presentation/components/ui/pageHeader";
import {
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { getTasksDi } from "@/lib/di/tasksDi";
import { useTasks } from "@/presentation/hooks/useTasks";
import { Task } from "@/domain/entities/Task";
import {
  countTasksCompletedOnDate,
  sortTasksByDueDateDescending,
} from "@/presentation/components/tasks/taskListUtils";
import { formatTaskTime } from "@/presentation/components/dashboard/dashboardUtils";
import {
  getTaskCategoryBadge,
  getTaskPriorityBadge,
} from "@/presentation/components/tasks/taskVisuals";
import {
  DEFAULT_TASK_LIST_FILTER,
  isTaskListFilterEmpty,
  matchesTaskListFilter,
  taskListFilterActiveCount,
  type TaskListFilter,
} from "@/presentation/components/tasks/taskFilter";
import { TaskActiveFilterBar } from "@/presentation/components/tasks/taskActiveFilterBar";
import { TaskFilterSheet } from "@/presentation/components/tasks/taskFilterSheet";
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

  const [filter, setFilter] = useState<TaskListFilter>(DEFAULT_TASK_LIST_FILTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    let result = tasks.filter((task) => matchesTaskListFilter(task, filter));

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }

    return sortTasksByDueDateDescending(result);
  }, [tasks, filter, searchQuery]);

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

  const activeFilterCount = taskListFilterActiveCount(filter);

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

  const TaskCard = ({ task }: { task: Task }) => {
    const priorityBadge = getTaskPriorityBadge(task.priority);
    const categoryBadge = getTaskCategoryBadge(task.category);
    const isCompleted = task.status === "completed";
    const detailsHref = `/tasks/${task.id}`;
    const showGuided =
      !isCompleted && Boolean(task.steps && task.steps.length > 0);

    return (
      <article
        aria-label={`Tarefa: ${task.title}${isCompleted ? " — concluída" : ""}`}
        className={`relative flex flex-col gap-4 rounded-xl border bg-card px-5 py-4 transition-shadow hover:shadow-sm md:flex-row md:items-center ${isCompleted ? "opacity-70" : ""}`}
      >
        <Link
          href={detailsHref}
          className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Abrir detalhes da tarefa ${task.title}`}
        />

        <div className="relative z-10 min-w-0 flex-1 pointer-events-none">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className={`text-base font-semibold ${isCompleted ? "text-primary line-through" : ""}`}
            >
              {task.title}
            </span>
            {priorityBadge && (
              <span
                className={`advanced-only rounded-full border px-2 py-0.5 text-sm font-medium ${priorityBadge.className}`}
              >
                {priorityBadge.label}
              </span>
            )}
            {categoryBadge && (
              <span
                className={`rounded-full border px-2 py-0.5 text-sm font-medium ${categoryBadge.className}`}
              >
                {categoryBadge.label}
              </span>
            )}
          </div>
          {task.description && (
            <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
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

        {showGuided ? (
          <div className="relative z-10 w-full md:w-auto md:flex-shrink-0">
            <Button
              asChild
              size="sm"
              className="w-full border-0 bg-secondary text-secondary-foreground hover:bg-secondary/90 md:w-auto"
            >
              <Link href={`/tasks/${task.id}/guided`}>Modo Guiado</Link>
            </Button>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <TaskFilterSheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilter={filter}
        onApply={setFilter}
      />

      <PageHeader
        title="Minhas Tarefas"
        description={
          stats.scheduledToday > 0
            ? `${stats.completedToday} de ${stats.scheduledToday} concluídas hoje`
            : undefined
        }
        backHref="/dashboard"
        backLabel="Voltar ao Dashboard"
        className="mb-6"
        dataTour="tasks-header"
        tourAction={
          <TourHelpButton
            onClick={beginTour}
            label="Abrir tour guiado das tarefas"
          />
        }
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="relative flex w-full items-center justify-center gap-2 sm:w-auto"
              onClick={() => setIsFilterOpen(true)}
              data-tour="tasks-filter"
              aria-label={
                activeFilterCount > 0
                  ? `Filtrar tarefas, ${activeFilterCount} filtro${activeFilterCount > 1 ? "s" : ""} ativo${activeFilterCount > 1 ? "s" : ""}`
                  : "Filtrar tarefas"
              }
            >
              <Filter className="size-4" aria-hidden />
              Filtrar
              {activeFilterCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
            <Button
              asChild
              size="sm"
              className="flex w-full items-center justify-center sm:w-auto"
              data-tour="tasks-create"
            >
              <Link href="/tasks/create">
                <Plus className="size-4 mr-1" />
                Nova Tarefa
              </Link>
            </Button>
          </div>
        }
      />

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

      {!isTaskListFilterEmpty(filter) ? (
        <TaskActiveFilterBar
          className="mb-6"
          filter={filter}
          onRemoveToday={() =>
            setFilter((prev) => ({ ...prev, isToday: false }))
          }
          onRemoveCategory={() =>
            setFilter((prev) => ({ ...prev, category: null }))
          }
          onRemovePriority={() =>
            setFilter((prev) => ({ ...prev, priority: null }))
          }
          onRemoveStatus={() =>
            setFilter((prev) => ({ ...prev, status: null }))
          }
        />
      ) : null}

      <div data-tour="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-10 text-center">
            <AlertCircle className="size-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-semibold mb-1">Nenhuma tarefa encontrada</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || !isTaskListFilterEmpty(filter)
                ? "Tente outros termos de busca ou remova os filtros."
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
