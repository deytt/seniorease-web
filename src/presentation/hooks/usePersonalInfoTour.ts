"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import {
  PERSONAL_INFO_TOUR_ID,
  personalInfoTourSteps,
} from "@/presentation/tour/personalInfoTourSteps";

export function usePersonalInfoTour(options: {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}) {
  return usePageTour({
    tourId: PERSONAL_INFO_TOUR_ID,
    userId: options.userId,
    interfaceMode: options.interfaceMode,
    steps: personalInfoTourSteps,
    offerTitle: "Quer um tour das informações pessoais?",
    offerDescription:
      "Mostramos os campos principais e como salvar suas alterações.",
  });
}
