/**
 * Preferências de login lembradas localmente entre sessões.
 * Espelha o mobile (`LoginPreferences` / SharedPreferences).
 *
 * Guarda apenas dados não sensíveis. **Nunca** guarda a senha.
 * A sessão Firebase é independente deste flag.
 */

export type LoginMethod = "email" | "google";

export interface LoginPreferences {
  /** O utilizador optou por ser lembrado neste dispositivo. Default: true. */
  rememberMe: boolean;
  /** Último e-mail (só quando rememberMe é true). */
  lastEmail: string | null;
  /** Método do último login (só quando rememberMe é true). */
  lastMethod: LoginMethod | null;
}

export const INITIAL_LOGIN_PREFERENCES: LoginPreferences = {
  rememberMe: true,
  lastEmail: null,
  lastMethod: null,
};

export function hasRememberedIdentity(prefs: LoginPreferences): boolean {
  return (
    prefs.rememberMe &&
    prefs.lastEmail != null &&
    prefs.lastEmail.trim().length > 0
  );
}

export function parseLoginMethod(value: string | null | undefined): LoginMethod {
  return value === "google" ? "google" : "email";
}
