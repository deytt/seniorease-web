import { describe, expect, it } from "vitest";

import type { Task } from "@/domain/entities/Task";
import { sortTasksByDueDateDescending } from "./taskListUtils";

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
