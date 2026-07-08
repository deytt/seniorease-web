import type { UserPreferences } from "@/domain/entities/UserPreferences";

/**
 * Contrato implementado pela camada de Infrastructure
 * (ex: FirebasePreferencesRepository). O Domain nunca importa Firebase —
 * apenas esta interface.
 */
export interface IPreferencesRepository {
  getPreferences(userId: string): Promise<UserPreferences | null>;
  savePreferences(preferences: UserPreferences): Promise<void>;
}
