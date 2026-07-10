import type { ReminderCategory } from "./ReminderCategory";

/**
 * Entidade de domínio — espelha `reminders/{id}` em firebaseSchema.md.
 * Consistente com o mobile (`features/reminders/domain/entities/reminder.dart`).
 */
export interface Reminder {
  id: string;
  userId: string;
  taskId?: string;
  title: string;
  message: string;
  category: ReminderCategory;
  scheduledAt: Date;
  /** `true` = lembrete concluído (mesmo semântica do mobile: `isDone => isRead`). */
  isRead: boolean;
  /**
   * Controlado pela Cloud Function de push (ADR-020).
   * Cliente escreve `false` na criação e repõe `false` se `scheduledAt` mudar.
   */
  notified: boolean;
  createdAt: Date;
}
