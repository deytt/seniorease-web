import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

import { db } from "@/infrastructure/firebase/config";
import type { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import type { UserPreferences } from "@/domain/entities/UserPreferences";

/** Nome da collection — ver firebaseSchema.md (`preferences/{userId}`). */
const COLLECTION = "preferences";

export class FirebasePreferencesRepository implements IPreferencesRepository {
  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const snapshot = await getDoc(doc(db, COLLECTION, userId));

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      userId,
      fontSize: data.fontSize ?? "medium",
      darkMode: data.darkMode ?? false,
      contrast: data.contrast ?? "default",
      spacing: data.spacing ?? "comfortable",
      interfaceMode: data.interfaceMode ?? "advanced",
      audioFeedbackEnabled: data.audioFeedbackEnabled ?? false,
      largeTouchTargets: data.largeTouchTargets ?? false,
      remindersEnabled: data.remindersEnabled ?? true,
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
        remindersEnabled: preferences.remindersEnabled,
        notificationTime: preferences.notificationTime,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}
