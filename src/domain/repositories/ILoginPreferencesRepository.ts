import type { LoginPreferences } from "@/domain/entities/LoginPreferences";

/**
 * Contrato para persistir preferências de "Lembrar de mim".
 * Implementação: localStorage (paridade com SharedPreferences no mobile).
 */
export interface ILoginPreferencesRepository {
  get(): LoginPreferences;
  save(preferences: LoginPreferences): void;
}
