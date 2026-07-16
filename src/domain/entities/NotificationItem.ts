export type NotificationEntityType = "task" | "reminder";

export interface NotificationItem {
  id: string;
  userId: string;
  entityId: string;
  entityType: NotificationEntityType;
  title: string;
  body: string;
  sentAt: Date;
  successCount: number;
  failureCount: number;
}
