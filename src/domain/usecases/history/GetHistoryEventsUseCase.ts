import { HistoryEvent } from "../../entities/HistoryEvent";
import { IHistoryRepository } from "../../repositories/IHistoryRepository";

export class GetHistoryEventsUseCase {
  constructor(private historyRepository: IHistoryRepository) {}

  async execute(userId: string): Promise<HistoryEvent[]> {
    return this.historyRepository.getHistoryEvents(userId);
  }
}
