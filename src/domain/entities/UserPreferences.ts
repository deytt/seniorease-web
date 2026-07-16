export type FontSize = "small" | "medium" | "large" | "extra_large";
export type ContrastLevel = "default" | "high" | "maximum";
export type Spacing = "compact" | "comfortable" | "spacious";
export type InterfaceMode = "basic" | "advanced";
export type NotificationOffset = "15m" | "30m" | "1h" | "6h" | "1d";

export const NOTIFICATION_OFFSET_OPTIONS: {
  value: NotificationOffset;
  label: string;
}[] = [
  { value: "15m", label: "15 minutos antes" },
  { value: "30m", label: "30 minutos antes" },
  { value: "1h", label: "1 hora antes" },
  { value: "6h", label: "6 horas antes" },
  { value: "1d", label: "1 dia antes" },
];

/**
 * Espelha 1:1 o documento `preferences/{userId}` — ver firebaseSchema.md.
 *
 * Nota (ADR-009): `contrast: 'maximum'` nunca é escrito diretamente pela UI.
 * É derivado em runtime quando `darkMode == true && contrast == 'high'`
 * (ver UpdatePreferencesUseCase). A mesma regra vale no mobile.
 */
export interface UserPreferences {
  userId: string;
  fontSize: FontSize;
  darkMode: boolean;
  contrast: ContrastLevel;
  spacing: Spacing;
  interfaceMode: InterfaceMode;
  audioFeedbackEnabled: boolean;
  largeTouchTargets: boolean;
  tasksNotificationsEnabled: boolean;
  taskNotificationOffset: NotificationOffset;
  remindersNotificationsEnabled: boolean;
  reminderNotificationOffset: NotificationOffset;
  updatedAt: Date | null;
}

/** Campos legados do schema pré-ADR-020 — só para leitura de documentos antigos. */
type LegacyPreferenceFields = {
  remindersEnabled?: boolean;
  notificationTime?: string | null;
};

/**
 * Multiplicadores de fonte — techContext.md.
 * "small" nunca deve resultar em texto abaixo de 16px reais (base já é 16px).
 */
export const FONT_SCALE_MAP: Record<FontSize, number> = {
  small: 0.875,
  medium: 1,
  large: 1.125,
  extra_large: 1.25,
};

/** Multiplicador de espaçamento — techContext.md ("Espaçoso" = 1.5×). */
export const SPACING_SCALE_MAP: Record<Spacing, number> = {
  compact: 0.85,
  comfortable: 1,
  spacious: 1.5,
};

export function defaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    fontSize: "medium",
    darkMode: false,
    contrast: "default",
    spacing: "comfortable",
    interfaceMode: "advanced",
    audioFeedbackEnabled: false,
    largeTouchTargets: false,
    tasksNotificationsEnabled: true,
    taskNotificationOffset: "30m",
    remindersNotificationsEnabled: true,
    reminderNotificationOffset: "30m",
    updatedAt: null,
  };
}

export function normalizePreferences(
  value: (Partial<UserPreferences> & LegacyPreferenceFields) | null | undefined,
  userId: string,
): UserPreferences {
  const defaults = defaultPreferences(userId);
  const remindersNotificationsEnabled =
    value?.remindersNotificationsEnabled ??
    value?.remindersEnabled ??
    defaults.remindersNotificationsEnabled;

  return {
    ...defaults,
    ...value,
    userId: value?.userId ?? userId,
    tasksNotificationsEnabled:
      value?.tasksNotificationsEnabled ??
      value?.remindersEnabled ??
      defaults.tasksNotificationsEnabled,
    taskNotificationOffset:
      value?.taskNotificationOffset ?? defaults.taskNotificationOffset,
    remindersNotificationsEnabled,
    reminderNotificationOffset:
      value?.reminderNotificationOffset ?? defaults.reminderNotificationOffset,
    updatedAt: value?.updatedAt ?? defaults.updatedAt,
  };
}
