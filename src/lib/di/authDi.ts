import { FirebaseAuthRepository } from "@/infrastructure/firebase/FirebaseAuthRepository";
import { MockAuthRepository } from "@/infrastructure/mock/MockAuthRepository";
import { SignInUseCase } from "@/domain/usecases/auth/SignInUseCase";
import { SignUpUseCase } from "@/domain/usecases/auth/SignUpUseCase";
import { SignOutUseCase } from "@/domain/usecases/auth/SignOutUseCase";
import { SendPasswordResetUseCase } from "@/domain/usecases/auth/SendPasswordResetUseCase";
import { SignInWithGoogleUseCase } from "@/domain/usecases/auth/SignInWithGoogleUseCase";
import { GetCurrentUserUseCase } from "@/domain/usecases/auth/GetCurrentUserUseCase";
import { UpdateUserUseCase } from "@/domain/usecases/auth/UpdateUserUseCase";

/**
 * Injeção de dependência manual (suficiente para o escopo do Hackathon).
 * Se o projeto crescer, isto pode virar um container real (ex: tsyringe),
 * mas o ponto importante já está garantido: Presentation nunca instancia
 * Firebase diretamente, apenas consome os casos de uso do Domain.
 *
 * Em desenvolvimento local, usa MockAuthRepository para não depender de credenciais Firebase.
 * Detecta credenciais dummy do .env.local
 */
const isDummyFirebaseKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes("Dummy");
const authRepository = isDummyFirebaseKey
  ? new MockAuthRepository()
  : new FirebaseAuthRepository();

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

// Funções factory para DI
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
