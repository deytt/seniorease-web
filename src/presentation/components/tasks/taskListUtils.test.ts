import { describe, expect, it } from "vitest";

import type { Task } from "@/domain/entities/Task";
import {
  countTasksCompletedOnDate,
  sortTasksByDueDateDescending,
} from "./taskListUtils";

function buildTask(id: string, dueDate?: Date, createdAt?: Date): Task {
  return {
    id,
    userId: "user-1",
    title: id,
    description: "",
    steps: [],
    status: "pending",
    dueDate,
    notified: false,
    createdAt: createdAt ?? new Date("2026-07-01T10:00:00"),
  };
}

describe("sortTasksByDueDateDescending", () => {
  it("ordena da data da tarefa mais recente para a mais antiga", () => {
    const tasks = [
      buildTask("antiga", new Date("2026-07-10T09:00:00")),
      buildTask("nova", new Date("2026-07-22T09:00:00")),
      buildTask("intermediaria", new Date("2026-07-15T09:00:00")),
    ];

    expect(sortTasksByDueDateDescending(tasks).map((task) => task.id)).toEqual([
      "nova",
      "intermediaria",
      "antiga",
    ]);
  });

  it("mantém tarefas sem data no fim e não altera o array original", () => {
    const tasks = [
      buildTask("sem-data-antiga", undefined, new Date("2026-07-01")),
      buildTask("com-data", new Date("2026-07-10")),
      buildTask("sem-data-nova", undefined, new Date("2026-07-05")),
    ];

    const sorted = sortTasksByDueDateDescending(tasks);

    expect(sorted.map((task) => task.id)).toEqual([
      "com-data",
      "sem-data-nova",
      "sem-data-antiga",
    ]);
    expect(tasks[0]?.id).toBe("sem-data-antiga");
  });
});

describe("countTasksCompletedOnDate", () => {
  it("usa completedAt, independentemente da data agendada da tarefa", () => {
    const today = new Date(2026, 6, 22, 12);
    const tasks = [
      {
        ...buildTask("agendada-ontem", new Date(2026, 6, 21, 9)),
        status: "completed" as const,
        completedAt: new Date(2026, 6, 22, 8),
      },
      {
        ...buildTask("agendada-hoje", new Date(2026, 6, 22, 10)),
        status: "completed" as const,
        completedAt: new Date(2026, 6, 21, 18),
      },
    ];

    expect(countTasksCompletedOnDate(tasks, today)).toBe(1);
  });

  it("ignora tarefa não concluída e tarefa concluída sem completedAt", () => {
    const today = new Date(2026, 6, 22, 12);
    const tasks = [
      {
        ...buildTask("pendente"),
        completedAt: new Date(2026, 6, 22, 9),
      },
      {
        ...buildTask("legada"),
        status: "completed" as const,
      },
    ];

    expect(countTasksCompletedOnDate(tasks, today)).toBe(0);
  });
});
