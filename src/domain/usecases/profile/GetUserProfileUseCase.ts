import type { User } from "@/domain/entities/User";
import type { IProfileRepository } from "@/domain/repositories/IProfileRepository";

export class GetUserProfileUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(userId: string): Promise<User | null> {
    return this.repository.getProfile(userId);
  }
}
