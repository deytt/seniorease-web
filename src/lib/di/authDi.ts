import { FirebaseAuthRepository } from "@/infrastructure/firebase/FirebaseAuthRepository";
import { SignInUseCase } from "@/domain/usecases/auth/SignInUseCase";
import { SignUpUseCase } from "@/domain/usecases/auth/SignUpUseCase";
import { SignOutUseCase } from "@/domain/usecases/auth/SignOutUseCase";
import { SendPasswordResetUseCase } from "@/domain/usecases/auth/SendPasswordResetUseCase";
import { SignInWithGoogleUseCase } from "@/domain/usecases/auth/SignInWithGoogleUseCase";
import { GetCurrentUserUseCase } from "@/domain/usecases/auth/GetCurrentUserUseCase";
import { UpdateUserUseCase } from "@/domain/usecases/auth/UpdateUserUseCase";
import { ChangePasswordUseCase } from "@/domain/usecases/auth/ChangePasswordUseCase";
import { SendEmailVerificationUseCase } from "@/domain/usecases/auth/SendEmailVerificationUseCase";
import { ReloadEmailVerificationUseCase } from "@/domain/usecases/auth/ReloadEmailVerificationUseCase";

const authRepository = new FirebaseAuthRepository();

export const signInUseCase = new SignInUseCase(authRepository);
export const signUpUseCase = new SignUpUseCase(authRepository);
export const signOutUseCase = new SignOutUseCase(authRepository);
export const sendPasswordResetUseCase = new SendPasswordResetUseCase(
  authRepository,
);
export const signInWithGoogleUseCase = new SignInWithGoogleUseCase(
  authRepository,
);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
export const updateUserUseCase = new UpdateUserUseCase(authRepository);
export const changePasswordUseCase = new ChangePasswordUseCase(authRepository);
export const sendEmailVerificationUseCase = new SendEmailVerificationUseCase(
  authRepository,
);
export const reloadEmailVerificationUseCase =
  new ReloadEmailVerificationUseCase(authRepository);

export function getSignInUseCase() {
  return signInUseCase;
}

export function getSignUpUseCase() {
  return signUpUseCase;
}

export function getSignOutUseCase() {
  return signOutUseCase;
}

export function getSendPasswordResetUseCase() {
  return sendPasswordResetUseCase;
}

export function getSignInWithGoogleUseCase() {
  return signInWithGoogleUseCase;
}

export function getGetCurrentUserUseCase() {
  return getCurrentUserUseCase;
}

export function getUpdateUserUseCase() {
  return updateUserUseCase;
}

export function getChangePasswordUseCase() {
  return changePasswordUseCase;
}

export function getSendEmailVerificationUseCase() {
  return sendEmailVerificationUseCase;
}

export function getReloadEmailVerificationUseCase() {
  return reloadEmailVerificationUseCase;
}
