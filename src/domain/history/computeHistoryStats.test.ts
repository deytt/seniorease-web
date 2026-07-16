import { describe, expect, it } from "vitest";
import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import {
  computeHistoryStats,
  computeStreak,
  getStartOfWeek,
  hasRecentStreakAchievement,
} from "@/domain/history/computeHistoryStats";
import { HistoryActionType } from "@/domain/history/HistoryActionType";

function makeEvent(
  overrides: Partial<HistoryEvent> & Pick<HistoryEvent, "type" | "occurredAt">,
): HistoryEvent {
  return {
    id: "event-1",
    userId: "user-1",
    title: "Evento",
    ...overrides,
  };
}

describe("computeHistoryStats", () => {
  it("calcula tarefas da semana desde segunda-feira", () => {
    const now = new Date("2026-07-16T12:00:00");
    const monday = getStartOfWeek(now);
    const sundayBefore = new Date(monday.getTime() - 86_400_000);

    const events = [
      makeEvent({
        id: "1",
        type: HistoryActionType.taskCompleted,
        occurredAt: monday,
      }),
      makeEvent({
        id: "2",
        type: HistoryActionType.taskCompleted,
        occurredAt: sundayBefore,
      }),
      makeEvent({
        id: "3",
        type: HistoryActionType.reminderCompleted,
        occurredAt: monday,
      }),
    ];

    const stats = computeHistoryStats(events, now);
    expect(stats.thisWeek).toBe(1);
    expect(stats.totalCompleted).toBe(3);
  });

  it("calcula streak com tarefas e lembretes consecutivos", () => {
    const now = new Date("2026-07-16T12:00:00");
    const events = [
      makeEvent({
        id: "1",
        type: HistoryActionType.taskCompleted,
        occurredAt: new Date("2026-07-16T08:00:00"),
      }),
      makeEvent({
        id: "2",
        type: HistoryActionType.reminderCompleted,
        occurredAt: new Date("2026-07-15T08:00:00"),
      }),
      makeEvent({
        id: "3",
        type: HistoryActionType.taskCompleted,
        occurredAt: new Date("2026-07-14T08:00:00"),
      }),
    ];

    expect(computeStreak(events, now)).toBe(3);
  });

  it("zera streak quando não há atividade hoje nem ontem", () => {
    const now = new Date("2026-07-16T12:00:00");
    const events = [
      makeEvent({
        id: "1",
        type: HistoryActionType.taskCompleted,
        occurredAt: new Date("2026-07-13T08:00:00"),
      }),
    ];

    expect(computeStreak(events, now)).toBe(0);
  });

  it("detecta conquista recente de streak", () => {
    const now = new Date("2026-07-16T12:00:00");
    const events = [
      makeEvent({
        id: "1",
        type: HistoryActionType.streakAchievement,
        occurredAt: new Date("2026-07-15T09:00:00"),
      }),
    ];

    expect(hasRecentStreakAchievement(events, 7, now)).toBe(true);
  });
});
