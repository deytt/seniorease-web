/**
 * Cache local genérico (localStorage) — ver systemPatterns.md.
 *
 * Uso principal: guardar as preferências de acessibilidade antes/sem login,
 * para que os ajustes de fonte/contraste/espaçamento continuem valendo
 * mesmo para um visitante não autenticado (ex: nas telas de auth), e para
 * evitar "flash" de configurações padrão enquanto o Firestore responde.
 *
 * Só toca no `localStorage` no client (guarda para SSR do Next.js).
 */
export class LocalStorageCache {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Armazenamento indisponível (modo privado, cota excedida, etc.):
      // falha silenciosamente — não é crítico, o Firestore continua sendo
      // a fonte da verdade quando o usuário está autenticado.
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }
}

export const localStorageCache = new LocalStorageCache();
