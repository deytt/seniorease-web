import type { LucideIcon } from "lucide-react";
import {
  Award,
  Calendar,
  Check,
  ClipboardList,
  Pill,
  Settings,
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

export function getHistoryEventVisual(event: HistoryEvent): HistoryEventVisual {
  if (
    event.type === HistoryActionType.streakAchievement ||
    event.title.toLowerCase().includes("conquista")
  ) {
    return {
      icon: Award,
      iconClassName: "text-[#f59e0b]",
      ringClassName:
        "border-2 border-[#f59e0b] bg-[rgba(245,158,11,0.13)] text-[#f59e0b]",
    };
  }

  switch (event.type) {
    case HistoryActionType.taskCompleted:
    case HistoryActionType.reminderCompleted:
    case HistoryActionType.taskStepCompleted:
      return {
        icon: Check,
        iconClassName: "text-[#22c55e]",
        ringClassName:
          "border-2 border-[#22c55e] bg-[rgba(34,197,94,0.13)] text-[#22c55e]",
      };
    case HistoryActionType.taskCreated:
    case HistoryActionType.reminderCreated:
      return {
        icon: Calendar,
        iconClassName: "text-[#2563eb]",
        ringClassName:
          "border-2 border-[#2563eb] bg-[rgba(37,99,235,0.13)] text-[#2563eb]",
      };
    case HistoryActionType.accessibilityChanged:
    case HistoryActionType.profileUpdated:
    case HistoryActionType.accountVerified:
      return {
        icon: Settings,
        iconClassName: "text-[#64748b]",
        ringClassName:
          "border-2 border-[#cbd5e1] bg-[#f8fafc] text-[#64748b]",
      };
    case HistoryActionType.taskDeleted:
    case HistoryActionType.reminderDeleted:
    case HistoryActionType.reminderEdited:
      return {
        icon: ClipboardList,
        iconClassName: "text-[#64748b]",
        ringClassName:
          "border-2 border-[#cbd5e1] bg-[#f8fafc] text-[#64748b]",
      };
    default:
      return {
        icon: ClipboardList,
        iconClassName: "text-[#64748b]",
        ringClassName:
          "border-2 border-[#cbd5e1] bg-[#f8fafc] text-[#64748b]",
      };
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
    iconWrapClassName: "bg-[rgba(37,99,235,0.13)] text-[#2563eb]",
    getValue: (stats: HistoryStatsView) => formatStatValue(stats.thisWeek),
  },
  {
    key: "streak",
    label: "Sequência atual",
    icon: Zap,
    iconWrapClassName: "bg-[rgba(245,158,11,0.13)] text-[#f59e0b]",
    getValue: (stats: HistoryStatsView) => formatStreakLabel(stats.streak),
  },
  {
    key: "totalCompleted",
    label: "Conquistas",
    icon: Award,
    iconWrapClassName: "bg-[rgba(34,197,94,0.13)] text-[#22c55e]",
    getValue: (stats: HistoryStatsView) => formatStatValue(stats.totalCompleted),
  },
  {
    key: "reminders",
    label: "Lembretes concluídos",
    icon: Pill,
    iconWrapClassName: "bg-[rgba(20,184,166,0.13)] text-[#14b8a6]",
    getValue: (stats: HistoryStatsView) => formatStatValue(stats.thisMonth),
  },
] as const;
