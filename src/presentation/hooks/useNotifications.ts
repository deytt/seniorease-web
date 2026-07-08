"use client";

import { useEffect, useRef } from "react";
import {
  requestFCMToken,
  setupMessageListener,
} from "@/infrastructure/firebase/fcmService";

/**
 * Hook para gerenciar notificações FCM
 * Use dentro de um contexto autenticado
 */
export function useNotifications(userId?: string) {
  const initRef = useRef(false);

  useEffect(() => {
    // Only initialize once per userId and prevent re-initialization
    if (!userId || initRef.current) return;
    initRef.current = true;

    const initNotifications = async () => {
      try {
        // Request notification permission and get token
        const token = await requestFCMToken();

        if (token) {
          console.log("FCM Token obtained successfully");
          // TODO: Save token to Firestore user document
          // await updateUserFCMToken(userId, token);
        }

        // Setup message listener (one-time setup)
        await setupMessageListener((payload) => {
          console.log("New notification:", payload);
          // TODO: Handle incoming notifications
          // Could show a toast, update state, etc.
        });
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    initNotifications();
  }, [userId]);
}
