import type { Task } from "@/domain/entities/Task";
import type { Reminder } from "@/domain/entities/Reminder";
import { isGuidedTaskCandidate } from "@/presentation/components/tasks/guidedTaskUtils";

export interface DashboardTaskStats {
  completedYesterday: number;
  completedToday: number;
  remainingToday: number;
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

function isTaskForToday(task: Task, today: Date): boolean {
  if (task.dueDate) {
    return isSameCalendarDay(task.dueDate, today);
  }

  return task.status === "pending" || task.status === "in_progress";
}

/** Tempo para ordenação desc: sem dueDate fica no fim (valor mínimo). */
function getTaskSortTime(task: Task): number {
  if (task.dueDate) return task.dueDate.getTime();
  return Number.NEGATIVE_INFINITY;
}

export function getTodayDashboardTasks(
  tasks: Task[],
  now: Date = new Date(),
): Task[] {
  const today = startOfDay(now);

  return tasks
    .filter((task) => isTaskForToday(task, today))
    .sort((a, b) => getTaskSortTime(b) - getTaskSortTime(a))
    .slice(0, 4);
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

  const remainingToday = tasks.filter(
    (task) =>
      isTaskForToday(task, today) &&
      task.status !== "completed",
  ).length;

  return { completedYesterday, completedToday, remainingToday };
}

export function buildEncouragementMessage(stats: DashboardTaskStats): string {
  if (stats.completedYesterday > 0) {
    const label =
      stats.completedYesterday === 1 ? "1 tarefa" : `${stats.completedYesterday} tarefas`;
    return `"Você completou ${label} ontem — que maravilha! Continue com o ótimo trabalho hoje."`;
  }

  return '"Cada passo conta. Vamos organizar o seu dia com calma e clareza."';
}

export function formatTaskTime(date: Date | undefined): string | null {
  if (!date) return null;

  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = date.getHours() < 12 ? "AM" : "PM";
  return `${hours}:${minutes} ${period}`;
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

export function getUpcomingReminders(
  reminders: Reminder[],
  limit = 3,
  now: Date = new Date(),
): Reminder[] {
  return reminders
    .filter((reminder) => !reminder.isRead && new Date(reminder.scheduledAt) >= now)
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    )
    .slice(0, limit);
}

export function formatReminderListTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
