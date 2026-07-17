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
  const { todayCount } = useNotificationHistory(userId);
  const badgeLabel =
    todayCount > 99 ? "99+" : todayCount > 0 ? String(todayCount) : null;

  return (
    <Link
      href="/notifications"
      aria-label={
        todayCount > 0
          ? `Notificações: ${todayCount} recebidas hoje`
          : "Notificações"
      }
      className={cn(
        "relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-[14px] border border-border bg-card text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <Bell className="size-5" aria-hidden />
      {badgeLabel ? (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[11px] font-bold leading-none text-white">
          {badgeLabel}
        </span>
      ) : null}
    </Link>
  );
}
