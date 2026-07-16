import { Reminder } from "../../entities/Reminder";
import { IReminderRepository } from "../../repositories/IReminderRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildReminderCompletedTitle } from "../../history/historyTitles";

export class MarkReminderAsReadUseCase {
  constructor(
    private reminderRepository: IReminderRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  async execute(reminderId: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.markAsRead(reminderId);

    await this.historyRecorder.record({
      userId: reminder.userId,
      type: HistoryActionType.reminderCompleted,
      title: buildReminderCompletedTitle(reminder.title),
      entityId: reminder.id,
      category: reminder.category,
    });

    return reminder;
  }
}
