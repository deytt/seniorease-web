"use client";

import { useEffect, useState } from "react";

import type { NotificationItem } from "@/domain/entities/NotificationItem";
import { countTodayNotifications } from "@/domain/usecases/notifications/CountTodayNotificationsUseCase";
import { getNotificationsDi } from "@/lib/di/notificationsDi";

export function useNotificationHistory(userId: string | null) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = getNotificationsDi().notificationRepository.subscribeToNotifications(
      userId,
      (items) => {
        setNotifications(items);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  const todayCount = countTodayNotifications(notifications);

  return { notifications, todayCount, loading };
}
