import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "./fcmConfig";

let activeFcmToken: string | null = null;

export function getActiveFcmToken(): string | null {
  return activeFcmToken;
}

export function clearActiveFcmToken(): void {
  activeFcmToken = null;
}

/**
 * Request permission and get FCM token for the user.
 * Persists the token in memory so it can be removed on sign-out.
 */
export async function requestFCMToken(): Promise<string | null> {
  try {
    const msg = await messaging;
    if (!msg) {
      console.log("FCM not supported in this browser");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(msg, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      activeFcmToken = token;
    }

    return token;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("push service not available")) {
        console.info(
          "FCM push service not available (expected in development without HTTPS)",
        );
      } else {
        console.warn("Error getting FCM token:", error.message);
      }
    }
    return null;
  }
}

/**
 * Handle incoming messages while the app is in the foreground.
 */
export async function setupMessageListener(
  callback: (payload: MessagePayload) => void,
): Promise<void> {
  try {
    const msg = await messaging;
    if (!msg) return;

    onMessage(msg, (payload) => {
      callback(payload);

      if (payload.notification) {
        const notificationOptions: NotificationOptions = {
          body: payload.notification.body,
          icon: payload.notification.icon || "/icon-192x192.png",
          badge: "/badge-72x72.png",
          data: payload.data,
        };

        if (Notification.permission === "granted") {
          new Notification(
            payload.notification.title || "SeniorEase",
            notificationOptions,
          );
        }
      }
    });
  } catch (error) {
    console.error("Error setting up message listener:", error);
  }
}
