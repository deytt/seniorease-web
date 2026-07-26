"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bell, CheckSquare2 } from "lucide-react";

import type { NotificationItem } from "@/domain/entities/NotificationItem";
import { cn } from "@/lib/utils";
import {
  formatNotificationTime,
  getNotificationEntityHref,
  getNotificationEntityLabel,
} from "@/presentation/components/notifications/notificationUtils";
import { PageHeader } from "@/presentation/components/ui/pageHeader";
import { useNotificationsTour } from "@/presentation/hooks/useNotificationsTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  loading?: boolean;
  userId?: string;
  interfaceMode?: "basic" | "advanced";
  /** Timestamp da última vez que o utilizador abriu esta tela (do localStorage). */
  lastSeenAt?: Date;
  /** Persiste o timestamp de leitura no localStorage e zera o badge. */
  onMarkAllAsRead?: () => void;
}

function NotificationCard({
  notification,
  isUnread,
}: {
  notification: NotificationItem;
  isUnread: boolean;
}) {
  const href = getNotificationEntityHref(
    notification.entityType,
    notification.entityId,
  );
  const Icon = notification.entityType === "task" ? CheckSquare2 : Bell;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-start gap-4 rounded-[14px] border p-4 transition-colors hover:bg-muted",
        isUnread
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[12px]",
          notification.entityType === "task"
            ? "bg-primary/15 text-primary"
            : "bg-warning/15 text-warning",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn("text-sm font-semibold", isUnread ? "text-foreground" : "text-foreground/80")}>
            {notification.title}
          </p>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-sm font-semibold text-primary">
            {getNotificationEntityLabel(notification.entityType)}
          </span>
          {isUnread && (
            <span className="ml-auto flex size-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {formatNotificationTime(notification.sentAt)}
        </p>
      </div>
    </Link>
  );
}

export function NotificationsScreen({
  notifications,
  loading = false,
  userId,
  interfaceMode = "advanced",
  lastSeenAt = new Date(0),
  onMarkAllAsRead,
}: NotificationsScreenProps) {
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useNotificationsTour({ userId, interfaceMode });

  // Marca todas as notificações como lidas ao abrir a tela
  useEffect(() => {
    onMarkAllAsRead?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pb-20">
      <PageHeader
        title="Notificações"
        description="Avisos enviados sobre tarefas e lembretes"
        backHref="/dashboard"
        backLabel="Voltar ao Dashboard"
        className="mb-6"
        dataTour="notifications-header"
        actions={
          <TourHelpButton
            onClick={beginTour}
            label="Abrir tour guiado das notificações"
          />
        }
      />

      <div data-tour="notifications-list">
        {loading ? (
          <p className="text-base text-muted-foreground" role="status">
            Carregando notificações...
          </p>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-light text-primary">
              <Bell className="size-6" aria-hidden />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">
              Nenhuma notificação ainda
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Quando uma tarefa ou lembrete estiver próximo do horário, o aviso
              aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isUnread={notification.sentAt.getTime() > lastSeenAt.getTime()}
              />
            ))}
          </div>
        )}
      </div>

      <TourOfferDialog
        open={showOfferDialog}
        title={offerTitle}
        description={offerDescription}
        onDismiss={dismissOffer}
        onStart={beginTour}
      />
    </div>
  );
}
