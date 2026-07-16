import type { NotificationItem } from "@/domain/entities/NotificationItem";

/**
 * Contrato da camada de domínio para o histórico de notificações.
 *
 * Espelha `NotificationHistoryRepository` do mobile.
 * O cliente é **somente-leitura** — a escrita pertence à Cloud Function.
 */
export interface INotificationRepository {
  /**
   * Retorna os últimos `limit` registros de `notifications/{id}` do usuário,
   * ordenados por `sentAt` decrescente.
   */
  getNotifications(userId: string, limit?: number): Promise<NotificationItem[]>;
}
