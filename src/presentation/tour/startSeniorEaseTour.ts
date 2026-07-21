import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "./profileTour.css";

import {
  markTourCompleted,
  markTourOffered,
} from "@/presentation/tour/tourStorage";

function scrollTourTargetIntoView(element: Element | undefined) {
  if (!element || !(element instanceof HTMLElement)) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}

export type StartSeniorEaseTourOptions = {
  tourId: string;
  userId: string;
  steps: DriveStep[];
};

export function startSeniorEaseTour({
  tourId,
  userId,
  steps,
}: StartSeniorEaseTourOptions): void {
  markTourOffered(userId, tourId);

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
    steps,
    onHighlightStarted: (element) => {
      scrollTourTargetIntoView(element);
    },
    onDestroyed: () => {
      markTourCompleted(userId, tourId);
    },
  });

  tour.drive();
}
