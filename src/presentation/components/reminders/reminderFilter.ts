import type { ReminderCategory } from "@/domain/entities/ReminderCategory";
import { REMINDER_CATEGORY_LABELS } from "@/domain/entities/ReminderCategory";

/** "pending" = não concluídos (isRead=false); "completed" = concluídos (isRead=true); null = todos. */
export type ReminderStatusFilter = "pending" | "completed" | null;

/**
 * Filtro combinável da lista de lembretes — paridade com o mobile
 * (`ReminderFilter`: isToday + category opcional).
 */
export interface ReminderListFilter {
  isToday: boolean;
  category: ReminderCategory | null;
  status: ReminderStatusFilter;
}

/** Sem filtros — mostra todos os lembretes (padrão mobile). */
export const EMPTY_REMINDER_LIST_FILTER: ReminderListFilter = {
  isToday: false,
  category: null,
  status: null,
};

export const DEFAULT_REMINDER_LIST_FILTER = EMPTY_REMINDER_LIST_FILTER;

export const REMINDER_STATUS_LABELS: Record<
  NonNullable<ReminderStatusFilter>,
  string
> = {
  pending: "Pendentes",
  completed: "Concluídos",
};

export function isReminderListFilterEmpty(filter: ReminderListFilter): boolean {
  return !filter.isToday && filter.category === null && filter.status === null;
}

export function reminderListFilterActiveCount(
  filter: ReminderListFilter,
): number {
  return (
    (filter.isToday ? 1 : 0) +
    (filter.category ? 1 : 0) +
    (filter.status !== null ? 1 : 0)
  );
}

export function matchesReminderListFilter(
  reminder: {
    category: ReminderCategory;
    scheduledAt: Date | string;
    isRead: boolean;
  },
  filter: ReminderListFilter,
  isToday: (scheduledAt: Date | string) => boolean,
): boolean {
  if (filter.isToday && !isToday(reminder.scheduledAt)) {
    return false;
  }
  if (filter.category !== null && reminder.category !== filter.category) {
    return false;
  }
  if (filter.status === "completed" && !reminder.isRead) {
    return false;
  }
  if (filter.status === "pending" && reminder.isRead) {
    return false;
  }
  return true;
}

export function reminderFilterChipLabel(
  filter: ReminderListFilter,
): { today?: string; category?: string; status?: string } {
  return {
    today: filter.isToday ? "Hoje" : undefined,
    category: filter.category
      ? REMINDER_CATEGORY_LABELS[filter.category]
      : undefined,
    status: filter.status ? REMINDER_STATUS_LABELS[filter.status] : undefined,
  };
}
