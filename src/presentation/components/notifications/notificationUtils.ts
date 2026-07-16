import type { NotificationEntityType } from "@/domain/entities/NotificationItem";

export function getNotificationEntityHref(
  entityType: NotificationEntityType,
  entityId: string,
): string {
  if (entityType === "task" && entityId) {
    return `/tasks/${entityId}`;
  }

  return "/reminders";
}

export function formatNotificationTime(sentAt: Date): string {
  const now = new Date();
  const isToday =
    sentAt.getFullYear() === now.getFullYear() &&
    sentAt.getMonth() === now.getMonth() &&
    sentAt.getDate() === now.getDate();

  if (isToday) {
    return sentAt.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return sentAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getNotificationEntityLabel(
  entityType: NotificationEntityType,
): string {
  return entityType === "task" ? "Tarefa" : "Lembrete";
}
