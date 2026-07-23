"use client";

import { NotificationsScreen } from "@/presentation/components/notifications/notificationsScreen";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useNotificationHistory } from "@/presentation/hooks/useNotificationHistory";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { preferences } = usePreferences();
  const { notifications, loading } = useNotificationHistory(user?.id ?? null);

  if (authLoading || !user) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <p className="text-base text-muted-foreground">Carregando notificações...</p>
      </div>
    );
  }

  return (
    <NotificationsScreen
      notifications={notifications}
      loading={loading}
      userId={user.id}
      interfaceMode={preferences.interfaceMode}
    />
  );
}
