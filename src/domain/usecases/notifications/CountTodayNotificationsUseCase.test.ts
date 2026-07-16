import { describe, expect, it } from "vitest";

import type { NotificationItem } from "@/domain/entities/NotificationItem";
import { countTodayNotifications } from "@/domain/usecases/notifications/CountTodayNotificationsUseCase";

function buildNotification(
  overrides: Partial<NotificationItem> & Pick<NotificationItem, "id">,
): NotificationItem {
  return {
    userId: "user-1",
    entityId: "entity-1",
    entityType: "task",
    title: "Tarefa em 30 minutos",
    body: "Tomar medicamento",
    sentAt: new Date("2026-07-16T10:00:00"),
    successCount: 1,
    failureCount: 0,
    ...overrides,
  };
}

describe("countTodayNotifications", () => {
  it("conta apenas notificações enviadas hoje", () => {
    const now = new Date("2026-07-16T15:00:00");
    const notifications = [
      buildNotification({
        id: "1",
        sentAt: new Date("2026-07-16T09:00:00"),
      }),
      buildNotification({
        id: "2",
        sentAt: new Date("2026-07-15T22:00:00"),
      }),
    ];

    expect(countTodayNotifications(notifications, now)).toBe(1);
  });
});
