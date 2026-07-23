import { localStorageCache } from "@/infrastructure/cache/LocalStorageCache";

const REMEMBER_EMAIL_KEY = "seniorease:auth:rememberEmail";

export function getRememberedEmail(): string | null {
  return localStorageCache.get<string>(REMEMBER_EMAIL_KEY);
}

export function setRememberedEmail(email: string): void {
  localStorageCache.set(REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
}

export function clearRememberedEmail(): void {
  localStorageCache.remove(REMEMBER_EMAIL_KEY);
}
