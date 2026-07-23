import type {
  IAuthRepository,
  SignInCredentials,
} from "@/domain/repositories/IAuthRepository";
import type { User } from "@/domain/entities/User";

export class SignInUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute({ email, password }: SignInCredentials): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error("Informe seu e-mail e senha para continuar.");
    }

    return this.authRepository.signIn({
      email: normalizedEmail,
      password,
    });
  }
}
