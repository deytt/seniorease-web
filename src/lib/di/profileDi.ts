import { FirebaseProfileRepository } from "@/infrastructure/firebase/FirebaseProfileRepository";
import { FirebaseProfilePhotoStorage } from "@/infrastructure/firebase/FirebaseProfilePhotoStorage";
import { GetUserProfileUseCase } from "@/domain/usecases/profile/GetUserProfileUseCase";
import { SaveUserProfileUseCase } from "@/domain/usecases/profile/SaveUserProfileUseCase";
import { UploadProfilePhotoUseCase } from "@/domain/usecases/profile/UploadProfilePhotoUseCase";
import { getHistoryDi } from "@/lib/di/historyDi";

const profileRepository = new FirebaseProfileRepository();
const profilePhotoStorage = new FirebaseProfilePhotoStorage();

export const getUserProfileUseCase = new GetUserProfileUseCase(profileRepository);
export const uploadProfilePhotoUseCase = new UploadProfilePhotoUseCase(
  profilePhotoStorage,
  profileRepository,
);

let saveUserProfileUseCaseInstance: SaveUserProfileUseCase | null = null;

export function getSaveUserProfileUseCase() {
  if (!saveUserProfileUseCaseInstance) {
    const { historyRecorder } = getHistoryDi();
    saveUserProfileUseCaseInstance = new SaveUserProfileUseCase(
      profileRepository,
      historyRecorder,
    );
  }
  return saveUserProfileUseCaseInstance;
}

export function getGetUserProfileUseCase() {
  return getUserProfileUseCase;
}

export function getUploadProfilePhotoUseCase() {
  return uploadProfilePhotoUseCase;
}
