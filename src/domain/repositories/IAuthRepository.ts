import type { User } from "@/domain/entities/User";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInCredentials {
  name: string;
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
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateUser(userId: string, input: UpdateUserInput): Promise<User>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  sendEmailVerification(): Promise<void>;
  reloadEmailVerification(): Promise<boolean>;
}
