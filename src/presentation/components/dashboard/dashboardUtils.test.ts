import { describe, expect, it } from "vitest";

import type { Task } from "@/domain/entities/Task";
import { defaultPreferences } from "@/domain/entities/UserPreferences";
import { getAccessibilityPreviewSummary } from "@/presentation/components/accessibility/accessibilityLabels";
import {
  computeDashboardTaskStats,
  formatTaskTime,
  getNextPendingTask,
  getTodayReminders,
} from "@/presentation/components/dashboard/dashboardUtils";

function buildTask(overrides: Partial<Task> & Pick<Task, "id">): Task {
  return {
    userId: "user-1",
    title: "Tarefa",
    description: "",
    steps: [],
    status: "pending",
    notified: false,
    createdAt: new Date("2026-07-16T08:00:00"),
    ...overrides,
  };
}

describe("dashboardUtils", () => {
  it("calcula estatísticas de ontem, hoje e restantes", () => {
    const now = new Date("2026-07-16T12:00:00");
    const tasks = [
      buildTask({
        id: "1",
        status: "completed",
        completedAt: new Date("2026-07-15T18:00:00"),
        dueDate: new Date("2026-07-15T18:00:00"),
      }),
      buildTask({
        id: "2",
        status: "completed",
        completedAt: new Date("2026-07-16T09:00:00"),
        dueDate: new Date("2026-07-16T09:00:00"),
      }),
      buildTask({
        id: "3",
        status: "pending",
        dueDate: new Date("2026-07-16T15:00:00"),
      }),
      buildTask({
        id: "4",
        status: "pending",
        dueDate: new Date("2026-07-17T10:00:00"),
      }),
    ];

    expect(computeDashboardTaskStats(tasks, now)).toEqual({
      completedYesterday: 1,
      completedToday: 1,
      remainingToday: 1,
    });
  });

  it("escolhe a próxima tarefa pendente com dueDate mais próxima (ASC)", () => {
    const now = new Date("2026-07-16T12:00:00");
    const tasks = [
      buildTask({
        id: "past",
        status: "pending",
        dueDate: new Date("2026-07-16T09:00:00"),
      }),
      buildTask({
        id: "later",
        status: "pending",
        dueDate: new Date("2026-07-16T18:00:00"),
      }),
      buildTask({
        id: "soon",
        status: "pending",
        dueDate: new Date("2026-07-16T14:00:00"),
      }),
      buildTask({
        id: "done",
        status: "completed",
        dueDate: new Date("2026-07-16T13:00:00"),
      }),
    ];

    expect(getNextPendingTask(tasks, now)?.id).toBe("soon");
  });

  it("faz fallback para a primeira pendente quando não há dueDate futuro", () => {
    const now = new Date("2026-07-16T12:00:00");
    const tasks = [
      buildTask({
        id: "first-pending",
        status: "pending",
        dueDate: new Date("2026-07-16T09:00:00"),
      }),
      buildTask({
        id: "second-pending",
        status: "pending",
      }),
    ];

    expect(getNextPendingTask(tasks, now)?.id).toBe("first-pending");
  });

  it("formata horário em 24h com rótulo do dia", () => {
    const now = new Date("2026-07-16T12:00:00");
    expect(formatTaskTime(new Date("2026-07-16T15:05:00"), now)).toBe(
      "15:05 · Hoje",
    );
    expect(formatTaskTime(new Date("2026-07-17T09:00:00"), now)).toBe(
      "09:00 · Amanhã",
    );
  });

  it("retorna lembretes do dia civil em ordem ascendente (inclui concluídos)", () => {
    const now = new Date("2026-07-16T12:00:00");

    const reminders = getTodayReminders(
      [
        {
          id: "1",
          userId: "user-1",
          title: "Medicação",
          message: "",
          category: "medication",
          scheduledAt: new Date("2026-07-16T13:00:00"),
          isRead: false,
          notified: false,
          createdAt: now,
        },
        {
          id: "2",
          userId: "user-1",
          title: "Passado",
          message: "",
          category: "meal",
          scheduledAt: new Date("2026-07-16T10:00:00"),
          isRead: false,
          notified: false,
          createdAt: now,
        },
        {
          id: "3",
          userId: "user-1",
          title: "Amanhã",
          message: "",
          category: "appointment",
          scheduledAt: new Date("2026-07-17T18:00:00"),
          isRead: false,
          notified: false,
          createdAt: now,
        },
        {
          id: "4",
          userId: "user-1",
          title: "Já lido",
          message: "",
          category: "hydration",
          scheduledAt: new Date("2026-07-16T20:00:00"),
          isRead: true,
          notified: false,
          createdAt: now,
        },
      ],
      3,
      now,
    );

    expect(reminders.map((reminder) => reminder.id)).toEqual(["2", "1", "4"]);
  });

  it("resume preferências de acessibilidade em português", () => {
    const summary = getAccessibilityPreviewSummary(defaultPreferences("user-1"));
    expect(summary.fontSize).toBe("Média (100%)");
    expect(summary.interfaceMode).toBe("Avançado");
    expect(summary.theme).toBe("Modo claro");
    expect(summary.audioFeedback).toBe("Desativado");
  });
});
