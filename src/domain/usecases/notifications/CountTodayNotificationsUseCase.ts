import type { NotificationItem } from "@/domain/entities/NotificationItem";

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function countTodayNotifications(
  notifications: NotificationItem[],
  now: Date = new Date(),
): number {
  const todayStart = startOfDay(now).getTime();

  return notifications.filter(
    (notification) => notification.sentAt.getTime() >= todayStart,
  ).length;
}

export class CountTodayNotificationsUseCase {
  execute(notifications: NotificationItem[], now: Date = new Date()): number {
    return countTodayNotifications(notifications, now);
  }
}
