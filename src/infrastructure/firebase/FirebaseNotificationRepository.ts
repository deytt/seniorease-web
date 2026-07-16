import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  deleteDoc,
  where,
} from "firebase/firestore";

import type { NotificationItem } from "@/domain/entities/NotificationItem";
import type { IFcmTokenRepository } from "@/domain/repositories/IFcmTokenRepository";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { db } from "@/infrastructure/firebase/config";

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

function normalizeNotificationItem(
  id: string,
  data: Record<string, unknown>,
): NotificationItem {
  const entityType = data.entityType === "reminder" ? "reminder" : "task";

  return {
    id,
    userId: String(data.userId ?? ""),
    entityId: String(data.entityId ?? ""),
    entityType,
    title: String(data.title ?? ""),
    body: String(data.body ?? ""),
    sentAt: parseTimestamp(data.sentAt),
    successCount: Number(data.successCount ?? 0),
    failureCount: Number(data.failureCount ?? 0),
  };
}

export class FirebaseNotificationRepository implements INotificationRepository {
  private collectionName = "notifications";

  async getNotifications(
    userId: string,
    maxItems = 50,
  ): Promise<NotificationItem[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
      orderBy("sentAt", "desc"),
      limit(maxItems),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) =>
      normalizeNotificationItem(docSnap.id, docSnap.data()),
    );
  }

  subscribeToNotifications(
    userId: string,
    callback: (items: NotificationItem[]) => void,
    maxItems = 50,
  ): () => void {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
      orderBy("sentAt", "desc"),
      limit(maxItems),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        callback(
          snapshot.docs.map((docSnap) =>
            normalizeNotificationItem(docSnap.id, docSnap.data()),
          ),
        );
      },
      (error) => {
        console.error("Erro ao escutar notificações:", error);
        callback([]);
      },
    );
  }
}

export class FirebaseFcmTokenRepository implements IFcmTokenRepository {
  async saveToken(userId: string, token: string): Promise<void> {
    await setDoc(
      doc(db, "users", userId, "fcmTokens", token),
      {
        token,
        platform: "web",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  async removeToken(userId: string, token: string): Promise<void> {
    await deleteDoc(doc(db, "users", userId, "fcmTokens", token));
  }
}
