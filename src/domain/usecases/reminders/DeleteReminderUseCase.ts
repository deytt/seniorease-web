import { IReminderRepository } from "../../repositories/IReminderRepository";

export class DeleteReminderUseCase {
  constructor(private reminderRepository: IReminderRepository) {}

  async execute(reminderId: string): Promise<void> {
    return this.reminderRepository.deleteReminder(reminderId);
  }
}
