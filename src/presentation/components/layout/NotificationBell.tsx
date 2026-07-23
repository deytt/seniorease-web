"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  unreadCount: number;
  className?: string;
}

/**
 * Sininho de notificações — espelha o `_NotificationBell` do mobile (home_header.dart).
 *
 * - Badge vermelho com contagem de lembretes não lidos (máx "99+")
 * - Animação de balancejo por 5 s ao montar (igual ao mobile)
 * - Área clicável 44×44 px (WCAG AA)
 * - Navega para /notifications
 */
export function NotificationBell({ unreadCount, className }: NotificationBellProps) {
  const [isShaking, setIsShaking] = useState(true);
  const hasBadge = unreadCount > 0;

  // Para o balancejo após 5 segundos, exatamente como no mobile (_kBellDuration)
  useEffect(() => {
    const timer = setTimeout(() => setIsShaking(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const ariaLabel = hasBadge
    ? `Notificações — ${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
    : "Ver notificações";

  return (
    <>
      {/* Keyframe isolado no componente para não poluir globals.css */}
      <style>{`
        @keyframes senior-bell-shake {
          0%, 100% { transform: rotate(0deg); }
          20%  { transform: rotate(-14deg); }
          40%  { transform: rotate(14deg); }
          60%  { transform: rotate(-9deg); }
          80%  { transform: rotate(9deg); }
        }
        .senior-bell-shaking {
          transform-origin: top center;
          animation: senior-bell-shake 0.45s ease-in-out infinite;
        }
      `}</style>

      <Link
        href="/notifications"
        aria-label={ariaLabel}
        className={cn(
          "relative inline-flex h-11 w-11 flex-shrink-0 items-center justify-center",
          "rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary/20",
          className,
        )}
      >
        <Bell className={cn("size-5", isShaking && "senior-bell-shaking")} />

        {hasBadge && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-1.5 -top-1.5 flex items-center justify-center rounded-full",
              "min-h-6 min-w-6 px-1",
              "bg-destructive text-sm font-bold leading-none text-destructive-foreground",
              "ring-2 ring-background",
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>
    </>
  );
}
