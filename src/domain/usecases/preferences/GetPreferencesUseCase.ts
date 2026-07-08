import type { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import {
  defaultPreferences,
  type UserPreferences,
} from "@/domain/entities/UserPreferences";

export class GetPreferencesUseCase {
  constructor(private readonly repository: IPreferencesRepository) {}

  /**
   * Sempre retorna preferências válidas. Se o usuário nunca configurou nada
   * (ou o Firestore está indisponível), cai para `defaultPreferences` —
   * mesma regra do mobile (ADR-009): o app nunca deve travar por falta de
   * preferências salvas.
   */
  async execute(userId: string): Promise<UserPreferences> {
    try {
      const preferences = await this.repository.getPreferences(userId);
      return preferences ?? defaultPreferences(userId);
    } catch {
      return defaultPreferences(userId);
    }
  }
}
