import type { IHistoryRepository } from "../../repositories/IHistoryRepository";

export class GetStatsUseCase {
  constructor(private historyRepository: IHistoryRepository) {}

  async execute(input: { userId: string }) {
    return this.historyRepository.getStats(input.userId);
  }
}
