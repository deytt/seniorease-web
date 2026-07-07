import { HistoryEvent } from "../../entities/HistoryEvent";
import { IHistoryRepository } from "../../repositories/IHistoryRepository";

export interface GetStatsInput {
  userId: string;
  daysBack?: number;
}

export class GetStatsUseCase {
  constructor(private historyRepository: IHistoryRepository) {}

  async execute(input: GetStatsInput): Promise<{
    totalCompleted: number;
    streak: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    return this.historyRepository.getStats(input.userId, input.daysBack);
  }
}
