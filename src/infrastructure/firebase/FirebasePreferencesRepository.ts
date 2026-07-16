import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/infrastructure/firebase/config";
import type { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import type {
  NotificationOffset,
  UserPreferences,
} from "@/domain/entities/UserPreferences";

/** Nome da collection — ver firebaseSchema.md (`preferences/{userId}`). */
const COLLECTION = "preferences";
const NOTIFICATION_OFFSETS: NotificationOffset[] = [
  "15m",
  "30m",
  "1h",
  "6h",
  "1d",
];

function parseNotificationOffset(value: unknown): NotificationOffset {
  return typeof value === "string" &&
    (NOTIFICATION_OFFSETS as string[]).includes(value)
    ? (value as NotificationOffset)
    : "30m";
}

export class FirebasePreferencesRepository implements IPreferencesRepository {
  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const snapshot = await getDoc(doc(db, COLLECTION, userId));

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    const remindersNotificationsEnabled =
      data.remindersNotificationsEnabled ?? data.remindersEnabled ?? true;

    return {
      userId,
      fontSize: data.fontSize ?? "medium",
      darkMode: data.darkMode ?? false,
      contrast: data.contrast ?? "default",
      spacing: data.spacing ?? "comfortable",
      interfaceMode: data.interfaceMode ?? "advanced",
      audioFeedbackEnabled: data.audioFeedbackEnabled ?? false,
      largeTouchTargets: data.largeTouchTargets ?? false,
      tasksNotificationsEnabled: data.tasksNotificationsEnabled ?? true,
      taskNotificationOffset: parseNotificationOffset(
        data.taskNotificationOffset,
      ),
      remindersNotificationsEnabled,
      reminderNotificationOffset: parseNotificationOffset(
        data.reminderNotificationOffset,
      ),
      remindersEnabled: remindersNotificationsEnabled,
      notificationTime: data.notificationTime ?? null,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : null,
    };
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    // Document ID == userId (relação 1:1 com users) — firebaseSchema.md
    await setDoc(
      doc(db, COLLECTION, preferences.userId),
      {
        userId: preferences.userId,
        fontSize: preferences.fontSize,
        darkMode: preferences.darkMode,
        contrast: preferences.contrast,
        spacing: preferences.spacing,
        interfaceMode: preferences.interfaceMode,
        audioFeedbackEnabled: preferences.audioFeedbackEnabled,
        largeTouchTargets: preferences.largeTouchTargets,
        tasksNotificationsEnabled: preferences.tasksNotificationsEnabled,
        taskNotificationOffset: preferences.taskNotificationOffset,
        remindersNotificationsEnabled: preferences.remindersNotificationsEnabled,
        reminderNotificationOffset: preferences.reminderNotificationOffset,
        remindersEnabled: preferences.remindersNotificationsEnabled,
        notificationTime: preferences.notificationTime,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}
