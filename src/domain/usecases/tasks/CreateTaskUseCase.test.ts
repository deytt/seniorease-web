import { describe, expect, it, vi } from "vitest";

import type { Task } from "@/domain/entities/Task";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import {
  CreateTaskUseCase,
  type CreateTaskInput,
} from "@/domain/usecases/tasks/CreateTaskUseCase";

const createdTask: Task = {
  id: "task-1",
  userId: "user-1",
  title: "Tomar remédio",
  description: "Após o café da manhã",
  steps: [
    {
      id: "step_0",
      taskId: "task-1",
      order: 0,
      title: "Abrir o frasco",
      instruction: "Com cuidado",
      isCompleted: false,
    },
  ],
  status: "pending",
  priority: "high",
  category: "medication",
  dueDate: new Date("2026-07-27T08:00:00"),
  notified: false,
  createdAt: new Date("2026-07-26T10:00:00"),
  updatedAt: new Date("2026-07-26T10:00:00"),
};

function createRepository(
  overrides: Partial<ITaskRepository> = {},
): ITaskRepository {
  return {
    getTasks: vi.fn(),
    getTaskById: vi.fn(),
    createTask: vi.fn().mockResolvedValue(createdTask),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    completeTask: vi.fn(),
    ...overrides,
  };
}

function createHistoryRecorder(): IHistoryRecorder {
  return {
    record: vi.fn().mockResolvedValue(undefined),
  };
}

function buildInput(
  overrides: Partial<CreateTaskInput> = {},
): CreateTaskInput {
  return {
    userId: "user-1",
    title: "Tomar remédio",
    description: "Após o café da manhã",
    steps: [
      {
        order: 0,
        title: "Abrir o frasco",
        instruction: "Com cuidado",
      },
    ],
    dueDate: new Date("2026-07-27T08:00:00"),
    priority: "high",
    category: "medication",
    ...overrides,
  };
}

describe("CreateTaskUseCase", () => {
  it("cria tarefa com todos os campos obrigatórios", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateTaskUseCase(repository, historyRecorder);

    const result = await useCase.execute(buildInput());

    expect(result).toEqual(createdTask);
    expect(repository.createTask).toHaveBeenCalledTimes(1);
  });

  it("chama repository.createTask() com os dados corretos", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateTaskUseCase(repository, historyRecorder);
    const input = buildInput();

    await useCase.execute(input);

    expect(repository.createTask).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        title: "Tomar remédio",
        description: "Após o café da manhã",
        status: "pending",
        priority: "high",
        category: "medication",
        dueDate: input.dueDate,
        notified: false,
        steps: [
          {
            id: "step_0",
            taskId: "temp",
            order: 0,
            title: "Abrir o frasco",
            instruction: "Com cuidado",
            isCompleted: false,
          },
        ],
      }),
    );
  });

  it("retorna a tarefa criada pelo repositório", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateTaskUseCase(repository, historyRecorder);

    const result = await useCase.execute(buildInput());

    expect(result).toBe(createdTask);
  });

  it("regista evento de histórico após criar", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateTaskUseCase(repository, historyRecorder);

    await useCase.execute(buildInput());

    expect(historyRecorder.record).toHaveBeenCalledWith({
      userId: "user-1",
      type: HistoryActionType.taskCreated,
      title: "Criou: Tomar remédio",
      entityId: "task-1",
      category: "medication",
    });
  });

  it("aceita tarefa sem passos", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateTaskUseCase(repository, historyRecorder);

    await useCase.execute(buildInput({ steps: [] }));

    expect(repository.createTask).toHaveBeenCalledWith(
      expect.objectContaining({ steps: [] }),
    );
  });

  it("mapeia vários passos com ids sequenciais", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateTaskUseCase(repository, historyRecorder);

    await useCase.execute(
      buildInput({
        steps: [
          { order: 0, title: "Passo 1", instruction: "" },
          { order: 1, title: "Passo 2", instruction: "Detalhe" },
        ],
      }),
    );

    expect(repository.createTask).toHaveBeenCalledWith(
      expect.objectContaining({
        steps: [
          {
            id: "step_0",
            taskId: "temp",
            order: 0,
            title: "Passo 1",
            instruction: "",
            isCompleted: false,
          },
          {
            id: "step_1",
            taskId: "temp",
            order: 1,
            title: "Passo 2",
            instruction: "Detalhe",
            isCompleted: false,
          },
        ],
      }),
    );
  });

  it("propaga erros do repositório", async () => {
    const repository = createRepository({
      createTask: vi.fn().mockRejectedValue(new Error("Falha ao gravar")),
    });
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateTaskUseCase(repository, historyRecorder);

    await expect(useCase.execute(buildInput())).rejects.toThrow(
      "Falha ao gravar",
    );
    expect(historyRecorder.record).not.toHaveBeenCalled();
  });
});
