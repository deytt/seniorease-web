"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { ABOUT_TOUR_ID, aboutTourSteps } from "@/presentation/tour/aboutTourSteps";

export function useAboutTour(options: {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}) {
  return usePageTour({
    tourId: ABOUT_TOUR_ID,
    userId: options.userId,
    interfaceMode: options.interfaceMode,
    steps: aboutTourSteps,
    offerTitle: "Quer um tour sobre o app?",
    offerDescription:
      "Em poucos passos, explicamos o propósito, a versão e a aplicação web.",
  });
}
