import { describe, expect, it } from "vitest";
import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import {
  filterHistoryEventsForMode,
  formatHistoryEventDate,
  formatStreakLabel,
  getStreakBannerTitle,
  shouldShowStreakBanner,
} from "@/presentation/components/history/historyUtils";

function makeEvent(
  overrides: Partial<HistoryEvent> & Pick<HistoryEvent, "type" | "title">,
): HistoryEvent {
  return {
    id: "event-1",
    userId: "user-1",
    occurredAt: new Date("2026-07-15T08:00:00"),
    ...overrides,
  };
}

describe("historyUtils", () => {
  it("formata data de hoje apenas com horário", () => {
    const now = new Date();
    const todayMorning = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      8,
      0,
      0,
    );

    const formatted = formatHistoryEventDate(todayMorning);
    expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    expect(formatted).not.toContain("Ontem");
  });

  it("formata ontem com prefixo", () => {
    const yesterday = new Date(Date.now() - 86_400_000);
    yesterday.setHours(17, 0, 0, 0);

    expect(formatHistoryEventDate(yesterday)).toContain("Ontem");
  });

  it("formata sequência em português", () => {
    expect(formatStreakLabel(0)).toBe("—");
    expect(formatStreakLabel(1)).toBe("1 dia");
    expect(formatStreakLabel(7)).toBe("7 dias");
  });

  it("exibe banner de sequência a partir de 3 dias", () => {
    expect(shouldShowStreakBanner(2)).toBe(false);
    expect(shouldShowStreakBanner(3)).toBe(true);
    expect(getStreakBannerTitle(7)).toContain("7 dias");
  });

  it("filtra eventos de baixa relevância no modo básico", () => {
    const events = [
      makeEvent({
        id: "1",
        type: HistoryActionType.taskCompleted,
        title: "Tarefa",
      }),
      makeEvent({
        id: "2",
        type: HistoryActionType.taskCreated,
        title: "Nova tarefa",
      }),
      makeEvent({
        id: "3",
        type: HistoryActionType.profileUpdated,
        title: "Perfil",
      }),
    ];

    const filtered = filterHistoryEventsForMode(events, "basic");
    expect(filtered).toHaveLength(2);
    expect(filtered.map((event) => event.type)).toEqual([
      HistoryActionType.taskCompleted,
      HistoryActionType.taskCreated,
    ]);
  });
});
