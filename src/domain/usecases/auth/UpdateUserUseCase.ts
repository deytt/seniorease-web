import { User } from "@/domain/entities/User";
import {
  IAuthRepository,
  UpdateUserInput,
} from "@/domain/repositories/IAuthRepository";

export class UpdateUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userId: string, input: UpdateUserInput): Promise<User> {
    return this.authRepository.updateUser(userId, input);
  }
}
