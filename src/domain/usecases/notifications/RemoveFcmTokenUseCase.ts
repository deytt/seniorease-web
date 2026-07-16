import type { IFcmTokenRepository } from "@/domain/repositories/IFcmTokenRepository";

export class RemoveFcmTokenUseCase {
  constructor(private readonly fcmTokenRepository: IFcmTokenRepository) {}

  execute(userId: string, token: string): Promise<void> {
    return this.fcmTokenRepository.removeToken(userId, token);
  }
}
