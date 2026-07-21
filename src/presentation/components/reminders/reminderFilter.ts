import type { ReminderCategory } from "@/domain/entities/ReminderCategory";

/**
 * Filtro exclusivo da lista de lembretes — paridade com o mobile
 * (`ReminderListFilter`: today | medication | appointments).
 */
export type ReminderListFilter = "today" | "medication" | "appointments";

export const DEFAULT_REMINDER_LIST_FILTER: ReminderListFilter = "today";

export const REMINDER_LIST_FILTER_OPTIONS: Array<{
  id: ReminderListFilter;
  label: string;
}> = [
  { id: "today", label: "Hoje" },
  { id: "medication", label: "Medicação" },
  { id: "appointments", label: "Consultas" },
];

export function reminderListFilterCategory(
  filter: ReminderListFilter,
): ReminderCategory | null {
  if (filter === "medication") return "medication";
  if (filter === "appointments") return "appointment";
  return null;
}

export function matchesReminderListFilter(
  reminder: { category: ReminderCategory; scheduledAt: Date | string },
  filter: ReminderListFilter,
  isToday: (scheduledAt: Date | string) => boolean,
): boolean {
  if (filter === "today") {
    return isToday(reminder.scheduledAt);
  }

  const category = reminderListFilterCategory(filter);
  return category !== null && reminder.category === category;
}
