import { describe, expect, it, vi } from "vitest";

import type { Task } from "@/domain/entities/Task";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { CompleteTaskUseCase } from "@/domain/usecases/tasks/CompleteTaskUseCase";

const completedTask: Task = {
  id: "task-1",
  userId: "user-1",
  title: "Tomar remédio",
  description: "Após o café",
  steps: [
    {
      id: "step_0",
      taskId: "task-1",
      order: 0,
      title: "Abrir o frasco",
      instruction: "",
      isCompleted: true,
    },
  ],
  status: "completed",
  category: "medication",
  notified: false,
  completedAt: new Date("2026-07-26T11:00:00"),
  createdAt: new Date("2026-07-26T09:00:00"),
  updatedAt: new Date("2026-07-26T11:00:00"),
};

function createRepository(
  overrides: Partial<ITaskRepository> = {},
): ITaskRepository {
  return {
    getTasks: vi.fn(),
    getTaskById: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    completeTask: vi.fn().mockResolvedValue(completedTask),
    ...overrides,
  };
}

function createHistoryRecorder(): IHistoryRecorder {
  return {
    record: vi.fn().mockResolvedValue(undefined),
  };
}

describe("CompleteTaskUseCase", () => {
  it("chama repository.completeTask() com o taskId correto", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CompleteTaskUseCase(repository, historyRecorder);

    await useCase.execute("task-1");

    expect(repository.completeTask).toHaveBeenCalledWith("task-1");
  });

  it("retorna a tarefa concluída pelo repositório", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CompleteTaskUseCase(repository, historyRecorder);

    const result = await useCase.execute("task-1");

    expect(result).toEqual(completedTask);
  });

  it("regista evento de histórico após concluir", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CompleteTaskUseCase(repository, historyRecorder);

    await useCase.execute("task-1");

    expect(historyRecorder.record).toHaveBeenCalledWith({
      userId: "user-1",
      type: HistoryActionType.taskCompleted,
      title: "Concluiu: Tomar remédio",
      entityId: "task-1",
      category: "medication",
    });
  });

  it("propaga erros do repositório", async () => {
    const repository = createRepository({
      completeTask: vi
        .fn()
        .mockRejectedValue(new Error("Tarefa não encontrada")),
    });
    const historyRecorder = createHistoryRecorder();
    const useCase = new CompleteTaskUseCase(repository, historyRecorder);

    await expect(useCase.execute("task-missing")).rejects.toThrow(
      "Tarefa não encontrada",
    );
    expect(historyRecorder.record).not.toHaveBeenCalled();
  });

  it("é idempotente na camada de use case — delega ao repositório mesmo se já concluída", async () => {
    const alreadyCompleted: Task = {
      ...completedTask,
      status: "completed",
    };
    const repository = createRepository({
      completeTask: vi.fn().mockResolvedValue(alreadyCompleted),
    });
    const historyRecorder = createHistoryRecorder();
    const useCase = new CompleteTaskUseCase(repository, historyRecorder);

    const result = await useCase.execute("task-1");

    expect(repository.completeTask).toHaveBeenCalledWith("task-1");
    expect(result.status).toBe("completed");
    expect(historyRecorder.record).toHaveBeenCalled();
  });
});
