import { useState } from "react";
import type { NotificationItem } from "@/domain/entities/NotificationItem";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";

/**
 * Hook para buscar o histórico de notificações enviadas pela Cloud Function.
 *
 * Lê a coleção `notifications/{id}` — somente-leitura, escrita é da Cloud Function.
 * Espelha o comportamento de `notificationHistoryProvider` do mobile.
 *
 * Não confundir com `useNotifications` (configura FCM foreground listener).
 */
export function useNotificationItems(repository: INotificationRepository) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async (userId: string, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const result = await repository.getNotifications(userId, limit);
      setItems(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar notificações",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Quantidade de notificações recebidas hoje.
   * Espelha `todayNotificationCountProvider` do mobile.
   */
  const todayCount = items.filter((n) => {
    const today = new Date();
    const s = n.sentAt;
    return (
      s.getFullYear() === today.getFullYear() &&
      s.getMonth() === today.getMonth() &&
      s.getDate() === today.getDate()
    );
  }).length;

  return { items, loading, error, fetchNotifications, todayCount };
}
