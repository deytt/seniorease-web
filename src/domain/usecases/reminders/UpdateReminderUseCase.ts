import { Reminder } from "../../entities/Reminder";
import type { ReminderCategory } from "../../entities/ReminderCategory";
import { IReminderRepository } from "../../repositories/IReminderRepository";

export interface UpdateReminderInput {
  id: string;
  title: string;
  message: string;
  category: ReminderCategory;
  scheduledAt: Date;
  taskId?: string;
}

export class UpdateReminderUseCase {
  constructor(private reminderRepository: IReminderRepository) {}

  async execute(input: UpdateReminderInput): Promise<Reminder> {
    return this.reminderRepository.updateReminder(input.id, {
      title: input.title.trim(),
      message: input.message.trim(),
      category: input.category,
      scheduledAt: input.scheduledAt,
      ...(input.taskId !== undefined ? { taskId: input.taskId } : {}),
    });
  }
}
