import {
  Pill,
  Calendar,
  Droplets,
  UtensilsCrossed,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import type { ReminderCategory } from "@/domain/entities/ReminderCategory";
import { REMINDER_CATEGORY_LABELS } from "@/domain/entities/ReminderCategory";

export interface ReminderCategoryVisual {
  Icon: LucideIcon;
  iconClassName: string;
  bgClassName: string;
  label: string;
}

/** Ícone e cores por categoria — alinhado ao mobile `reminder_visuals.dart`. */
export function getReminderCategoryVisual(
  category: ReminderCategory,
): ReminderCategoryVisual {
  switch (category) {
    case "medication":
      return {
        Icon: Pill,
        iconClassName: "text-destructive",
        bgClassName: "bg-destructive-light",
        label: REMINDER_CATEGORY_LABELS.medication,
      };
    case "appointment":
      return {
        Icon: Calendar,
        iconClassName: "text-secondary",
        bgClassName: "bg-secondary-light",
        label: REMINDER_CATEGORY_LABELS.appointment,
      };
    case "hydration":
      return {
        Icon: Droplets,
        iconClassName: "text-primary",
        bgClassName: "bg-primary-light",
        label: REMINDER_CATEGORY_LABELS.hydration,
      };
    case "meal":
      return {
        Icon: UtensilsCrossed,
        iconClassName: "text-warning",
        bgClassName: "bg-warning-light",
        label: REMINDER_CATEGORY_LABELS.meal,
      };
    case "bills":
      return {
        Icon: Receipt,
        iconClassName: "text-success",
        bgClassName: "bg-success-light",
        label: REMINDER_CATEGORY_LABELS.bills,
      };
  }
}

/** Hora no formato 12h (ex.: "8:00") — Figma Reminder Center. */
export function formatReminderTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const hours = d.getHours() % 12 || 12;
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatReminderPeriod(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getHours() < 12 ? "AM" : "PM";
}

/** Data `dd/MM/yyyy` — alinhado ao mobile. */
export function formatReminderDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

/** Exibe "Hoje" quando a data é o dia atual; caso contrário `dd/MM/yyyy`. */
export function formatReminderDateLabel(date: Date | string): string {
  if (isReminderToday(date)) return "Hoje";
  return formatReminderDate(date);
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isReminderToday(scheduledAt: Date | string): boolean {
  const d = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
  return isSameCalendarDay(d, new Date());
}

/**
 * Limites de preview da descrição no card (reticências um pouco antes
 * do espaço visual disponível, para não colar nas ações).
 * Alinhados a sm / lg / xl do shell.
 */
export const REMINDER_MESSAGE_PREVIEW_LIMITS = {
  /** &lt; sm — coluna estreita no mobile */
  default: 36,
  /** sm–lg — tablet / header mobile */
  sm: 55,
  /** lg–xl — sidebar + ações empilhadas */
  lg: 70,
  /** xl+ — ações na mesma linha; corta mais cedo */
  xl: 60,
} as const;

/** Limites de preview do título (mesma lógica, um pouco mais curtos). */
export const REMINDER_TITLE_PREVIEW_LIMITS = {
  default: 28,
  sm: 40,
  lg: 52,
  xl: 44,
} as const;

/** Trunca texto com reticências a partir do limite de caracteres. */
export function truncateReminderText(text: string, maxChars: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars).trimEnd()}…`;
}

/** @deprecated Prefer `truncateReminderText`. */
export function truncateReminderMessage(
  message: string,
  maxChars: number,
): string {
  return truncateReminderText(message, maxChars);
}
