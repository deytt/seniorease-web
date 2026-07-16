/**
 * Tipos de evento de histórico — espelha `HistoryActionType` do mobile (ADR-017).
 * `streakAchievement` é gravado quando o utilizador atinge 7 dias consecutivos.
 */
export const HistoryActionType = {
  taskCreated: "taskCreated",
  taskCompleted: "taskCompleted",
  taskStepCompleted: "taskStepCompleted",
  taskDeleted: "taskDeleted",
  reminderCreated: "reminderCreated",
  reminderCompleted: "reminderCompleted",
  reminderEdited: "reminderEdited",
  reminderDeleted: "reminderDeleted",
  accessibilityChanged: "accessibilityChanged",
  profileUpdated: "profileUpdated",
  accountVerified: "accountVerified",
  streakAchievement: "streakAchievement",
} as const;

export type HistoryActionType =
  (typeof HistoryActionType)[keyof typeof HistoryActionType];

export const COMPLETION_HISTORY_TYPES = [
  HistoryActionType.taskCompleted,
  HistoryActionType.reminderCompleted,
] as const;

export const LOW_RELEVANCE_HISTORY_TYPES = [
  HistoryActionType.taskDeleted,
  HistoryActionType.reminderEdited,
  HistoryActionType.reminderDeleted,
  HistoryActionType.accessibilityChanged,
  HistoryActionType.profileUpdated,
] as const;

export function isCompletionHistoryType(type: HistoryActionType): boolean {
  return (COMPLETION_HISTORY_TYPES as readonly string[]).includes(type);
}

export function isLowRelevanceHistoryType(type: HistoryActionType): boolean {
  return (LOW_RELEVANCE_HISTORY_TYPES as readonly string[]).includes(type);
}

/** Mapeia nomes legados da web (snake_case) para o schema mobile. */
const LEGACY_TYPE_MAP: Record<string, HistoryActionType> = {
  task_completed: HistoryActionType.taskCompleted,
  task_created: HistoryActionType.taskCreated,
  reminder_marked: HistoryActionType.reminderCompleted,
  preference_updated: HistoryActionType.accessibilityChanged,
};

export function normalizeHistoryActionType(raw: string): HistoryActionType {
  if (raw in HistoryActionType) {
    return raw as HistoryActionType;
  }

  return LEGACY_TYPE_MAP[raw] ?? HistoryActionType.taskCompleted;
}
