import { FirebaseProfileRepository } from "@/infrastructure/firebase/FirebaseProfileRepository";
import { FirebaseProfilePhotoStorage } from "@/infrastructure/firebase/FirebaseProfilePhotoStorage";
import { GetUserProfileUseCase } from "@/domain/usecases/profile/GetUserProfileUseCase";
import { SaveUserProfileUseCase } from "@/domain/usecases/profile/SaveUserProfileUseCase";
import { UploadProfilePhotoUseCase } from "@/domain/usecases/profile/UploadProfilePhotoUseCase";

const profileRepository = new FirebaseProfileRepository();
const profilePhotoStorage = new FirebaseProfilePhotoStorage();

export const getUserProfileUseCase = new GetUserProfileUseCase(profileRepository);
export const saveUserProfileUseCase = new SaveUserProfileUseCase(profileRepository);
export const uploadProfilePhotoUseCase = new UploadProfilePhotoUseCase(
  profilePhotoStorage,
  profileRepository,
);

export function getGetUserProfileUseCase() {
  return getUserProfileUseCase;
}

export function getSaveUserProfileUseCase() {
  return saveUserProfileUseCase;
}

export function getUploadProfilePhotoUseCase() {
  return uploadProfilePhotoUseCase;
}
