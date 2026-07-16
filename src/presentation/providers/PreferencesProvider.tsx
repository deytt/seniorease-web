"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/infrastructure/firebase/config";
import { localStorageCache } from "@/infrastructure/cache/LocalStorageCache";
import {
  getPreferencesUseCase,
  updatePreferencesUseCase,
} from "@/lib/di/preferencesDi";
import {
  defaultPreferences,
  FONT_SCALE_MAP,
  normalizePreferences,
  SPACING_SCALE_MAP,
  type UserPreferences,
} from "@/domain/entities/UserPreferences";

const GUEST_CACHE_KEY = "seniorease:preferences:guest";

interface PreferencesStore {
  preferences: UserPreferences;
  userId: string | null;
  isLoaded: boolean;
  isSaving: boolean;
  /** Chamado pelo PreferencesProvider quando o estado de auth muda. */
  hydrate: (userId: string | null) => Promise<void>;
  /** Atualiza um ou mais campos e persiste (Firestore se logado, cache local se visitante). */
  update: (patch: Partial<UserPreferences>) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences:
    normalizePreferences(
      localStorageCache.get<Partial<UserPreferences>>(GUEST_CACHE_KEY),
      "guest",
    ),
  userId: null,
  isLoaded: false,
  isSaving: false,

  hydrate: async (userId) => {
    set({ userId });

    if (!userId) {
      const cached = normalizePreferences(
        localStorageCache.get<Partial<UserPreferences>>(GUEST_CACHE_KEY),
        "guest",
      );
      set({ preferences: cached, isLoaded: true });
      return;
    }

    const preferences = await getPreferencesUseCase.execute(userId);
    set({
      preferences: normalizePreferences(preferences, userId),
      isLoaded: true,
    });
  },

  update: async (patch) => {
    const { preferences, userId } = get();
    const next: UserPreferences = { ...preferences, ...patch };

    set({ preferences: next, isSaving: true });

    try {
      if (userId) {
        const saved = await updatePreferencesUseCase.execute(next);
        set({ preferences: saved });
      } else {
        // Visitante (sem login): guarda localmente. O ADR-006/Módulo 1 não
        // exige conta para ajustar acessibilidade nas telas de auth.
        localStorageCache.set(GUEST_CACHE_KEY, next);
      }
    } finally {
      set({ isSaving: false });
    }
  },
}));

/** Aplica as preferências como CSS custom properties / atributos em <html>. */
function applyPreferencesToDocument(preferences: UserPreferences) {
  const root = document.documentElement;

  root.style.setProperty(
    "--a11y-font-scale",
    String(FONT_SCALE_MAP[preferences.fontSize]),
  );
  root.style.setProperty(
    "--a11y-spacing-scale",
    String(SPACING_SCALE_MAP[preferences.spacing]),
  );

  root.classList.toggle("dark", preferences.darkMode);
  root.classList.toggle("a11y-large-touch", preferences.largeTouchTargets);

  // Contraste: deriva "maximum" em runtime (dark + high = maximum, ADR-009)
  const effectiveContrast =
    preferences.darkMode && preferences.contrast === "high"
      ? "maximum"
      : preferences.contrast === "maximum" && !preferences.darkMode
        ? "high"
        : preferences.contrast;
  root.dataset.contrast = effectiveContrast;

  // Espaçamento: data-spacing no <html> para os seletores CSS de spacing scale
  root.dataset.spacing = preferences.spacing;

  // Modo de interface: data-interface-mode para .advanced-only visibility
  root.dataset.interfaceMode = preferences.interfaceMode;
}

/**
 * Monta-se uma vez na raiz do app (src/app/layout.tsx). Responsável por:
 * 1. Observar o login/logout do Firebase e (re)carregar as preferências;
 * 2. Manter o <html> sempre sincronizado com o estado atual (fonte,
 *    contraste, modo escuro, espaçamento, botões maiores).
 */
export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const preferences = usePreferencesStore((state) => state.preferences);
  const hydrate = usePreferencesStore((state) => state.hydrate);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      void hydrate(user?.uid ?? null);
    });
    return unsubscribe;
  }, [hydrate]);

  useEffect(() => {
    applyPreferencesToDocument(preferences);
  }, [preferences]);

  return <>{children}</>;
}
