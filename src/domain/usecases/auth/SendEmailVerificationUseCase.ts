import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class SendEmailVerificationUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.sendEmailVerification();
  }
}
