import { describe, expect, it, vi } from "vitest";

import type { Reminder } from "@/domain/entities/Reminder";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";
import type { IReminderRepository } from "@/domain/repositories/IReminderRepository";
import {
  CreateReminderUseCase,
  type CreateReminderInput,
} from "@/domain/usecases/reminders/CreateReminderUseCase";

const createdReminder: Reminder = {
  id: "reminder-1",
  userId: "user-1",
  title: "Beber água",
  message: "Um copo agora",
  category: "hydration",
  scheduledAt: new Date("2026-07-27T10:00:00"),
  isRead: false,
  notified: false,
  createdAt: new Date("2026-07-26T12:00:00"),
};

function createRepository(
  overrides: Partial<IReminderRepository> = {},
): IReminderRepository {
  return {
    getReminders: vi.fn(),
    getReminderById: vi.fn(),
    createReminder: vi.fn().mockResolvedValue(createdReminder),
    updateReminder: vi.fn(),
    deleteReminder: vi.fn(),
    markAsRead: vi.fn(),
    ...overrides,
  };
}

function createHistoryRecorder(): IHistoryRecorder {
  return {
    record: vi.fn().mockResolvedValue(undefined),
  };
}

function buildInput(
  overrides: Partial<CreateReminderInput> = {},
): CreateReminderInput {
  return {
    userId: "user-1",
    title: "Beber água",
    message: "Um copo agora",
    category: "hydration",
    scheduledAt: new Date("2026-07-27T10:00:00"),
    ...overrides,
  };
}

describe("CreateReminderUseCase", () => {
  it("cria lembrete com campos obrigatórios", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateReminderUseCase(repository, historyRecorder);

    const result = await useCase.execute(buildInput());

    expect(result).toEqual(createdReminder);
    expect(repository.createReminder).toHaveBeenCalledTimes(1);
  });

  it("chama repository.createReminder() com os dados corretos", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateReminderUseCase(repository, historyRecorder);
    const input = buildInput({ taskId: "task-1" });

    await useCase.execute(input);

    expect(repository.createReminder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        taskId: "task-1",
        title: "Beber água",
        message: "Um copo agora",
        category: "hydration",
        scheduledAt: input.scheduledAt,
        isRead: false,
        notified: false,
        createdAt: expect.any(Date),
      }),
    );
  });

  it("remove espaços extras do título e da mensagem", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateReminderUseCase(repository, historyRecorder);

    await useCase.execute(
      buildInput({
        title: "  Beber água  ",
        message: "  Um copo agora  ",
      }),
    );

    expect(repository.createReminder).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Beber água",
        message: "Um copo agora",
      }),
    );
  });

  it("retorna o lembrete criado pelo repositório", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateReminderUseCase(repository, historyRecorder);

    const result = await useCase.execute(buildInput());

    expect(result).toBe(createdReminder);
  });

  it("regista evento de histórico após criar", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateReminderUseCase(repository, historyRecorder);

    await useCase.execute(buildInput());

    expect(historyRecorder.record).toHaveBeenCalledWith({
      userId: "user-1",
      type: HistoryActionType.reminderCreated,
      title: "Criou lembrete: Beber água",
      entityId: "reminder-1",
      category: "hydration",
    });
  });

  it("propaga erros do repositório", async () => {
    const repository = createRepository({
      createReminder: vi
        .fn()
        .mockRejectedValue(new Error("Falha ao criar lembrete")),
    });
    const historyRecorder = createHistoryRecorder();
    const useCase = new CreateReminderUseCase(repository, historyRecorder);

    await expect(useCase.execute(buildInput())).rejects.toThrow(
      "Falha ao criar lembrete",
    );
    expect(historyRecorder.record).not.toHaveBeenCalled();
  });
});
