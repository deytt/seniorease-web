import { HistoryEvent } from "../../entities/HistoryEvent";
import { IHistoryRepository } from "../../repositories/IHistoryRepository";

export interface CreateHistoryEventInput {
  userId: string;
  taskId?: string;
  eventType:
    | "task_completed"
    | "task_created"
    | "reminder_marked"
    | "preference_updated";
  title: string;
  description: string;
}

export class CreateHistoryEventUseCase {
  constructor(private historyRepository: IHistoryRepository) {}

  async execute(input: CreateHistoryEventInput): Promise<HistoryEvent> {
    return this.historyRepository.createHistoryEvent({
      userId: input.userId,
      taskId: input.taskId,
      eventType: input.eventType,
      title: input.title,
      description: input.description,
      createdAt: new Date(),
    });
  }
}
