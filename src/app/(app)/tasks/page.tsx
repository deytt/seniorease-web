"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { Button } from "@/presentation/components/ui/button";
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

export default function TaskListPage() {
  const { user } = useAuthContext();
  const taskRepository = getTasksDi().taskRepository;
  const { tasks, loading, fetchTasks } = useTasks(taskRepository);

  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "today" | TaskCategory
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchTasks(user.id);
    }
  }, [user?.id]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filter by status
    if (filterStatus === "pending") {
      result = result.filter((t) => t.status === "pending");
    } else if (filterStatus === "completed") {
      result = result.filter((t) => t.status === "completed");
    }

    // Filter by category/date
    if (filterCategory === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((t) => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
    } else if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return result;
  }, [tasks, filterStatus, filterCategory, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = tasks.filter((t) => {
      if (t.status !== "completed" || !t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length;

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando atividades...</p>
      </div>
    );
  }

  const getPriorityBadge = (priority?: string) => {
    const map: Record<string, { label: string; className: string }> = {
      high: {
        label: "high",
        className:
          "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
      },
      medium: {
        label: "medium",
        className:
          "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      low: {
        label: "low",
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

  const formatTaskTime = (dueDate?: Date | string) => {
    if (!dueDate) return null;
    const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priorityBadge = getPriorityBadge(task.priority);
    const categoryBadge = getCategoryBadge(task.category);
    const isCompleted = task.status === "completed";

    return (
      <div
        className={`flex items-center gap-4 bg-card border rounded-xl px-5 py-4 hover:shadow-sm transition-shadow ${isCompleted ? "opacity-70" : ""}`}
      >
        {/* Checkbox */}
        <div className="flex-shrink-0">
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
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityBadge.className}`}
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
        <div className="flex-shrink-0 flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
          >
            <Link href={`/tasks/${task.id}/guided`}>Guiado</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/tasks/${task.id}`}>Detalhes</Link>
          </Button>
        </div>
      </div>
    );
  };

  const filterPills = [
    { key: "all", label: "Tudo" },
    { key: "today", label: "Hoje" },
    { key: "health", label: "Saúde" },
    { key: "medication", label: "Medicação" },
    { key: "social", label: "Social" },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Minhas Atividades</h1>
          {stats.scheduledToday > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {stats.completedToday} de {stats.scheduledToday} concluídas hoje
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="size-4" />
            Filtrar
          </Button>
          <Button asChild size="sm">
            <Link href="/tasks/create">
              <Plus className="size-4 mr-1" />
              Nova Atividade
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar atividades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Category Pill Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterPills.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterCategory(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterCategory === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-input hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-10 text-center">
          <AlertCircle className="size-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold mb-1">Nenhuma atividade encontrada</p>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? "Tente outros termos de busca."
              : "Crie sua primeira atividade para começar."}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/tasks/create">
              <Plus className="size-4 mr-1" />
              Nova Atividade
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
  );
}
