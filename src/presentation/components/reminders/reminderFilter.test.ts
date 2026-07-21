import { describe, expect, it } from "vitest";
import {
  DEFAULT_REMINDER_LIST_FILTER,
  matchesReminderListFilter,
  reminderListFilterCategory,
} from "@/presentation/components/reminders/reminderFilter";

describe("matchesReminderListFilter", () => {
  const isToday = (d: Date | string) =>
    new Date(d).toISOString().startsWith("2026-07-21");

  it("filtro hoje só aceita lembretes do dia", () => {
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        "today",
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        "today",
        isToday,
      ),
    ).toBe(false);
  });

  it("filtro medicação é exclusivo por categoria", () => {
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-22T10:00:00"),
        },
        "medication",
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        "medication",
        isToday,
      ),
    ).toBe(false);
  });

  it("filtro consultas mapeia para appointment", () => {
    expect(
      matchesReminderListFilter(
        {
          category: "appointment",
          scheduledAt: new Date("2026-07-22T10:00:00"),
        },
        "appointments",
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-22T10:00:00"),
        },
        "appointments",
        isToday,
      ),
    ).toBe(false);
  });
});

describe("reminderListFilterCategory", () => {
  it("mapeia chips exclusivos", () => {
    expect(reminderListFilterCategory("today")).toBeNull();
    expect(reminderListFilterCategory("medication")).toBe("medication");
    expect(reminderListFilterCategory("appointments")).toBe("appointment");
  });
});

describe("DEFAULT_REMINDER_LIST_FILTER", () => {
  it("abre em Hoje como no mobile", () => {
    expect(DEFAULT_REMINDER_LIST_FILTER).toBe("today");
  });
});
