import { describe, expect, it } from "vitest";

import type { Task } from "@/domain/entities/Task";
import { defaultPreferences } from "@/domain/entities/UserPreferences";
import { getAccessibilityPreviewSummary } from "@/presentation/components/accessibility/accessibilityLabels";
import {
  computeDashboardTaskStats,
  getTodayDashboardTasks,
  getUpcomingReminders,
} from "@/presentation/components/dashboard/dashboardUtils";

function buildTask(overrides: Partial<Task> & Pick<Task, "id">): Task {
  return {
    userId: "user-1",
    title: "Tarefa",
    description: "",
    steps: [],
    status: "pending",
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

  it("lista tarefas de hoje com concluídas primeiro", () => {
    const now = new Date("2026-07-16T12:00:00");
    const tasks = [
      buildTask({
        id: "pending",
        status: "pending",
        dueDate: new Date("2026-07-16T15:00:00"),
      }),
      buildTask({
        id: "done",
        status: "completed",
        completedAt: new Date("2026-07-16T08:00:00"),
        dueDate: new Date("2026-07-16T08:00:00"),
      }),
    ];

    expect(getTodayDashboardTasks(tasks, now).map((task) => task.id)).toEqual([
      "done",
      "pending",
    ]);
  });

  it("retorna lembretes futuros não concluídos", () => {
    const now = new Date("2026-07-16T12:00:00");

    const reminders = getUpcomingReminders(
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
      ],
      3,
      now,
    );

    expect(reminders).toHaveLength(1);
    expect(reminders[0]?.id).toBe("1");
  });

  it("resume preferências de acessibilidade em português", () => {
    const summary = getAccessibilityPreviewSummary(defaultPreferences("user-1"));
    expect(summary.fontSize).toBe("Média (100%)");
    expect(summary.interfaceMode).toBe("Avançado");
    expect(summary.theme).toBe("Modo claro");
    expect(summary.audioFeedback).toBe("Desativado");
  });
});
