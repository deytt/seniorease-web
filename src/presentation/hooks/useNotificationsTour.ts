"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { notificationsTourSteps } from "@/presentation/tour/notificationsTourSteps";

interface UseNotificationsTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useNotificationsTour({
  userId,
  interfaceMode = "advanced",
}: UseNotificationsTourOptions) {
  return usePageTour({
    tourId: "notifications",
    userId,
    interfaceMode,
    steps: notificationsTourSteps,
    offerTitle: "Quer um tour guiado das notificações?",
    offerDescription: "Mostramos como acompanhar os avisos de tarefas e lembretes.",
  });
}
