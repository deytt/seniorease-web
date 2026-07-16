import type { IFcmTokenRepository } from "@/domain/repositories/IFcmTokenRepository";

export class RegisterFcmTokenUseCase {
  constructor(private readonly fcmTokenRepository: IFcmTokenRepository) {}

  execute(userId: string, token: string): Promise<void> {
    return this.fcmTokenRepository.saveToken(userId, token);
  }
}
