import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class ChangePasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(currentPassword: string, newPassword: string): Promise<void> {
    return this.authRepository.changePassword(currentPassword, newPassword);
  }
}
