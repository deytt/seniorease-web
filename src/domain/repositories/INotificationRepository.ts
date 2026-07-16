import type { NotificationItem } from "@/domain/entities/NotificationItem";

export interface INotificationRepository {
  getNotifications(userId: string, limit?: number): Promise<NotificationItem[]>;
  subscribeToNotifications(
    userId: string,
    callback: (items: NotificationItem[]) => void,
    limit?: number,
  ): () => void;
}
