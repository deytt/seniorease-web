import type { ReminderCategory } from "@/domain/entities/ReminderCategory";

export type ReminderListFilter = {
  today: boolean;
  category: ReminderCategory | null;
};

export const EMPTY_REMINDER_LIST_FILTER: ReminderListFilter = {
  today: false,
  category: null,
};

export const BASIC_MODE_REMINDER_CATEGORIES: ReminderCategory[] = [
  "medication",
  "appointment",
];

export function isReminderListFilterActive(filter: ReminderListFilter): boolean {
  return filter.today || filter.category !== null;
}

export function matchesReminderListFilter(
  reminder: { category: ReminderCategory; scheduledAt: Date | string },
  filter: ReminderListFilter,
  isToday: (scheduledAt: Date | string) => boolean,
): boolean {
  if (filter.today && !isToday(reminder.scheduledAt)) return false;
  if (filter.category !== null && reminder.category !== filter.category) {
    return false;
  }
  return true;
}
