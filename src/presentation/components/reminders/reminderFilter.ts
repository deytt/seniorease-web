import type { ReminderCategory } from "@/domain/entities/ReminderCategory";
import { REMINDER_CATEGORY_LABELS } from "@/domain/entities/ReminderCategory";

/**
 * Filtro combinável da lista de lembretes — paridade com o mobile
 * (`ReminderFilter`: isToday + category opcional).
 */
export interface ReminderListFilter {
  isToday: boolean;
  category: ReminderCategory | null;
}

/** Sem filtros — mostra todos os lembretes (padrão mobile). */
export const EMPTY_REMINDER_LIST_FILTER: ReminderListFilter = {
  isToday: false,
  category: null,
};

export const DEFAULT_REMINDER_LIST_FILTER = EMPTY_REMINDER_LIST_FILTER;

export function isReminderListFilterEmpty(filter: ReminderListFilter): boolean {
  return !filter.isToday && filter.category === null;
}

export function reminderListFilterActiveCount(
  filter: ReminderListFilter,
): number {
  return (filter.isToday ? 1 : 0) + (filter.category ? 1 : 0);
}

export function matchesReminderListFilter(
  reminder: { category: ReminderCategory; scheduledAt: Date | string },
  filter: ReminderListFilter,
  isToday: (scheduledAt: Date | string) => boolean,
): boolean {
  if (filter.isToday && !isToday(reminder.scheduledAt)) {
    return false;
  }
  if (filter.category !== null && reminder.category !== filter.category) {
    return false;
  }
  return true;
}

export function reminderFilterChipLabel(
  filter: ReminderListFilter,
): { today?: string; category?: string } {
  return {
    today: filter.isToday ? "Hoje" : undefined,
    category: filter.category
      ? REMINDER_CATEGORY_LABELS[filter.category]
      : undefined,
  };
}
