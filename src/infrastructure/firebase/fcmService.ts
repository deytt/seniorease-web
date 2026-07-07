import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./fcmConfig";

/**
 * Request permission and get FCM token for the user
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

    return token;
  } catch (error) {
    // Push service not available is expected in development/localhost without HTTPS
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
 * Handle incoming messages
 */
export async function setupMessageListener(
  callback: (payload: any) => void,
): Promise<void> {
  try {
    const msg = await messaging;
    if (!msg) return;

    onMessage(msg, (payload) => {
      console.log("Message received:", payload);
      callback(payload);

      // Show notification if in focus
      if (payload.notification) {
        const notificationOptions = {
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
