import type { User } from "@/domain/entities/User";
import type {
  IProfileRepository,
  SaveUserProfileInput,
} from "@/domain/repositories/IProfileRepository";
import { validateProfileName } from "@/domain/validation/profileNameValidation";

export class SaveUserProfileUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(userId: string, input: SaveUserProfileInput): Promise<User> {
    if (input.name !== undefined) {
      const nameError = validateProfileName(input.name);
      if (nameError) {
        throw new Error(nameError);
      }
    }

    return this.repository.saveProfile(userId, input);
  }
}
