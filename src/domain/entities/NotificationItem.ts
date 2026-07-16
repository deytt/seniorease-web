/**
 * Tipo da entidade que originou a notificação.
 * Espelha `NotificationEntityType` do mobile (notification_item.dart).
 */
export type NotificationEntityType = "task" | "reminder";

/**
 * Registro de uma notificação enviada pela Cloud Function `sendDueNotifications`.
 *
 * Espelha `NotificationItem` do mobile e o documento `notifications/{id}`
 * gravado em Firestore pela Cloud Function após o push ser disparado.
 * O cliente é **somente-leitura** — a escrita é exclusiva da Cloud Function.
 */
export interface NotificationItem {
  id: string;
  userId: string;
  /** ID da tarefa ou lembrete que gerou a notificação. */
  entityId: string;
  entityType: NotificationEntityType;
  /** Título do push enviado (ex.: "Tarefa em 30 min"). */
  title: string;
  /** Corpo do push enviado (título da tarefa/lembrete). */
  body: string;
  /** Momento em que a Cloud Function enviou o push. */
  sentAt: Date;
}
