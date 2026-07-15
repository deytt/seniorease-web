import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class ReloadEmailVerificationUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<boolean> {
    return this.authRepository.reloadEmailVerification();
  }
}
