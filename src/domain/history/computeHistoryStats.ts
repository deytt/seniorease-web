import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import {
  COMPLETION_HISTORY_TYPES,
  HistoryActionType,
  isCompletionHistoryType,
} from "@/domain/history/HistoryActionType";

export interface HistoryStats {
  totalCompleted: number;
  streak: number;
  thisWeek: number;
  thisMonth: number;
}

const DAY_MS = 86_400_000;

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Segunda-feira 00:00 da semana calendário que contém `date`. */
export function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const weekday = start.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  start.setDate(start.getDate() - daysFromMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function computeStreak(
  completions: HistoryEvent[],
  now: Date = new Date(),
): number {
  if (completions.length === 0) return 0;

  const daysWithActivity = new Set<string>();
  for (const event of completions) {
    daysWithActivity.add(toDateKey(event.occurredAt));
  }

  const todayKey = toDateKey(now);
  const yesterdayKey = toDateKey(new Date(now.getTime() - DAY_MS));

  let cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  if (!daysWithActivity.has(todayKey)) {
    if (!daysWithActivity.has(yesterdayKey)) {
      return 0;
    }
    cursor = new Date(now.getTime() - DAY_MS);
    cursor.setHours(0, 0, 0, 0);
  }

  let streak = 0;
  while (daysWithActivity.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function computeHistoryStats(
  events: HistoryEvent[],
  now: Date = new Date(),
): HistoryStats {
  const completions = events.filter((event) =>
    isCompletionHistoryType(event.type),
  );
  const taskCompletions = events.filter(
    (event) => event.type === HistoryActionType.taskCompleted,
  );
  const reminderCompletions = events.filter(
    (event) => event.type === HistoryActionType.reminderCompleted,
  );

  const startOfWeek = getStartOfWeek(now);
  const monthAgo = new Date(now.getTime() - 30 * DAY_MS);

  return {
    totalCompleted: completions.length,
    streak: computeStreak(completions, now),
    thisWeek: taskCompletions.filter((event) => event.occurredAt >= startOfWeek)
      .length,
    thisMonth: reminderCompletions.filter((event) => event.occurredAt >= monthAgo)
      .length,
  };
}

export function hasRecentStreakAchievement(
  events: HistoryEvent[],
  streakDays: number,
  now: Date = new Date(),
): boolean {
  const windowStart = new Date(now.getTime() - streakDays * DAY_MS);

  return events.some(
    (event) =>
      event.type === HistoryActionType.streakAchievement &&
      event.occurredAt >= windowStart,
  );
}

export { COMPLETION_HISTORY_TYPES };
