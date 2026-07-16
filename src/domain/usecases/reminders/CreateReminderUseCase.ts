import { Reminder } from "../../entities/Reminder";
import type { ReminderCategory } from "../../entities/ReminderCategory";
import { IReminderRepository } from "../../repositories/IReminderRepository";
import { HistoryActionType } from "../../history/HistoryActionType";
import type { IHistoryRecorder } from "../../history/IHistoryRecorder";
import { buildReminderCreatedTitle } from "../../history/historyTitles";

export interface CreateReminderInput {
  userId: string;
  taskId?: string;
  title: string;
  message: string;
  category: ReminderCategory;
  scheduledAt: Date;
}

export class CreateReminderUseCase {
  constructor(
    private reminderRepository: IReminderRepository,
    private historyRecorder: IHistoryRecorder,
  ) {}

  async execute(input: CreateReminderInput): Promise<Reminder> {
    const now = new Date();
    const reminder: Omit<Reminder, "id"> = {
      userId: input.userId,
      taskId: input.taskId,
      title: input.title.trim(),
      message: input.message.trim(),
      category: input.category,
      scheduledAt: input.scheduledAt,
      isRead: false,
      notified: false,
      createdAt: now,
    };

    const createdReminder = await this.reminderRepository.createReminder(reminder);

    await this.historyRecorder.record({
      userId: input.userId,
      type: HistoryActionType.reminderCreated,
      title: buildReminderCreatedTitle(input.title.trim()),
      entityId: createdReminder.id,
      category: input.category,
    });

    return createdReminder;
  }
}
