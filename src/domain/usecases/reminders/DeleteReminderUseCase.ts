import { IReminderRepository } from "../../repositories/IReminderRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildReminderDeletedTitle } from "../../history/historyTitles";

export class DeleteReminderUseCase {
  constructor(
    private reminderRepository: IReminderRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  async execute(reminderId: string): Promise<void> {
    const reminder = await this.reminderRepository.getReminderById(reminderId);
    await this.reminderRepository.deleteReminder(reminderId);

    if (reminder) {
      await this.historyRecorder.record({
        userId: reminder.userId,
        type: HistoryActionType.reminderDeleted,
        title: buildReminderDeletedTitle(reminder.title),
        entityId: reminder.id,
        category: reminder.category,
      });
    }
  }
}
