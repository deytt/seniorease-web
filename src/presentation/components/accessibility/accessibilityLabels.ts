import type { UserPreferences } from "@/domain/entities/UserPreferences";

export interface AccessibilityPreviewSummary {
  fontSize: string;
  interfaceMode: string;
  spacing: string;
  contrast: string;
  theme: string;
  audioFeedback: string;
  largeTouchTargets: string;
}

const FONT_SIZE_LABELS: Record<UserPreferences["fontSize"], string> = {
  small: "Pequena (88%)",
  medium: "Média (100%)",
  large: "Grande (113%)",
  extra_large: "Extra grande (125%)",
};

const SPACING_LABELS: Record<UserPreferences["spacing"], string> = {
  compact: "Compacto",
  comfortable: "Confortável",
  spacious: "Espaçoso",
};

const CONTRAST_LABELS: Record<UserPreferences["contrast"], string> = {
  default: "Padrão",
  high: "Alto",
  maximum: "Máximo",
};

export function getAccessibilityPreviewSummary(
  preferences: UserPreferences,
): AccessibilityPreviewSummary {
  const effectiveContrast =
    preferences.darkMode && preferences.contrast === "high"
      ? "maximum"
      : preferences.contrast;

  return {
    fontSize: FONT_SIZE_LABELS[preferences.fontSize],
    interfaceMode:
      preferences.interfaceMode === "basic" ? "Básico" : "Avançado",
    spacing: SPACING_LABELS[preferences.spacing],
    contrast: CONTRAST_LABELS[effectiveContrast],
    theme: preferences.darkMode ? "Modo escuro" : "Modo claro",
    audioFeedback: preferences.audioFeedbackEnabled ? "Ativado" : "Desativado",
    largeTouchTargets: preferences.largeTouchTargets ? "Ativado" : "Desativado",
  };
}
