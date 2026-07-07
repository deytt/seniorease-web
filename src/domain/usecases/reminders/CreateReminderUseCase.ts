import { Reminder } from "../../entities/Reminder";
import { IReminderRepository } from "../../repositories/IReminderRepository";

export interface CreateReminderInput {
  userId: string;
  taskId?: string;
  title: string;
  message: string;
  scheduledAt: Date;
}

export class CreateReminderUseCase {
  constructor(private reminderRepository: IReminderRepository) {}

  async execute(input: CreateReminderInput): Promise<Reminder> {
    const reminder: Omit<Reminder, "id"> = {
      userId: input.userId,
      taskId: input.taskId,
      title: input.title,
      message: input.message,
      scheduledAt: input.scheduledAt,
      isRead: false,
    };

    return this.reminderRepository.createReminder(reminder);
  }
}
