import { describe, expect, it, vi } from "vitest";

import type { UserPreferences } from "@/domain/entities/UserPreferences";
import { defaultPreferences } from "@/domain/entities/UserPreferences";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";
import type { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import { UpdatePreferencesUseCase } from "@/domain/usecases/preferences/UpdatePreferencesUseCase";

/**
 * `UpdatePreferencesUseCase` faz o papel do SavePreferencesUseCase (ADR-009).
 * Este ficheiro cobre a lógica de persistência e derivação do contraste máximo.
 */

function createRepository(
  overrides: Partial<IPreferencesRepository> = {},
): IPreferencesRepository {
  return {
    getPreferences: vi.fn(),
    savePreferences: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createHistoryRecorder(): IHistoryRecorder {
  return {
    record: vi.fn().mockResolvedValue(undefined),
  };
}

function buildPreferences(
  overrides: Partial<UserPreferences> = {},
): UserPreferences {
  return {
    ...defaultPreferences("user-1"),
    ...overrides,
  };
}

describe("SavePreferencesUseCase (UpdatePreferencesUseCase)", () => {
  it("salva preferências com todos os campos", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new UpdatePreferencesUseCase(repository, historyRecorder);
    const preferences = buildPreferences({
      fontSize: "large",
      spacing: "spacious",
      interfaceMode: "basic",
      audioFeedbackEnabled: true,
      largeTouchTargets: true,
      tasksNotificationsEnabled: false,
      taskNotificationOffset: "1h",
      remindersNotificationsEnabled: true,
      reminderNotificationOffset: "15m",
    });

    const result = await useCase.execute(preferences);

    expect(repository.savePreferences).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        fontSize: "large",
        spacing: "spacious",
        interfaceMode: "basic",
        audioFeedbackEnabled: true,
        largeTouchTargets: true,
        tasksNotificationsEnabled: false,
        taskNotificationOffset: "1h",
        remindersNotificationsEnabled: true,
        reminderNotificationOffset: "15m",
      }),
    );
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it("aplica lógica de maximum (darkMode=true + contrast=high → maximum)", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new UpdatePreferencesUseCase(repository, historyRecorder);

    const result = await useCase.execute(
      buildPreferences({ darkMode: true, contrast: "high" }),
    );

    expect(result.contrast).toBe("maximum");
    expect(repository.savePreferences).toHaveBeenCalledWith(
      expect.objectContaining({
        darkMode: true,
        contrast: "maximum",
      }),
    );
  });

  it("não deriva maximum quando darkMode está desligado", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new UpdatePreferencesUseCase(repository, historyRecorder);

    const result = await useCase.execute(
      buildPreferences({ darkMode: false, contrast: "high" }),
    );

    expect(result.contrast).toBe("high");
  });

  it("normaliza contrast=maximum para high ao persistir (não guardar maximum direto)", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new UpdatePreferencesUseCase(repository, historyRecorder);

    const result = await useCase.execute(
      buildPreferences({ darkMode: false, contrast: "maximum" }),
    );

    expect(result.contrast).toBe("high");
    expect(repository.savePreferences).toHaveBeenCalledWith(
      expect.objectContaining({ contrast: "high" }),
    );
  });

  it("chama repository.savePreferences() com preferências processadas", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new UpdatePreferencesUseCase(repository, historyRecorder);
    const preferences = buildPreferences({ darkMode: true, contrast: "high" });

    await useCase.execute(preferences);

    expect(repository.savePreferences).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(repository.savePreferences).mock.calls[0]?.[0];
    expect(saved?.contrast).toBe("maximum");
    expect(saved?.updatedAt).toBeInstanceOf(Date);
  });

  it("regista evento de histórico de acessibilidade", async () => {
    const repository = createRepository();
    const historyRecorder = createHistoryRecorder();
    const useCase = new UpdatePreferencesUseCase(repository, historyRecorder);

    await useCase.execute(buildPreferences());

    expect(historyRecorder.record).toHaveBeenCalledWith({
      userId: "user-1",
      type: HistoryActionType.accessibilityChanged,
      title: "Ajustou acessibilidade",
      entityId: null,
      category: null,
    });
  });

  it("propaga erros do repositório", async () => {
    const repository = createRepository({
      savePreferences: vi
        .fn()
        .mockRejectedValue(new Error("Falha ao salvar preferências")),
    });
    const historyRecorder = createHistoryRecorder();
    const useCase = new UpdatePreferencesUseCase(repository, historyRecorder);

    await expect(useCase.execute(buildPreferences())).rejects.toThrow(
      "Falha ao salvar preferências",
    );
    expect(historyRecorder.record).not.toHaveBeenCalled();
  });
});
