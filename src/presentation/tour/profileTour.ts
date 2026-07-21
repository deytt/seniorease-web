import { startSeniorEaseTour } from "@/presentation/tour/startSeniorEaseTour";
import { profileTourSteps } from "@/presentation/tour/profileTourSteps";

export const PROFILE_TOUR_ID = "profile";

export function startProfileTour(userId: string): void {
  startSeniorEaseTour({
    tourId: PROFILE_TOUR_ID,
    userId,
    steps: profileTourSteps,
  });
}
