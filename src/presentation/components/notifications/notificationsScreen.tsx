"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CheckSquare2 } from "lucide-react";

import type { NotificationItem } from "@/domain/entities/NotificationItem";
import { cn } from "@/lib/utils";
import { Button } from "@/presentation/components/ui/button";
import {
  formatNotificationTime,
  getNotificationEntityHref,
  getNotificationEntityLabel,
} from "@/presentation/components/notifications/notificationUtils";
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
}

function NotificationCard({ notification }: { notification: NotificationItem }) {
  const href = getNotificationEntityHref(
    notification.entityType,
    notification.entityId,
  );
  const Icon = notification.entityType === "task" ? CheckSquare2 : Bell;

  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-[14px] border border-border bg-card p-4 transition-colors hover:bg-muted"
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
          <p className="text-sm font-semibold text-foreground">
            {notification.title}
          </p>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
            {getNotificationEntityLabel(notification.entityType)}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
        <p className="mt-2 text-xs font-medium text-muted-foreground">
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
}: NotificationsScreenProps) {
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useNotificationsTour({ userId, interfaceMode });

  return (
    <div className="pb-20">
      <header
        className="mb-6 flex items-center gap-4"
        data-tour="notifications-header"
      >
        <Button
          asChild
          variant="ghost"
          className="min-h-11 min-w-11 rounded-[14px] px-0"
        >
          <Link href="/dashboard" aria-label="Voltar ao painel">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-[30px] font-bold leading-9 text-foreground">
            Notificações
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Avisos enviados sobre tarefas e lembretes
          </p>
        </div>
        <TourHelpButton
          onClick={beginTour}
          label="Abrir tour guiado das notificações"
        />
      </header>

      <div data-tour="notifications-list">
        {loading ? (
          <p className="text-base text-muted-foreground" role="status">
            Carregando notificações...
          </p>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
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
              <NotificationCard key={notification.id} notification={notification} />
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
