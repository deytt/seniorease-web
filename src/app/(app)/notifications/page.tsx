"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, BellOff, CheckCircle2, Bell } from "lucide-react";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getNotificationsDi } from "@/lib/di/notificationsDi";
import { useNotificationItems } from "@/presentation/hooks/useNotificationItems";
import type { NotificationItem, NotificationEntityType } from "@/domain/entities/NotificationItem";
import { cn } from "@/lib/utils";

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Formata a data de envio — espelha `_formattedDate` do mobile (notification_item_card.dart).
 */
function formatSentAt(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isToday) return `Hoje às ${time}`;
  if (isYesterday) return `Ontem às ${time}`;
  return `${date.toLocaleDateString("pt-BR")} às ${time}`;
}

// ─── page ─────────────────────────────────────────────────────────────────────

/**
 * Página de histórico de notificações.
 *
 * Lê a coleção `notifications/{id}` gravada pela Cloud Function
 * `sendDueNotifications` após cada push enviado — exatamente como a
 * `NotificationsScreen` do mobile (`notification_history_provider.dart`).
 *
 * O web não recebe push (FCM), mas o registro em Firestore existe.
 * Ao clicar num card, navega para a tarefa ou lista de lembretes,
 * espelhando `_navigate` do mobile.
 */
export default function NotificationsPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { notificationRepository } = getNotificationsDi();
  const { items, loading, fetchNotifications } =
    useNotificationItems(notificationRepository);

  useEffect(() => {
    if (user?.id) fetchNotifications(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCardClick = (item: NotificationItem) => {
    // Espelha `_navigate` do mobile:
    // task   → taskDetails(entityId)
    // reminder → go(reminders)
    if (item.entityType === "task") {
      router.push(`/tasks/${item.entityId}`);
    } else {
      router.push("/reminders");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          aria-label="Voltar"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted/50"
        >
          <ChevronLeft className="size-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Notificações</h1>
          <p className="text-sm text-muted-foreground">
            Avisos das suas tarefas e lembretes
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : items.length === 0 ? (
        <_EmptyState />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <_NotificationCard
              key={item.id}
              item={item}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── sub-components ───────────────────────────────────────────────────────────

function _EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <BellOff className="size-16 text-primary/30" aria-hidden="true" />
      <h2 className="text-xl font-semibold text-foreground">
        Sem avisos por agora
      </h2>
      <p className="max-w-xs text-sm text-muted-foreground">
        Os avisos das suas tarefas e lembretes aparecerão aqui quando forem
        enviados.
      </p>
    </div>
  );
}

interface NotificationCardProps {
  item: NotificationItem;
  onClick: () => void;
}

/**
 * Card de notificação — espelha `NotificationItemCard` do mobile.
 *
 * Ícone diferenciado por `entityType`, espelhando `_EntityIcon`:
 * - task     → CheckCircle2  (primary)
 * - reminder → Bell          (secondary)
 */
function _NotificationCard({ item, onClick }: NotificationCardProps) {
  const dateLabel = formatSentAt(item.sentAt);

  return (
    <button
      onClick={onClick}
      aria-label={`${item.title}. ${item.body}. ${dateLabel}`}
      className="group w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/30"
    >
      <div className="flex items-start gap-3">
        {/* Ícone por entityType — 44×44 px (WCAG AA touch target) */}
        <_EntityIcon entityType={item.entityType} />

        {/* Textos — espelha coluna central do NotificationItemCard */}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-sm font-bold text-foreground">
            {item.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {item.body}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground/70">{dateLabel}</p>
        </div>

        {/* Chevron */}
        <ChevronRight
          aria-hidden="true"
          className="mt-0.5 size-5 flex-shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </button>
  );
}

/**
 * Ícone 44×44 px por tipo de entidade.
 * Espelha `_EntityIcon` do mobile (notification_item_card.dart).
 */
function _EntityIcon({ entityType }: { entityType: NotificationEntityType }) {
  const isTask = entityType === "task";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl",
        isTask ? "bg-primary-light" : "bg-secondary-light",
      )}
    >
      {isTask ? (
        <CheckCircle2 className="size-5 text-primary" />
      ) : (
        <Bell className="size-5 text-secondary" />
      )}
    </div>
  );
}
