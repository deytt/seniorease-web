import { describe, expect, it } from "vitest";
import {
  DEFAULT_REMINDER_LIST_FILTER,
  EMPTY_REMINDER_LIST_FILTER,
  isReminderListFilterEmpty,
  matchesReminderListFilter,
  reminderListFilterActiveCount,
} from "@/presentation/components/reminders/reminderFilter";

describe("matchesReminderListFilter", () => {
  const isToday = (d: Date | string) =>
    new Date(d).toISOString().startsWith("2026-07-21");

  it("sem filtros aceita qualquer lembrete", () => {
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        EMPTY_REMINDER_LIST_FILTER,
        isToday,
      ),
    ).toBe(true);
  });

  it("filtro hoje só aceita lembretes do dia", () => {
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        { isToday: true, category: null },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        { isToday: true, category: null },
        isToday,
      ),
    ).toBe(false);
  });

  it("filtro de categoria é exclusivo e combinável com hoje", () => {
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-21T10:00:00"),
        },
        { isToday: true, category: "medication" },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        { isToday: true, category: "medication" },
        isToday,
      ),
    ).toBe(false);
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-22T10:00:00"),
        },
        { isToday: true, category: "medication" },
        isToday,
      ),
    ).toBe(false);
  });
});

describe("reminderListFilter helpers", () => {
  it("padrão vazio como no mobile", () => {
    expect(DEFAULT_REMINDER_LIST_FILTER).toEqual(EMPTY_REMINDER_LIST_FILTER);
    expect(isReminderListFilterEmpty(DEFAULT_REMINDER_LIST_FILTER)).toBe(true);
    expect(reminderListFilterActiveCount({ isToday: true, category: "meal" })).toBe(
      2,
    );
  });
});
