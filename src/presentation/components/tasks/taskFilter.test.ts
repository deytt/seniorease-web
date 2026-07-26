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
          status: "pending",
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
          status: "pending",
        },
        { isToday: true, category: null, priority: null, status: null },
        now,
      ),
    ).toBe(true);
    expect(
      matchesTaskListFilter(
        {
          dueDate: new Date("2026-07-26T08:00:00"),
          category: "health",
          priority: "high",
          status: "pending",
        },
        { isToday: true, category: null, priority: null, status: null },
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
          status: "pending",
        },
        { isToday: false, category: "medication", priority: "high", status: null },
        now,
      ),
    ).toBe(true);
    expect(
      matchesTaskListFilter(
        {
          dueDate: new Date("2026-07-25T08:00:00"),
          category: "medication",
          priority: "low",
          status: "pending",
        },
        { isToday: false, category: "medication", priority: "high", status: null },
        now,
      ),
    ).toBe(false);
  });

  it("filtro 'completed' só aceita tarefas concluídas", () => {
    expect(
      matchesTaskListFilter(
        { dueDate: undefined, category: "health", priority: "low", status: "completed" },
        { isToday: false, category: null, priority: null, status: "completed" },
        now,
      ),
    ).toBe(true);
    expect(
      matchesTaskListFilter(
        { dueDate: undefined, category: "health", priority: "low", status: "pending" },
        { isToday: false, category: null, priority: null, status: "completed" },
        now,
      ),
    ).toBe(false);
  });

  it("filtro 'pending' exclui tarefas concluídas", () => {
    expect(
      matchesTaskListFilter(
        { dueDate: undefined, category: "health", priority: "low", status: "in_progress" },
        { isToday: false, category: null, priority: null, status: "pending" },
        now,
      ),
    ).toBe(true);
    expect(
      matchesTaskListFilter(
        { dueDate: undefined, category: "health", priority: "low", status: "completed" },
        { isToday: false, category: null, priority: null, status: "pending" },
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
        status: "pending",
      }),
    ).toBe(4);
  });

  it("detecta filtro vazio", () => {
    expect(isTaskListFilterEmpty(EMPTY_TASK_LIST_FILTER)).toBe(true);
    expect(
      isTaskListFilterEmpty({
        isToday: true,
        category: null,
        priority: null,
        status: null,
      }),
    ).toBe(false);
    expect(
      isTaskListFilterEmpty({
        isToday: false,
        category: null,
        priority: null,
        status: "completed",
      }),
    ).toBe(false);
  });
});
