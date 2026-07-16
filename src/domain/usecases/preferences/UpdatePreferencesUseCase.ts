import type { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import type { UserPreferences } from "@/domain/entities/UserPreferences";

/**
 * Faz o papel do "SavePreferencesUseCase" descrito na ADR-009: além de
 * persistir, aplica a regra de derivação do contraste máximo.
 *
 * Regra (ADR-009, válida em Web e Mobile):
 * `contrast: 'maximum'` NUNCA é escolhido diretamente pelo usuário na UI —
 * é derivado automaticamente quando `darkMode == true && contrast == 'high'`.
 */
export class UpdatePreferencesUseCase {
  constructor(private readonly repository: IPreferencesRepository) {}

  async execute(preferences: UserPreferences): Promise<UserPreferences> {
    const derived: UserPreferences = {
      ...preferences,
      contrast:
        preferences.darkMode && preferences.contrast === "high"
          ? "maximum"
          : preferences.contrast === "maximum"
            ? "high" // usuário nunca escolhe "maximum" manualmente; se veio assim sem dark mode, rebaixa para "high"
            : preferences.contrast,
      remindersEnabled: preferences.remindersNotificationsEnabled,
      updatedAt: new Date(),
    };

    await this.repository.savePreferences(derived);
    return derived;
  }
}
