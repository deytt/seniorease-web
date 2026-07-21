import { Reminder } from "@/domain/entities/Reminder";
import { parseReminderCategory } from "@/domain/entities/ReminderCategory";
import { IReminderRepository } from "@/domain/repositories/IReminderRepository";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";

export class FirebaseReminderRepository implements IReminderRepository {
  private collectionName = "reminders";

  async getReminders(userId: string): Promise<Reminder[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
      orderBy("scheduledAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((document) => this.mapDocumentToReminder(document));
  }

  async getReminderById(reminderId: string): Promise<Reminder | null> {
    const docRef = doc(db, this.collectionName, reminderId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return this.mapDocumentToReminder(snapshot);
  }

  async createReminder(reminder: Omit<Reminder, "id">): Promise<Reminder> {
    const reminderData = {
      userId: reminder.userId,
      ...(reminder.taskId !== undefined ? { taskId: reminder.taskId } : {}),
      title: reminder.title,
      message: reminder.message,
      category: reminder.category,
      scheduledAt: Timestamp.fromDate(new Date(reminder.scheduledAt)),
      isRead: reminder.isRead,
      notified: reminder.notified,
      createdAt: Timestamp.fromDate(new Date(reminder.createdAt)),
    };

    const docRef = await addDoc(
      collection(db, this.collectionName),
      reminderData,
    );

    return {
      ...reminder,
      id: docRef.id,
    };
  }

  async updateReminder(
    reminderId: string,
    reminder: Partial<Reminder>,
  ): Promise<Reminder> {
    const docRef = doc(db, this.collectionName, reminderId);
    const payload: Record<string, unknown> = {};

    if (reminder.title !== undefined) payload.title = reminder.title;
    if (reminder.message !== undefined) payload.message = reminder.message;
    if (reminder.category !== undefined) payload.category = reminder.category;
    if (reminder.taskId !== undefined) payload.taskId = reminder.taskId;
    if (reminder.isRead !== undefined) payload.isRead = reminder.isRead;
    if (reminder.notified !== undefined) payload.notified = reminder.notified;
    if (reminder.scheduledAt !== undefined) {
      payload.scheduledAt = Timestamp.fromDate(new Date(reminder.scheduledAt));
      // ADR-020: ao alterar a data, a Cloud Function deve poder reenviar o push
      payload.notified = false;
    }

    await updateDoc(docRef, payload);

    const updated = await getDoc(docRef);
    return this.mapDocumentToReminder(updated);
  }

  async deleteReminder(reminderId: string): Promise<void> {
    const docRef = doc(db, this.collectionName, reminderId);
    await deleteDoc(docRef);
  }

  async markAsRead(reminderId: string): Promise<Reminder> {
    const docRef = doc(db, this.collectionName, reminderId);
    await updateDoc(docRef, { isRead: true });

    const updated = await getDoc(docRef);
    return this.mapDocumentToReminder(updated);
  }

  private mapDocumentToReminder(document: DocumentSnapshot): Reminder {
    const data = document.data() ?? {};
    return {
      id: document.id,
      userId: (data["userId"] as string) ?? "",
      taskId: data["taskId"] as string | undefined,
      title: (data["title"] as string) ?? "",
      message: (data["message"] as string) ?? "",
      category: parseReminderCategory(data["category"]),
      scheduledAt: data["scheduledAt"]?.toDate?.() ?? new Date(),
      isRead: (data["isRead"] as boolean) || false,
      notified: (data["notified"] as boolean) || false,
      createdAt: data["createdAt"]?.toDate?.() ?? new Date(),
    };
  }
}
