import { Reminder } from "@/domain/entities/Reminder";
import { IReminderRepository } from "@/domain/repositories/IReminderRepository";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export class FirebaseReminderRepository implements IReminderRepository {
  private collectionName = "reminders";

  async getReminders(userId: string): Promise<Reminder[]> {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapDocumentToReminder(doc));
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
    // Filter out undefined fields to prevent Firebase errors
    const reminderData = Object.fromEntries(
      Object.entries({
        ...reminder,
        scheduledAt: new Date(reminder.scheduledAt),
      }).filter(([, value]) => value !== undefined),
    );

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
    await updateDoc(docRef, { ...reminder });

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

  private mapDocumentToReminder(doc: any): Reminder {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      taskId: data.taskId,
      title: data.title,
      message: data.message,
      scheduledAt: data.scheduledAt?.toDate() || new Date(),
      isRead: data.isRead || false,
    };
  }
}
