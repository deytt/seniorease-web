"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { useNotificationHistory } from "@/presentation/hooks/useNotificationHistory";

interface NotificationBellProps {
  userId: string;
  className?: string;
}

export function NotificationBell({ userId, className }: NotificationBellProps) {
  const { unreadCount } = useNotificationHistory(userId);
  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <Link
      href="/notifications"
      aria-label={
        unreadCount > 0
          ? `Notificações: ${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
          : "Notificações"
      }
      className={cn(
        "a11y-touch-target relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-[14px] border border-border bg-card text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <Bell className="size-5" aria-hidden />
      {badgeLabel ? (
        <span className="absolute -right-1 -top-1 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-destructive px-1 text-sm font-bold leading-none text-destructive-foreground">
          {badgeLabel}
        </span>
      ) : null}
    </Link>
  );
}
