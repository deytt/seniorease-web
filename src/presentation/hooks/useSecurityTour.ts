"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { SECURITY_TOUR_ID, securityTourSteps } from "@/presentation/tour/securityTourSteps";

export function useSecurityTour(options: {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}) {
  return usePageTour({
    tourId: SECURITY_TOUR_ID,
    userId: options.userId,
    interfaceMode: options.interfaceMode,
    steps: securityTourSteps,
    offerTitle: "Quer um tour da segurança?",
    offerDescription:
      "Mostramos como verificar o e-mail e alterar a senha com tranquilidade.",
  });
}
