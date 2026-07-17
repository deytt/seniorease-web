"use client";

import { usePreferencesStore } from "@/presentation/providers/PreferencesProvider";
import { SeniorFeedback } from "./seniorFeedback";

/**
 * Hook que expõe o SeniorFeedback com a preferência do utilizador já embutida.
 *
 * Uso:
 *   const feedback = useSeniorFeedback();
 *   feedback.light();      // tap genérico
 *   feedback.selection();  // toggle / chip
 *   feedback.medium();     // ação importante
 *   feedback.success();    // conclusão / celebração
 */
export function useSeniorFeedback() {
  const enabled = usePreferencesStore(
    (s) => s.preferences.audioFeedbackEnabled,
  );

  return {
    light: () => SeniorFeedback.light(enabled),
    selection: () => SeniorFeedback.selection(enabled),
    medium: () => SeniorFeedback.medium(enabled),
    success: () => SeniorFeedback.success(enabled),
  };
}
