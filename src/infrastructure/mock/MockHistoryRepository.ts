import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import { computeHistoryStats } from "@/domain/history/computeHistoryStats";
import type { IHistoryRepository } from "@/domain/repositories/IHistoryRepository";

const MOCK_HISTORY_STORAGE_KEY = "mock_history_events";

/**
 * Mock do repositório de histórico para desenvolvimento local.
 */
export class MockHistoryRepository implements IHistoryRepository {
  private loadEvents(): HistoryEvent[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(MOCK_HISTORY_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as HistoryEvent[];
      return parsed.map((event) => ({
        ...event,
        occurredAt: new Date(event.occurredAt),
      }));
    } catch {
      return [];
    }
  }

  private saveEvents(events: HistoryEvent[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(MOCK_HISTORY_STORAGE_KEY, JSON.stringify(events));
    }
  }

  async getHistoryEvents(userId: string): Promise<HistoryEvent[]> {
    return this.loadEvents().filter((event) => event.userId === userId);
  }

  async getHistoryEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HistoryEvent[]> {
    return this.loadEvents().filter((event) => {
      if (event.userId !== userId) return false;
      return event.occurredAt >= startDate && event.occurredAt <= endDate;
    });
  }

  async logEvent(event: Omit<HistoryEvent, "id">): Promise<HistoryEvent> {
    const events = this.loadEvents();
    const newEvent: HistoryEvent = {
      ...event,
      id: `mock-history-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    this.saveEvents([...events, newEvent]);
    return newEvent;
  }

  async getStats(userId: string) {
    const events = await this.getHistoryEvents(userId);
    return computeHistoryStats(events);
  }
}
