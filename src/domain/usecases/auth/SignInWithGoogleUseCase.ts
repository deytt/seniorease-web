import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { User } from "@/domain/entities/User";

export class SignInWithGoogleUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<User> {
    return this.authRepository.signInWithGoogle();
  }
}
