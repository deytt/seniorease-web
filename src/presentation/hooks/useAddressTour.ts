"use client";

import { usePageTour } from "@/presentation/hooks/usePageTour";
import { ADDRESS_TOUR_ID, addressTourSteps } from "@/presentation/tour/addressTourSteps";

export function useAddressTour(options: {
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}) {
  return usePageTour({
    tourId: ADDRESS_TOUR_ID,
    userId: options.userId,
    interfaceMode: options.interfaceMode,
    steps: addressTourSteps,
    offerTitle: "Quer um tour do endereço?",
    offerDescription:
      "Mostramos onde preencher o endereço e como salvar.",
  });
}
