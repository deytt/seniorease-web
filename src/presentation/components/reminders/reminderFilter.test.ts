import { describe, expect, it } from "vitest";
import {
  EMPTY_REMINDER_LIST_FILTER,
  isReminderListFilterActive,
  matchesReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";

describe("matchesReminderListFilter", () => {
  const isToday = (d: Date | string) =>
    new Date(d).toISOString().startsWith("2026-07-21");

  it("sem filtros retorna true", () => {
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        EMPTY_REMINDER_LIST_FILTER,
        isToday,
      ),
    ).toBe(true);
  });

  it("filtra só hoje", () => {
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        { today: true, category: null },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        { today: true, category: null },
        isToday,
      ),
    ).toBe(false);
  });

  it("filtra só categoria", () => {
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-22T10:00:00"),
        },
        { today: false, category: "medication" },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        { today: false, category: "medication" },
        isToday,
      ),
    ).toBe(false);
  });

  it("combina hoje + categoria (AND)", () => {
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-21T10:00:00"),
        },
        { today: true, category: "medication" },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-22T10:00:00"),
        },
        { today: true, category: "medication" },
        isToday,
      ),
    ).toBe(false);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        { today: true, category: "medication" },
        isToday,
      ),
    ).toBe(false);
  });
});

describe("isReminderListFilterActive", () => {
  it("detecta filtro ativo", () => {
    expect(isReminderListFilterActive(EMPTY_REMINDER_LIST_FILTER)).toBe(false);
    expect(
      isReminderListFilterActive({ today: true, category: null }),
    ).toBe(true);
    expect(
      isReminderListFilterActive({ today: false, category: "bills" }),
    ).toBe(true);
  });
});
