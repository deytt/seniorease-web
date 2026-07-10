import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/infrastructure/firebase/config";
import { HistoryEvent } from "@/domain/entities/HistoryEvent";
import { IHistoryRepository } from "@/domain/repositories/IHistoryRepository";

export class FirebaseHistoryRepository implements IHistoryRepository {
  private collectionName = "history";

  async getHistoryEvents(userId: string): Promise<HistoryEvent[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          }) as HistoryEvent,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getHistoryEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HistoryEvent[]> {
    // Query only by userId to avoid composite index requirement
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(q);
    const allEvents = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }) as HistoryEvent,
    );

    // Filter by date range in memory
    return allEvents
      .filter((e) => e.createdAt >= startDate && e.createdAt <= endDate)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createHistoryEvent(
    event: Omit<HistoryEvent, "id">,
  ): Promise<HistoryEvent> {
    // Firestore rejeita `undefined` — omitir campos opcionais vazios (ex.: taskId).
    const payload = Object.fromEntries(
      Object.entries({
        userId: event.userId,
        taskId: event.taskId,
        eventType: event.eventType,
        title: event.title,
        description: event.description,
        createdAt: Timestamp.fromDate(event.createdAt),
      }).filter(([, value]) => value !== undefined),
    );

    const docRef = await addDoc(collection(db, this.collectionName), payload);

    return {
      id: docRef.id,
      ...event,
    };
  }

  async getStats(
    userId: string,
    daysBack: number = 30,
  ): Promise<{
    totalCompleted: number;
    streak: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const events = await this.getHistoryEventsByDateRange(
      userId,
      startDate,
      now,
    );

    // Filter completed tasks
    const completedTasks = events.filter(
      (e) => e.eventType === "task_completed",
    );
    const totalCompleted = completedTasks.length;

    // Calculate this week (last 7 days)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = completedTasks.filter(
      (e) => e.createdAt >= weekAgo,
    ).length;

    // Calculate this month (last 30 days)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonth = completedTasks.filter(
      (e) => e.createdAt >= monthAgo,
    ).length;

    // Calculate streak (consecutive days with at least 1 completion)
    const streak = this.calculateStreak(completedTasks);

    return {
      totalCompleted,
      streak,
      thisWeek,
      thisMonth,
    };
  }

  private calculateStreak(events: HistoryEvent[]): number {
    if (events.length === 0) return 0;

    const dates = new Set<string>();
    events.forEach((e) => {
      const dateStr = e.createdAt.toISOString().split("T")[0];
      dates.add(dateStr);
    });

    const sortedDates = Array.from(dates).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];

    const currentDate = new Date(today);
    for (const dateStr of sortedDates) {
      const checkDate = new Date(dateStr).toISOString().split("T")[0];
      const expectedDate = currentDate.toISOString().split("T")[0];

      if (checkDate === expectedDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
