import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Award,
  BadgeCheck,
  BellPlus,
  CheckCheck,
  CheckCircle,
  ClipboardList,
  Droplets,
  Footprints,
  Heart,
  ListPlus,
  Pencil,
  Pill,
  Receipt,
  Trash2,
  User,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import type { HistoryStats } from "@/domain/history/computeHistoryStats";
import {
  HistoryActionType,
  isLowRelevanceHistoryType,
} from "@/domain/history/HistoryActionType";
import type { InterfaceMode } from "@/domain/entities/UserPreferences";

export type HistoryStatsView = HistoryStats;

export interface HistoryEventVisual {
  icon: LucideIcon;
  iconClassName: string;
  ringClassName: string;
}

/** Cores de marca — espelha AppColors do mobile (fixas, inclusive dark/maximum).
 * Classes estáticas para o Tailwind as gerar no CSS (não usar template strings).
 * Usa `[color:#…]` em vez de `text-[#…]` para não ser remapeado no dark/maximum.
 */
const HISTORY_BRAND = {
  primary: {
    iconClassName: "[color:#2563eb]",
    ringClassName: "bg-[rgba(37,99,235,0.13)] [color:#2563eb]",
  },
  secondary: {
    iconClassName: "[color:#14b8a6]",
    ringClassName: "bg-[rgba(20,184,166,0.13)] [color:#14b8a6]",
  },
  success: {
    iconClassName: "[color:#22c55e]",
    ringClassName: "bg-[rgba(34,197,94,0.13)] [color:#22c55e]",
  },
  warning: {
    iconClassName: "[color:#f59e0b]",
    ringClassName: "bg-[rgba(245,158,11,0.13)] [color:#f59e0b]",
  },
  danger: {
    iconClassName: "[color:#ef4444]",
    ringClassName: "bg-[rgba(239,68,68,0.13)] [color:#ef4444]",
  },
} as const;

type HistoryBrandKey = keyof typeof HISTORY_BRAND;

function brandVisual(
  icon: LucideIcon,
  brand: HistoryBrandKey,
): HistoryEventVisual {
  const classes = HISTORY_BRAND[brand];
  return {
    icon,
    iconClassName: classes.iconClassName,
    ringClassName: classes.ringClassName,
  };
}

/** Ícone de conclusão por categoria — espelha `_completionIcon` do mobile. */
function completionIcon(category?: string | null): LucideIcon {
  switch (category) {
    case "medication":
      return Pill;
    case "health":
    case "appointment":
      return Heart;
    case "exercise":
      return Footprints;
    case "social":
      return Users;
    case "hydration":
      return Droplets;
    case "meal":
      return UtensilsCrossed;
    case "bills":
      return Receipt;
    default:
      return CheckCircle;
  }
}

const MONTHS_SHORT_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function formatHistoryEventDate(date: Date | string): string {
  const eventDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86_400_000);
  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
  );

  const timeLabel = eventDate.toLocaleTimeString("pt-BR", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (eventDay.getTime() === today.getTime()) {
    return timeLabel;
  }

  if (eventDay.getTime() === yesterday.getTime()) {
    return `Ontem ${timeLabel}`;
  }

  const month = MONTHS_SHORT_PT[eventDate.getMonth()];
  const day = eventDate.getDate();
  return `${day} ${month} · ${timeLabel}`;
}

export function formatStreakLabel(streak: number): string {
  if (streak <= 0) return "—";
  return streak === 1 ? "1 dia" : `${streak} dias`;
}

export function formatStatValue(value: number): string {
  return value > 0 ? String(value) : "—";
}

/** Modo básico oculta eventos de baixa relevância; avançado mostra tudo (ADR-017). */
export function filterHistoryEventsForMode(
  events: HistoryEvent[],
  interfaceMode: InterfaceMode,
): HistoryEvent[] {
  if (interfaceMode !== "basic") {
    return events;
  }

  return events.filter((event) => !isLowRelevanceHistoryType(event.type));
}

/**
 * Aparência do evento — paridade com
 * `history_visuals.dart` / `historyVisual` do mobile (issue #81 item 9).
 */
export function getHistoryEventVisual(event: HistoryEvent): HistoryEventVisual {
  if (
    event.type === HistoryActionType.streakAchievement ||
    event.title.toLowerCase().includes("conquista")
  ) {
    return brandVisual(Award, "warning");
  }

  switch (event.type) {
    case HistoryActionType.taskCompleted:
    case HistoryActionType.reminderCompleted:
      return brandVisual(completionIcon(event.category), "success");
    case HistoryActionType.taskStepCompleted:
      return brandVisual(CheckCheck, "secondary");
    case HistoryActionType.taskCreated:
      return brandVisual(ListPlus, "primary");
    case HistoryActionType.reminderCreated:
      return brandVisual(BellPlus, "primary");
    case HistoryActionType.reminderEdited:
      return brandVisual(Pencil, "warning");
    case HistoryActionType.taskDeleted:
    case HistoryActionType.reminderDeleted:
      return brandVisual(Trash2, "danger");
    case HistoryActionType.accessibilityChanged:
      return brandVisual(Accessibility, "secondary");
    case HistoryActionType.profileUpdated:
      return brandVisual(User, "primary");
    case HistoryActionType.accountVerified:
      return brandVisual(BadgeCheck, "success");
    default:
      return brandVisual(ClipboardList, "primary");
  }
}

export function shouldShowStreakBanner(streak: number): boolean {
  return streak >= 3;
}

export function getStreakBannerTitle(streak: number): string {
  if (streak >= 7) {
    return `🎉 Conquista de ${streak} dias!`;
  }

  return `🎉 Sequência de ${streak} ${streak === 1 ? "dia" : "dias"}!`;
}

export function getStreakBannerDescription(streak: number): string {
  if (streak >= 7) {
    return `Você completou atividades todos os dias por ${streak} dias. Parabéns!`;
  }

  return "Continue assim! Cada dia conta para manter sua rotina organizada.";
}

export const HISTORY_STAT_CARDS = [
  {
    key: "thisWeek",
    label: "Tarefas esta semana",
    icon: ClipboardList,
    iconWrapClassName: "bg-[rgba(37,99,235,0.13)] [color:#2563eb]",
    getValue: (stats: HistoryStatsView) => formatStatValue(stats.thisWeek),
  },
  {
    key: "streak",
    label: "Sequência atual",
    icon: Zap,
    iconWrapClassName: "bg-[rgba(245,158,11,0.13)] [color:#f59e0b]",
    getValue: (stats: HistoryStatsView) => formatStreakLabel(stats.streak),
  },
  {
    key: "totalCompleted",
    label: "Conquistas",
    icon: Award,
    iconWrapClassName: "bg-[rgba(34,197,94,0.13)] [color:#22c55e]",
    getValue: (stats: HistoryStatsView) => formatStatValue(stats.totalCompleted),
  },
  {
    key: "reminders",
    label: "Lembretes concluídos",
    icon: Pill,
    iconWrapClassName: "bg-[rgba(20,184,166,0.13)] [color:#14b8a6]",
    getValue: (stats: HistoryStatsView) => formatStatValue(stats.thisMonth),
  },
] as const;
