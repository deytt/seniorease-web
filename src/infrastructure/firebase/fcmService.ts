import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "./fcmConfig";

const FIREBASE_MESSAGING_SW_PATH = "/firebase-messaging-sw.js";

function requiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return value;
}

/**
 * Monta a URL do Service Worker com a configuração pública do Firebase.
 *
 * Service workers em /public não têm acesso direto a process.env. Passamos os
 * valores públicos via query string para evitar commitar configs reais no arquivo.
 */
export function getFirebaseMessagingServiceWorkerUrl(): string {
  const params = new URLSearchParams({
    apiKey: requiredEnv(
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    ),
    authDomain: requiredEnv(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    ),
    projectId: requiredEnv(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    ),
    storageBucket: requiredEnv(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    ),
    messagingSenderId: requiredEnv(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    ),
    appId: requiredEnv(
      "NEXT_PUBLIC_FIREBASE_APP_ID",
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ),
  });

  return `${FIREBASE_MESSAGING_SW_PATH}?${params.toString()}`;
}

async function getServiceWorkerRegistration(): Promise<
  ServiceWorkerRegistration | undefined
> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return undefined;
  }

  const serviceWorkerUrl = getFirebaseMessagingServiceWorkerUrl();
  const existing = await navigator.serviceWorker.getRegistration("/");
  const existingScriptUrl =
    existing?.active?.scriptURL ??
    existing?.waiting?.scriptURL ??
    existing?.installing?.scriptURL;

  if (existing && existingScriptUrl?.includes("apiKey=")) return existing;

  return navigator.serviceWorker.register(serviceWorkerUrl, { scope: "/" });
}

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
 * Token persistence in Firestore goes through RegisterFcmTokenUseCase.
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

    const serviceWorkerRegistration = await getServiceWorkerRegistration();
    const token = await getToken(msg, {
      vapidKey: requiredEnv(
        "NEXT_PUBLIC_FIREBASE_VAPID_KEY",
        process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      ),
      serviceWorkerRegistration,
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
