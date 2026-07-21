import { startSeniorEaseTour } from "@/presentation/tour/startSeniorEaseTour";
import { historyTourSteps } from "@/presentation/tour/historyTourSteps";

export const HISTORY_TOUR_ID = "history";

export function startHistoryTour(userId: string): void {
  startSeniorEaseTour({
    tourId: HISTORY_TOUR_ID,
    userId,
    steps: historyTourSteps,
  });
}
