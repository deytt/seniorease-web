import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class SendPasswordResetUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error("Informe o e-mail cadastrado na sua conta.");
    }

    await this.authRepository.sendPasswordReset(normalizedEmail);
  }
}
