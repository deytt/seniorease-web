"use client";

import { useEffect, useState } from "react";

import type { NotificationItem } from "@/domain/entities/NotificationItem";
import { countTodayNotifications } from "@/domain/usecases/notifications/CountTodayNotificationsUseCase";
import { getNotificationsDi } from "@/lib/di/notificationsDi";

interface NotificationSnapshot {
  userId: string;
  notifications: NotificationItem[];
}

export function useNotificationHistory(userId: string | null) {
  const [snapshot, setSnapshot] = useState<NotificationSnapshot | null>(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe =
      getNotificationsDi().notificationRepository.subscribeToNotifications(
        userId,
        (items) => {
          setSnapshot({ userId, notifications: items });
        },
      );

    return unsubscribe;
  }, [userId]);

  const notifications =
    userId && snapshot?.userId === userId ? snapshot.notifications : [];
  const loading = Boolean(userId) && snapshot?.userId !== userId;
  const todayCount = countTodayNotifications(notifications);

  return { notifications, todayCount, loading };
}
