"use client";

import { usePreferencesStore } from "@/presentation/providers/PreferencesProvider";

/**
 * Hook de leitura geral das preferências de acessibilidade — para qualquer
 * componente do app que precise se adaptar (ex: Módulo Tarefas checando
 * `interfaceMode` para simplificar a UI). Para a tela de configurações em
 * si, use `useAccessibility`.
 */
export function usePreferences() {
  const preferences = usePreferencesStore((state) => state.preferences);
  const isLoaded = usePreferencesStore((state) => state.isLoaded);

  return { preferences, isLoaded };
}
