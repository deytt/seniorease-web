import type { Task } from "@/domain/entities/Task";
import type { Reminder } from "@/domain/entities/Reminder";
import { isGuidedTaskCandidate } from "@/presentation/components/tasks/guidedTaskUtils";
import { sortTasksByDueDateDescending } from "@/presentation/components/tasks/taskListUtils";

export interface DashboardTaskStats {
  completedYesterday: number;
  completedToday: number;
  /** Todas as tarefas não concluídas (pending + in_progress). */
  pending: number;
}

export function getDashboardGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function getDashboardGreetingEmoji(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "☀️";
  if (hour < 18) return "🌤️";
  return "🌙";
}

export function formatDashboardDate(now: Date = new Date()): string {
  const formatted = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * Próxima tarefa pendente — paridade com o mobile (`nextPendingTaskProvider`):
 * 1) incompleta com dueDate >= agora, a mais próxima (ASC);
 * 2) senão, a primeira incompleta na ordem da lista.
 */
export function getNextPendingTask(
  tasks: Task[],
  now: Date = new Date(),
): Task | null {
  const pending = tasks.filter((task) => task.status !== "completed");
  if (pending.length === 0) return null;

  const upcoming = pending
    .filter(
      (task) =>
        task.dueDate !== undefined && task.dueDate.getTime() >= now.getTime(),
    )
    .sort(
      (a, b) => (a.dueDate as Date).getTime() - (b.dueDate as Date).getTime(),
    );

  if (upcoming.length > 0) return upcoming[0] ?? null;

  return pending[0] ?? null;
}

/**
 * Próximas tarefas pendentes para o preview do Dashboard:
 * filtra concluídas e aplica a mesma ordenação da lista de tarefas
 * (dueDate DESC, sem data no fim). Limitado a `limit` itens.
 */
export function getNextPendingTasks(
  tasks: Task[],
  limit = 8,
): Task[] {
  const pending = tasks.filter((task) => task.status !== "completed");
  return sortTasksByDueDateDescending(pending).slice(0, limit);
}

export function computeDashboardTaskStats(
  tasks: Task[],
  now: Date = new Date(),
): DashboardTaskStats {
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const completedYesterday = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      isSameCalendarDay(task.completedAt, yesterday),
  ).length;

  const completedToday = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      isSameCalendarDay(task.completedAt, today),
  ).length;

  const pending = tasks.filter((task) => task.status !== "completed").length;

  return { completedYesterday, completedToday, pending };
}

export function buildEncouragementMessage(stats: DashboardTaskStats): string {
  if (stats.completedYesterday > 0) {
    const label =
      stats.completedYesterday === 1 ? "1 tarefa" : `${stats.completedYesterday} tarefas`;
    return `"Você completou ${label} ontem — que maravilha! Continue com o ótimo trabalho hoje."`;
  }

  return '"Cada passo conta. Vamos organizar o seu dia com calma e clareza."';
}

/** Hora 24h + rótulo do dia — paridade com o mobile (`_formatDueDate`). */
export function formatTaskTime(
  date: Date | undefined,
  now: Date = new Date(),
): string | null {
  if (!date) return null;

  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isSameCalendarDay(date, now)) return `${time} · Hoje`;

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameCalendarDay(date, tomorrow)) return `${time} · Amanhã`;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${time} · ${day}/${month}/${year}`;
}

export function getTaskActionHref(task: Task): string {
  if (task.status === "completed") {
    return `/tasks/${task.id}`;
  }

  if (isGuidedTaskCandidate(task)) {
    return `/tasks/${task.id}/guided`;
  }

  return `/tasks/${task.id}`;
}

export function getTaskActionLabel(task: Task): string {
  if (task.status === "completed") return "Ver";
  if (isGuidedTaskCandidate(task)) return "Iniciar";
  return "Iniciar";
}

/**
 * Próximos lembretes ativos para o preview do Dashboard:
 * exclui concluídos (`isRead`), ordena por `scheduledAt` DESC e limita a `limit`.
 */
export function getNextActiveReminders(
  reminders: Reminder[],
  limit = 3,
): Reminder[] {
  return reminders
    .filter((reminder) => !reminder.isRead)
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    )
    .slice(0, limit);
}
