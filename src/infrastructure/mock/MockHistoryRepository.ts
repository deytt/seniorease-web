import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import type { IHistoryRepository } from "@/domain/repositories/IHistoryRepository";

const MOCK_HISTORY_STORAGE_KEY = "mock_history_events";

/**
 * Mock do repositório de histórico para desenvolvimento local.
 * Persiste dados em localStorage para manter entre recarregamentos.
 */
export class MockHistoryRepository implements IHistoryRepository {
  private loadEvents(): HistoryEvent[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(MOCK_HISTORY_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as HistoryEvent[];
      return parsed.map((e) => ({
        ...e,
        createdAt: new Date(e.createdAt),
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
    return this.loadEvents().filter((e) => e.userId === userId);
  }

  async getHistoryEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HistoryEvent[]> {
    return this.loadEvents().filter((e) => {
      if (e.userId !== userId) return false;
      const date = new Date(e.createdAt);
      return date >= startDate && date <= endDate;
    });
  }

  async createHistoryEvent(
    event: Omit<HistoryEvent, "id">,
  ): Promise<HistoryEvent> {
    const events = this.loadEvents();
    const newEvent: HistoryEvent = {
      ...event,
      id:
        "mock-history-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2),
    };
    this.saveEvents([...events, newEvent]);
    return newEvent;
  }

  async getStats(
    userId: string,
    daysBack = 30,
  ): Promise<{
    totalCompleted: number;
    streak: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    void daysBack;
    const events = await this.getHistoryEvents(userId);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const completed = events.filter((e) => e.eventType === "task_completed");

    return {
      totalCompleted: completed.length,
      streak: 0,
      thisWeek: completed.filter((e) => new Date(e.createdAt) >= startOfWeek)
        .length,
      thisMonth: completed.filter((e) => new Date(e.createdAt) >= startOfMonth)
        .length,
    };
  }
}
