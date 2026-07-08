import { Reminder } from "../entities/Reminder";

export interface IReminderRepository {
  getReminders(userId: string): Promise<Reminder[]>;
  getReminderById(reminderId: string): Promise<Reminder | null>;
  createReminder(reminder: Omit<Reminder, "id">): Promise<Reminder>;
  updateReminder(
    reminderId: string,
    reminder: Partial<Reminder>,
  ): Promise<Reminder>;
  deleteReminder(reminderId: string): Promise<void>;
  markAsRead(reminderId: string): Promise<Reminder>;
}
