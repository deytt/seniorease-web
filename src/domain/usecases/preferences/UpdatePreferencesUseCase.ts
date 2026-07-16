import type { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import type { UserPreferences } from "@/domain/entities/UserPreferences";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";
import { HISTORY_STATIC_TITLES } from "@/domain/history/historyTitles";

/**
 * Faz o papel do "SavePreferencesUseCase" descrito na ADR-009: além de
 * persistir, aplica a regra de derivação do contraste máximo.
 */
export class UpdatePreferencesUseCase {
  constructor(
    private readonly repository: IPreferencesRepository,
    private readonly historyRecorder: IHistoryRecorder,
  ) {}

  async execute(preferences: UserPreferences): Promise<UserPreferences> {
    const derived: UserPreferences = {
      ...preferences,
      contrast:
        preferences.darkMode && preferences.contrast === "high"
          ? "maximum"
          : preferences.contrast === "maximum"
            ? "high"
            : preferences.contrast,
      updatedAt: new Date(),
    };

    await this.repository.savePreferences(derived);

    await this.historyRecorder.record({
      userId: derived.userId,
      type: HistoryActionType.accessibilityChanged,
      title: HISTORY_STATIC_TITLES[HistoryActionType.accessibilityChanged],
      entityId: null,
      category: null,
    });

    return derived;
  }
}
