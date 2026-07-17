"use client";

import { useEffect } from "react";
import {
  getFirebaseMessagingServiceWorkerUrl,
} from "@/infrastructure/firebase/fcmService";

/**
 * Componente para registrar o Service Worker do FCM
 * Deve ser colocado no layout raiz
 */
export function FCMProvider() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        navigator.serviceWorker
          .register(getFirebaseMessagingServiceWorkerUrl(), { scope: "/" })
          .then((registration) => {
            console.log("Service Worker registered:", registration);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }, []);

  return null;
}
