import type { User } from "@/domain/entities/User";

export interface SignInCredentials {
  email: string;
  password: string;
  /** Se true, mantém a sessão após fechar o navegador. */
  rememberMe?: boolean;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface GoogleSignInOptions {
  /** Se true, mantém a sessão após fechar o navegador. */
  rememberMe?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  cpf?: string;
}

/**
 * Contrato implementado pela camada de Infrastructure (ex: FirebaseAuthRepository).
 * O Domain nunca importa a implementação — apenas esta interface.
 */
export interface IAuthRepository {
  signIn(credentials: SignInCredentials): Promise<User>;
  signUp(input: SignUpInput): Promise<User>;
  signInWithGoogle(options?: GoogleSignInOptions): Promise<User>;
  /**
   * Completa o login Google iniciado via redirect (quando o popup é bloqueado).
   * Retorna null se não houver resultado pendente.
   */
  completeGoogleRedirect(): Promise<User | null>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateUser(userId: string, input: UpdateUserInput): Promise<User>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  sendEmailVerification(): Promise<void>;
  reloadEmailVerification(): Promise<boolean>;
}
