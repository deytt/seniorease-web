import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  Timestamp,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";
import type { NotificationItem, NotificationEntityType } from "@/domain/entities/NotificationItem";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";

/**
 * Implementação Firebase de `INotificationRepository`.
 *
 * Lê a coleção `notifications` onde `userId == uid`,
 * ordenada por `sentAt` decrescente, com limite configurável.
 *
 * Espelha `FirebaseNotificationHistoryRepository` do mobile.
 * A escrita é exclusiva da Cloud Function `sendDueNotifications` —
 * o cliente web é somente-leitura.
 */
export class FirebaseNotificationRepository implements INotificationRepository {
  private readonly collectionName = "notifications";

  async getNotifications(
    userId: string,
    limit = 50,
  ): Promise<NotificationItem[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
      orderBy("sentAt", "desc"),
      firestoreLimit(limit),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapDoc(doc));
  }

  private mapDoc(
    doc: QueryDocumentSnapshot,
  ): NotificationItem {
    const data = doc.data();
    const sentAtRaw = data["sentAt"];

    const sentAt: Date =
      sentAtRaw instanceof Timestamp
        ? sentAtRaw.toDate()
        : new Date();

    const rawType = data["entityType"] as string | undefined;
    const entityType: NotificationEntityType =
      rawType === "reminder" ? "reminder" : "task";

    return {
      id: doc.id,
      userId: (data["userId"] as string) ?? "",
      entityId: (data["entityId"] as string) ?? "",
      entityType,
      title: (data["title"] as string) ?? "",
      body: (data["body"] as string) ?? "",
      sentAt,
    };
  }
}
