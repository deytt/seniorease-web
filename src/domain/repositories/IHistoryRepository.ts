import type { HistoryEvent } from "../entities/HistoryEvent";
import type { HistoryStats } from "../history/computeHistoryStats";

export interface IHistoryRepository {
  getHistoryEvents(userId: string): Promise<HistoryEvent[]>;
  getHistoryEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HistoryEvent[]>;
  logEvent(event: Omit<HistoryEvent, "id">): Promise<HistoryEvent>;
  getStats(userId: string): Promise<HistoryStats>;
}
