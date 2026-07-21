"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import {
  NOTIFICATION_PREFS_TOUR_ID,
  notificationPrefsTourSteps,
} from "@/presentation/tour/notificationPrefsTourSteps";

export function useNotificationPrefsTour(options: {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}) {
  return usePageTour({
    tourId: NOTIFICATION_PREFS_TOUR_ID,
    userId: options.userId,
    interfaceMode: options.interfaceMode,
    steps: notificationPrefsTourSteps,
    offerTitle: "Quer um tour das notificações?",
    offerDescription:
      "Explicamos como ligar avisos de tarefas e lembretes e escolher a antecedência.",
  });
}
