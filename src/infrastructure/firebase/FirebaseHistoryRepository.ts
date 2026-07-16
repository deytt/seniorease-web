import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import {
  computeHistoryStats,
  type HistoryStats,
} from "@/domain/history/computeHistoryStats";
import { normalizeHistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRepository } from "@/domain/repositories/IHistoryRepository";
import { db } from "@/infrastructure/firebase/config";

type FirestoreHistoryDoc = Record<string, unknown>;

function parseTimestamp(value: unknown): Date {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }

  return new Date();
}

function normalizeHistoryEvent(
  id: string,
  data: FirestoreHistoryDoc,
): HistoryEvent {
  const legacyType = data.type ?? data.eventType;
  const legacyDate = data.occurredAt ?? data.createdAt;
  const legacyEntityId = data.entityId ?? data.taskId;

  return {
    id,
    userId: String(data.userId ?? ""),
    type: normalizeHistoryActionType(String(legacyType ?? "taskCompleted")),
    title: String(data.title ?? ""),
    entityId:
      legacyEntityId === undefined || legacyEntityId === null
        ? null
        : String(legacyEntityId),
    category:
      data.category === undefined || data.category === null
        ? null
        : String(data.category),
    occurredAt: parseTimestamp(legacyDate),
  };
}

export class FirebaseHistoryRepository implements IHistoryRepository {
  private collectionName = "history";

  async getHistoryEvents(userId: string): Promise<HistoryEvent[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((doc) => normalizeHistoryEvent(doc.id, doc.data()))
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
  }

  async getHistoryEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HistoryEvent[]> {
    const events = await this.getHistoryEvents(userId);
    return events.filter(
      (event) => event.occurredAt >= startDate && event.occurredAt <= endDate,
    );
  }

  async logEvent(event: Omit<HistoryEvent, "id">): Promise<HistoryEvent> {
    const payload = Object.fromEntries(
      Object.entries({
        userId: event.userId,
        type: event.type,
        title: event.title,
        entityId: event.entityId ?? null,
        category: event.category ?? null,
        occurredAt: Timestamp.fromDate(event.occurredAt),
      }).filter(([, value]) => value !== undefined),
    );

    const docRef = await addDoc(collection(db, this.collectionName), payload);

    return {
      id: docRef.id,
      ...event,
    };
  }

  async getStats(userId: string): Promise<HistoryStats> {
    const events = await this.getHistoryEvents(userId);
    return computeHistoryStats(events);
  }
}
