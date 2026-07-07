import { HistoryEvent } from "../entities/HistoryEvent";

export interface IHistoryRepository {
  getHistoryEvents(userId: string): Promise<HistoryEvent[]>;
  getHistoryEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HistoryEvent[]>;
  createHistoryEvent(event: Omit<HistoryEvent, "id">): Promise<HistoryEvent>;
  getStats(
    userId: string,
    daysBack?: number,
  ): Promise<{
    totalCompleted: number;
    streak: number;
    thisWeek: number;
    thisMonth: number;
  }>;
}
