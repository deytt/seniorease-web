/**
 * Entidade de domínio — evento de histórico
 * Ver memory-bank/systemPatterns.md
 */
export interface HistoryEvent {
  id: string;
  userId: string;
  taskId?: string;
  eventType:
    | "task_completed"
    | "task_created"
    | "reminder_marked"
    | "preference_updated";
  title: string;
  description: string;
  createdAt: Date;
}
