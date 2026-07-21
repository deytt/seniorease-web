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
  return `${time} · ${day}/${month}`;
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
 * Lembretes de hoje — paridade com o mobile (`todayRemindersProvider`):
 * dia civil atual (inclui concluídos), ordenação ASC, limite 3.
 */
export function getTodayReminders(
  reminders: Reminder[],
  limit = 3,
  now: Date = new Date(),
): Reminder[] {
  const dayStart = startOfDay(now);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return reminders
    .filter((reminder) => {
      const scheduled = new Date(reminder.scheduledAt).getTime();
      return scheduled >= dayStart.getTime() && scheduled < dayEnd.getTime();
    })
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )
    .slice(0, limit);
}

export function formatReminderListTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
