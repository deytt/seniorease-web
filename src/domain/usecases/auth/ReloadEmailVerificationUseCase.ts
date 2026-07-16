import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";
import { HISTORY_STATIC_TITLES } from "@/domain/history/historyTitles";

export class ReloadEmailVerificationUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly historyRecorder: IHistoryRecorder,
  ) {}

  async execute(userId: string): Promise<boolean> {
    const verified = await this.authRepository.reloadEmailVerification();

    if (verified) {
      await this.historyRecorder.record({
        userId,
        type: HistoryActionType.accountVerified,
        title: HISTORY_STATIC_TITLES[HistoryActionType.accountVerified],
        entityId: userId,
        category: null,
      });
    }

    return verified;
  }
}
