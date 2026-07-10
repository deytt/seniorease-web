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

    await this.historyRepository.createHistoryEvent({
      userId: reminder.userId,
      ...(reminder.taskId ? { taskId: reminder.taskId } : {}),
      eventType: "reminder_marked",
      title: reminder.title,
      description: `Lembrete marcado como concluído: ${reminder.title}`,
      createdAt: new Date(),
    });

    return reminder;
  }
}
