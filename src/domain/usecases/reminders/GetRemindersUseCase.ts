import { Reminder } from "../../entities/Reminder";
import { IReminderRepository } from "../../repositories/IReminderRepository";

export class GetRemindersUseCase {
  constructor(private reminderRepository: IReminderRepository) {}

  async execute(userId: string): Promise<Reminder[]> {
    return this.reminderRepository.getReminders(userId);
  }
}
