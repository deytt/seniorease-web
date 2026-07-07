export interface Reminder {
  id: string;
  userId: string;
  taskId?: string;
  title: string;
  message: string;
  scheduledAt: Date;
  isRead: boolean;
}
