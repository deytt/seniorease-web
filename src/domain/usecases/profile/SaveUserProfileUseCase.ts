import type { User } from "@/domain/entities/User";
import type {
  IProfileRepository,
  SaveUserProfileInput,
} from "@/domain/repositories/IProfileRepository";
import { validateProfileName } from "@/domain/validation/profileNameValidation";
import { HistoryActionType } from "@/domain/history/HistoryActionType";
import type { IHistoryRecorder } from "@/domain/history/IHistoryRecorder";
import { HISTORY_STATIC_TITLES } from "@/domain/history/historyTitles";

export class SaveUserProfileUseCase {
  constructor(
    private readonly repository: IProfileRepository,
    private readonly historyRecorder: IHistoryRecorder,
  ) {}

  async execute(userId: string, input: SaveUserProfileInput): Promise<User> {
    if (input.name !== undefined) {
      const nameError = validateProfileName(input.name);
      if (nameError) {
        throw new Error(nameError);
      }
    }

    const user = await this.repository.saveProfile(userId, input);

    await this.historyRecorder.record({
      userId,
      type: HistoryActionType.profileUpdated,
      title: HISTORY_STATIC_TITLES[HistoryActionType.profileUpdated],
      entityId: userId,
      category: null,
    });

    return user;
  }
}
