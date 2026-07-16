import type { NotificationItem } from "@/domain/entities/NotificationItem";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";

export class GetNotificationHistoryUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  execute(userId: string, limit = 50): Promise<NotificationItem[]> {
    return this.notificationRepository.getNotifications(userId, limit);
  }
}
