import { describe, expect, it } from "vitest";
import {
  EMPTY_TASK_LIST_FILTER,
  isTaskListFilterEmpty,
  matchesTaskListFilter,
  taskListFilterActiveCount,
} from "@/presentation/components/tasks/taskFilter";

describe("matchesTaskListFilter", () => {
  const now = new Date("2026-07-25T12:00:00");

  it("sem filtros aceita qualquer tarefa", () => {
    expect(
      matchesTaskListFilter(
        {
          dueDate: new Date("2026-07-26T10:00:00"),
          category: "health",
          priority: "low",
        },
        EMPTY_TASK_LIST_FILTER,
        now,
      ),
    ).toBe(true);
  });

  it("filtro hoje só aceita tarefas do dia", () => {
    expect(
      matchesTaskListFilter(
        {
          dueDate: new Date("2026-07-25T08:00:00"),
          category: "health",
          priority: "high",
        },
        { isToday: true, category: null, priority: null },
        now,
      ),
    ).toBe(true);
    expect(
      matchesTaskListFilter(
        {
          dueDate: new Date("2026-07-26T08:00:00"),
          category: "health",
          priority: "high",
        },
        { isToday: true, category: null, priority: null },
        now,
      ),
    ).toBe(false);
  });

  it("combina categoria e prioridade", () => {
    expect(
      matchesTaskListFilter(
        {
          dueDate: new Date("2026-07-25T08:00:00"),
          category: "medication",
          priority: "high",
        },
        { isToday: false, category: "medication", priority: "high" },
        now,
      ),
    ).toBe(true);
    expect(
      matchesTaskListFilter(
        {
          dueDate: new Date("2026-07-25T08:00:00"),
          category: "medication",
          priority: "low",
        },
        { isToday: false, category: "medication", priority: "high" },
        now,
      ),
    ).toBe(false);
  });
});

describe("taskListFilter helpers", () => {
  it("conta filtros ativos", () => {
    expect(taskListFilterActiveCount(EMPTY_TASK_LIST_FILTER)).toBe(0);
    expect(
      taskListFilterActiveCount({
        isToday: true,
        category: "social",
        priority: "medium",
      }),
    ).toBe(3);
  });

  it("detecta filtro vazio", () => {
    expect(isTaskListFilterEmpty(EMPTY_TASK_LIST_FILTER)).toBe(true);
    expect(
      isTaskListFilterEmpty({
        isToday: true,
        category: null,
        priority: null,
      }),
    ).toBe(false);
  });
});
