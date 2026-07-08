"use client";

import { useCallback } from "react";

import { usePreferencesStore } from "@/presentation/providers/PreferencesProvider";
import {
  defaultPreferences,
  type UserPreferences,
} from "@/domain/entities/UserPreferences";

/**
 * Hook de apresentação para a tela Accessibility Center (Módulo 1).
 * Consome o mesmo store de `usePreferences`, mas expõe a API de escrita
 * (toggle/select por campo) que a tela precisa.
 */
export function useAccessibility() {
  const preferences = usePreferencesStore((state) => state.preferences);
  const userId = usePreferencesStore((state) => state.userId);
  const isLoaded = usePreferencesStore((state) => state.isLoaded);
  const isSaving = usePreferencesStore((state) => state.isSaving);
  const update = usePreferencesStore((state) => state.update);

  const setField = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      void update({ [key]: value } as Partial<UserPreferences>);
    },
    [update],
  );

  const resetToDefaults = useCallback(() => {
    void update(defaultPreferences(userId ?? "guest"));
  }, [update, userId]);

  return {
    preferences,
    isLoaded,
    isSaving,
    setField,
    resetToDefaults,
  };
}
