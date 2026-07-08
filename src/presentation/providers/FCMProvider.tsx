"use client";

import { useEffect } from "react";

/**
 * Componente para registrar o Service Worker do FCM
 * Deve ser colocado no layout raiz
 */
export function FCMProvider() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
