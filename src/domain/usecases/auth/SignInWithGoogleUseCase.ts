import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { User } from "@/domain/entities/User";

export class SignInWithGoogleUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<User> {
    return this.authRepository.signInWithGoogle();
  }

  /** Completa login iniciado com redirect (popup bloqueado). */
  async completeRedirect(): Promise<User | null> {
    return this.authRepository.completeGoogleRedirect();
  }
}
