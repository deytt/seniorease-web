import { HistoryActionType } from "@/domain/history/HistoryActionType";

export const STREAK_ACHIEVEMENT_DAYS = 7;

export function buildTaskCreatedTitle(taskTitle: string): string {
  return `Criou: ${taskTitle}`;
}

export function buildTaskCompletedTitle(taskTitle: string): string {
  return `Concluiu: ${taskTitle}`;
}

export function buildTaskStepCompletedTitle(stepTitle: string): string {
  return `Passo concluído: ${stepTitle}`;
}

export function buildTaskDeletedTitle(taskTitle: string): string {
  return `Excluiu: ${taskTitle}`;
}

export function buildReminderCreatedTitle(reminderTitle: string): string {
  return `Criou lembrete: ${reminderTitle}`;
}

export function buildReminderCompletedTitle(reminderTitle: string): string {
  return `Concluiu: ${reminderTitle}`;
}

export function buildReminderEditedTitle(reminderTitle: string): string {
  return `Editou lembrete: ${reminderTitle}`;
}

export function buildReminderDeletedTitle(reminderTitle: string): string {
  return `Excluiu lembrete: ${reminderTitle}`;
}

export function buildStreakAchievementTitle(days = STREAK_ACHIEVEMENT_DAYS): string {
  return `Conquista desbloqueada: sequência de ${days} dias!`;
}

export const HISTORY_STATIC_TITLES = {
  [HistoryActionType.accessibilityChanged]: "Ajustou acessibilidade",
  [HistoryActionType.profileUpdated]: "Atualizou perfil",
  [HistoryActionType.accountVerified]: "Conta verificada",
} as const;
