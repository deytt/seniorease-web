import type { NotificationItem } from "@/domain/entities/NotificationItem";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";

/**
 * Retorna os últimos avisos enviados pela Cloud Function ao usuário.
 *
 * Espelha `WatchNotificationHistoryUseCase` do mobile, adaptado para
 * leitura pontual (sem stream, seguindo o padrão do projeto web).
 */
export class GetNotificationsUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(userId: string, limit = 50): Promise<NotificationItem[]> {
    return this.repository.getNotifications(userId, limit);
  }
}
