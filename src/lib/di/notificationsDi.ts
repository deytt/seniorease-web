import { FirebaseNotificationRepository } from "@/infrastructure/firebase/FirebaseNotificationRepository";
import { GetNotificationsUseCase } from "@/domain/usecases/notifications/GetNotificationsUseCase";

let notificationRepository: FirebaseNotificationRepository | null = null;
let getNotificationsUseCase: GetNotificationsUseCase | null = null;

export function getNotificationRepository(): FirebaseNotificationRepository {
  if (!notificationRepository) {
    notificationRepository = new FirebaseNotificationRepository();
  }
  return notificationRepository;
}

export function getGetNotificationsUseCase(): GetNotificationsUseCase {
  if (!getNotificationsUseCase) {
    getNotificationsUseCase = new GetNotificationsUseCase(
      getNotificationRepository(),
    );
  }
  return getNotificationsUseCase;
}

export function getNotificationsDi() {
  return {
    notificationRepository: getNotificationRepository(),
    getNotificationsUseCase: getGetNotificationsUseCase(),
  };
}
