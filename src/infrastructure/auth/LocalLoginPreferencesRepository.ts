import {
  INITIAL_LOGIN_PREFERENCES,
  parseLoginMethod,
  type LoginPreferences,
} from "@/domain/entities/LoginPreferences";
import type { ILoginPreferencesRepository } from "@/domain/repositories/ILoginPreferencesRepository";
import { localStorageCache } from "@/infrastructure/cache/LocalStorageCache";

/** Chaves alinhadas ao mobile (`login_remember_me`, etc.). */
const K_REMEMBER_ME = "login_remember_me";
const K_LAST_EMAIL = "login_last_email";
const K_LAST_METHOD = "login_last_method";

/** Flag temporário para completar redirect Google com a preferência correta. */
const K_PENDING_REMEMBER = "login_pending_remember_me";

export class LocalLoginPreferencesRepository
  implements ILoginPreferencesRepository
{
  get(): LoginPreferences {
    const rememberMe =
      localStorageCache.get<boolean>(K_REMEMBER_ME) ??
      INITIAL_LOGIN_PREFERENCES.rememberMe;

    if (!rememberMe) {
      return { rememberMe: false, lastEmail: null, lastMethod: null };
    }

    const email = localStorageCache.get<string>(K_LAST_EMAIL);
    const methodRaw = localStorageCache.get<string>(K_LAST_METHOD);

    return {
      rememberMe: true,
      lastEmail: email?.trim() ? email.trim().toLowerCase() : null,
      lastMethod:
        email?.trim() ? parseLoginMethod(methodRaw) : null,
    };
  }

  save(preferences: LoginPreferences): void {
    localStorageCache.set(K_REMEMBER_ME, preferences.rememberMe);

    const email = preferences.lastEmail?.trim().toLowerCase() ?? null;
    const shouldRemember =
      preferences.rememberMe && email != null && email.length > 0;

    if (shouldRemember) {
      localStorageCache.set(K_LAST_EMAIL, email);
      localStorageCache.set(
        K_LAST_METHOD,
        preferences.lastMethod ?? "email",
      );
    } else {
      localStorageCache.remove(K_LAST_EMAIL);
      localStorageCache.remove(K_LAST_METHOD);
    }
  }
}

export const loginPreferencesRepository =
  new LocalLoginPreferencesRepository();

/** Guarda a opção "lembrar" antes do redirect Google (popup bloqueado). */
export function setPendingRememberMe(rememberMe: boolean): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(K_PENDING_REMEMBER, rememberMe ? "1" : "0");
}

export function consumePendingRememberMe(): boolean | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(K_PENDING_REMEMBER);
  if (raw == null) return null;
  sessionStorage.removeItem(K_PENDING_REMEMBER);
  return raw === "1";
}
