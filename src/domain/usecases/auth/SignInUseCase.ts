import type {
  IAuthRepository,
  SignInCredentials,
} from "@/domain/repositories/IAuthRepository";
import type { User } from "@/domain/entities/User";

/**
 * Caso de uso independente de UI e de framework.
 * Regras de negócio da autenticação vivem aqui, não no componente React.
 */
export class SignInUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute({
    email,
    password,
    rememberMe = false,
  }: SignInCredentials): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error("Informe seu e-mail e senha para continuar.");
    }

    return this.authRepository.signIn({
      email: normalizedEmail,
      password,
      rememberMe,
    });
  }
}
