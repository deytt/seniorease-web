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

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  loading?: boolean;
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
      className="flex items-start gap-4 rounded-[14px] border border-[#e2e8f0] bg-white p-4 transition-colors hover:bg-[#f8fafc]"
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[12px]",
          notification.entityType === "task"
            ? "bg-[rgba(37,99,235,0.13)] text-[#2563eb]"
            : "bg-[rgba(245,158,11,0.13)] text-[#f59e0b]",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[#0f172a]">
            {notification.title}
          </p>
          <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
            {getNotificationEntityLabel(notification.entityType)}
          </span>
        </div>
        <p className="mt-1 text-sm text-[#64748b]">{notification.body}</p>
        <p className="mt-2 text-xs font-medium text-[#94a3b8]">
          {formatNotificationTime(notification.sentAt)}
        </p>
      </div>
    </Link>
  );
}

export function NotificationsScreen({
  notifications,
  loading = false,
}: NotificationsScreenProps) {
  return (
    <div className="pb-20">
      <header className="mb-6 flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          className="min-h-11 min-w-11 rounded-[14px] px-0"
        >
          <Link href="/dashboard" aria-label="Voltar ao painel">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-[30px] font-bold leading-9 text-[#0f172a]">
            Notificações
          </h1>
          <p className="mt-1 text-base text-[#64748b]">
            Avisos enviados sobre tarefas e lembretes
          </p>
        </div>
      </header>

      {loading ? (
        <p className="text-base text-[#64748b]" role="status">
          Carregando notificações...
        </p>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
            <Bell className="size-6" aria-hidden />
          </div>
          <p className="mt-4 text-base font-semibold text-[#0f172a]">
            Nenhuma notificação ainda
          </p>
          <p className="mt-2 text-sm text-[#64748b]">
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
  );
}
