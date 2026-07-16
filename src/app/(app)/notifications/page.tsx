"use client";

import { NotificationsScreen } from "@/presentation/components/notifications/notificationsScreen";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { useNotificationHistory } from "@/presentation/hooks/useNotificationHistory";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { notifications, loading } = useNotificationHistory(user?.id ?? null);

  if (authLoading || !user) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-[#f8fafc]"
        role="status"
        aria-live="polite"
      >
        <p className="text-base text-[#64748b]">Carregando notificações...</p>
      </div>
    );
  }

  return (
    <NotificationsScreen notifications={notifications} loading={loading} />
  );
}
