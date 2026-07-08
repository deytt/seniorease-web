import { Reminder } from "../../entities/Reminder";
import { IReminderRepository } from "../../repositories/IReminderRepository";
import { IHistoryRepository } from "../../repositories/IHistoryRepository";

export class MarkReminderAsReadUseCase {
  constructor(
    private reminderRepository: IReminderRepository,
    private historyRepository: IHistoryRepository,
  ) {}

  async execute(reminderId: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.markAsRead(reminderId);

    // Create history event
    await this.historyRepository.createHistoryEvent({
      userId: reminder.userId,
      taskId: reminder.taskId,
      eventType: "reminder_marked",
      title: reminder.title,
      description: `Lembrete marcado como lido: ${reminder.title}`,
      createdAt: new Date(),
    });

    return reminder;
  }
}
