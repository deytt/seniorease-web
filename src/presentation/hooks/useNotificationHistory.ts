"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { NotificationItem } from "@/domain/entities/NotificationItem";
import { countTodayNotifications } from "@/domain/usecases/notifications/CountTodayNotificationsUseCase";
import { getNotificationsDi } from "@/lib/di/notificationsDi";

interface NotificationSnapshot {
  userId: string;
  notifications: NotificationItem[];
}

function lastSeenKey(userId: string): string {
  return `seniorease_notif_last_seen_${userId}`;
}

function readLastSeen(userId: string): Date {
  if (typeof window === "undefined") return new Date(0);
  const stored = localStorage.getItem(lastSeenKey(userId));
  return stored ? new Date(Number(stored)) : new Date(0);
}

export function useNotificationHistory(userId: string | null) {
  const [snapshot, setSnapshot] = useState<NotificationSnapshot | null>(null);

  /**
   * Contador incrementado cada vez que markAllAsRead() é chamado.
   * Serve apenas para forçar a re-derivação de lastSeenAt a partir do
   * localStorage sem chamar setState diretamente dentro de um effect.
   */
  const [readVersion, setReadVersion] = useState(0);

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

  // Derivado do localStorage a cada mudança de userId ou após markAllAsRead()
  const lastSeenAt = useMemo(
    () => (userId ? readLastSeen(userId) : new Date(0)),
    // readVersion é a dependência que aciona a re-leitura após marcar como lido
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, readVersion],
  );

  // Notificações recebidas após a última visita à aba de notificações
  const unreadCount = notifications.filter(
    (n) => n.sentAt.getTime() > lastSeenAt.getTime(),
  ).length;

  /**
   * Persiste o timestamp atual em localStorage e força a re-derivação de
   * lastSeenAt. Deve ser chamado quando o utilizador abre a tela de notificações.
   */
  const markAllAsRead = useCallback(() => {
    if (!userId) return;
    localStorage.setItem(lastSeenKey(userId), String(Date.now()));
    setReadVersion((v) => v + 1);
  }, [userId]);

  return { notifications, todayCount, unreadCount, lastSeenAt, markAllAsRead, loading };
}
