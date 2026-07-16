import { Reminder } from "../../entities/Reminder";
import type { ReminderCategory } from "../../entities/ReminderCategory";
import { IReminderRepository } from "../../repositories/IReminderRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildReminderEditedTitle } from "../../history/historyTitles";

export interface UpdateReminderInput {
  id: string;
  title: string;
  message: string;
  category: ReminderCategory;
  scheduledAt: Date;
  taskId?: string;
}

export class UpdateReminderUseCase {
  constructor(
    private reminderRepository: IReminderRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  async execute(input: UpdateReminderInput): Promise<Reminder> {
    const reminder = await this.reminderRepository.updateReminder(input.id, {
      title: input.title.trim(),
      message: input.message.trim(),
      category: input.category,
      scheduledAt: input.scheduledAt,
      ...(input.taskId !== undefined ? { taskId: input.taskId } : {}),
    });

    await this.historyRecorder.record({
      userId: reminder.userId,
      type: HistoryActionType.reminderEdited,
      title: buildReminderEditedTitle(reminder.title),
      entityId: reminder.id,
      category: reminder.category,
    });

    return reminder;
  }
}
