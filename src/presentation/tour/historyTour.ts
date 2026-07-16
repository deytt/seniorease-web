import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./profileTour.css";

import { historyTourSteps } from "@/presentation/tour/historyTourSteps";
import {
  markTourCompleted,
  markTourOffered,
} from "@/presentation/tour/tourStorage";

export const HISTORY_TOUR_ID = "history";

function scrollTourTargetIntoView(element: Element | undefined) {
  if (!element || !(element instanceof HTMLElement)) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}

export function startHistoryTour(userId: string): void {
  markTourOffered(userId, HISTORY_TOUR_ID);

  const tour = driver({
    animate: true,
    smoothScroll: true,
    allowClose: true,
    overlayColor: "#0f172a",
    overlayOpacity: 0.45,
    stagePadding: 12,
    stageRadius: 14,
    popoverClass: "seniorease-tour-popover",
    showProgress: true,
    progressText: "Passo {{current}} de {{total}}",
    nextBtnText: "Continuar",
    prevBtnText: "Voltar",
    doneBtnText: "Entendi!",
    steps: historyTourSteps,
    onHighlightStarted: (element) => {
      scrollTourTargetIntoView(element);
    },
    onDestroyed: () => {
      markTourCompleted(userId, HISTORY_TOUR_ID);
    },
  });

  tour.drive();
}
