import { FirebaseFcmTokenRepository } from "@/infrastructure/firebase/FirebaseNotificationRepository";
import { FirebaseNotificationRepository } from "@/infrastructure/firebase/FirebaseNotificationRepository";
import { CountTodayNotificationsUseCase } from "@/domain/usecases/notifications/CountTodayNotificationsUseCase";
import { GetNotificationHistoryUseCase } from "@/domain/usecases/notifications/GetNotificationHistoryUseCase";
import { RegisterFcmTokenUseCase } from "@/domain/usecases/notifications/RegisterFcmTokenUseCase";
import { RemoveFcmTokenUseCase } from "@/domain/usecases/notifications/RemoveFcmTokenUseCase";

let notificationRepository: FirebaseNotificationRepository | null = null;
let fcmTokenRepository: FirebaseFcmTokenRepository | null = null;
let getNotificationHistoryUseCase: GetNotificationHistoryUseCase | null = null;
let countTodayNotificationsUseCase: CountTodayNotificationsUseCase | null = null;
let registerFcmTokenUseCase: RegisterFcmTokenUseCase | null = null;
let removeFcmTokenUseCase: RemoveFcmTokenUseCase | null = null;

export function getNotificationRepository(): FirebaseNotificationRepository {
  if (!notificationRepository) {
    notificationRepository = new FirebaseNotificationRepository();
  }
  return notificationRepository;
}

export function getFcmTokenRepository(): FirebaseFcmTokenRepository {
  if (!fcmTokenRepository) {
    fcmTokenRepository = new FirebaseFcmTokenRepository();
  }
  return fcmTokenRepository;
}

export function getGetNotificationHistoryUseCase(): GetNotificationHistoryUseCase {
  if (!getNotificationHistoryUseCase) {
    getNotificationHistoryUseCase = new GetNotificationHistoryUseCase(
      getNotificationRepository(),
    );
  }
  return getNotificationHistoryUseCase;
}

export function getCountTodayNotificationsUseCase(): CountTodayNotificationsUseCase {
  if (!countTodayNotificationsUseCase) {
    countTodayNotificationsUseCase = new CountTodayNotificationsUseCase();
  }
  return countTodayNotificationsUseCase;
}

export function getRegisterFcmTokenUseCase(): RegisterFcmTokenUseCase {
  if (!registerFcmTokenUseCase) {
    registerFcmTokenUseCase = new RegisterFcmTokenUseCase(
      getFcmTokenRepository(),
    );
  }
  return registerFcmTokenUseCase;
}

export function getRemoveFcmTokenUseCase(): RemoveFcmTokenUseCase {
  if (!removeFcmTokenUseCase) {
    removeFcmTokenUseCase = new RemoveFcmTokenUseCase(getFcmTokenRepository());
  }
  return removeFcmTokenUseCase;
}

export function getNotificationsDi() {
  return {
    notificationRepository: getNotificationRepository(),
    fcmTokenRepository: getFcmTokenRepository(),
    getNotificationHistoryUseCase: getGetNotificationHistoryUseCase(),
    countTodayNotificationsUseCase: getCountTodayNotificationsUseCase(),
    registerFcmTokenUseCase: getRegisterFcmTokenUseCase(),
    removeFcmTokenUseCase: getRemoveFcmTokenUseCase(),
  };
}
