import type {
  IAuthRepository,
  SignUpInput,
} from "@/domain/repositories/IAuthRepository";
import type { User } from "@/domain/entities/User";

export class SignUpUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: SignUpInput): Promise<User> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name) {
      throw new Error("Informe seu nome completo.");
    }
    if (!email) {
      throw new Error("Informe um e-mail válido.");
    }
    if (input.password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }

    return this.authRepository.signUp({ ...input, name, email });
  }
}
