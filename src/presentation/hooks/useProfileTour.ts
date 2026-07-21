"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { PROFILE_TOUR_ID } from "@/presentation/tour/profileTour";
import { profileTourSteps } from "@/presentation/tour/profileTourSteps";

interface UseProfileTourOptions {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

export function useProfileTour({
  userId,
  interfaceMode = "advanced",
}: UseProfileTourOptions) {
  return usePageTour({
    tourId: PROFILE_TOUR_ID,
    userId,
    interfaceMode,
    steps: profileTourSteps,
    offerTitle: "Quer um tour guiado do perfil?",
    offerDescription:
      "Em poucos passos, mostramos cada área do perfil — foto, dados, notificações, segurança e onde pedir ajuda.",
  });
}
