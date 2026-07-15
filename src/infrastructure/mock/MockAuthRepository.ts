import type { User } from "@/domain/entities/User";
import type {
  IAuthRepository,
  SignInCredentials,
  SignUpInput,
  UpdateUserInput,
} from "@/domain/repositories/IAuthRepository";

const MOCK_USER_STORAGE_KEY = "mock_auth_user";

/**
 * Mock de autenticação para desenvolvimento local
 * Simula um usuário logado sem depender de credenciais Firebase reais
 * Persiste dados em localStorage para manter a sessão entre recarregamentos
 */
export class MockAuthRepository implements IAuthRepository {
  private createMockUser(email: string, name?: string): User {
    return {
      id: "mock-user-" + Math.random().toString(36),
      email,
      name: name || email.split("@")[0],
      createdAt: new Date(),
      usesPasswordAuth: true,
      emailVerified: false,
    };
  }

  private saveUserToStorage(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  private getUserFromStorage(): User | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  private clearUserFromStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
  }

  async signIn(credentials: SignInCredentials): Promise<User> {
    // Simula qualquer email/senha válida
    if (!credentials.email || !credentials.password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const user = this.createMockUser(credentials.email);
    this.saveUserToStorage(user);
    return user;
  }

  async signUp(input: SignUpInput): Promise<User> {
    if (!input.name || !input.email || !input.password) {
      throw new Error("Nome, email e senha são obrigatórios");
    }

    const user = this.createMockUser(input.email, input.name);
    this.saveUserToStorage(user);
    return user;
  }

  async signOut(): Promise<void> {
    this.clearUserFromStorage();
  }

  async signInWithGoogle(): Promise<User> {
    const user = this.createMockUser("user@example.com", "Mock User");
    this.saveUserToStorage(user);
    return user;
  }

  async getCurrentUser(): Promise<User | null> {
    // Retorna o usuário persistido no localStorage
    return this.getUserFromStorage();
  }

  async sendPasswordReset(email: string): Promise<void> {
    void email;
    // Mock de reset de senha
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
    return {
      id: userId,
      email: "user@example.com",
      name: input.name || "Mock User",
      createdAt: new Date(),
      usesPasswordAuth: true,
      emailVerified: false,
    };
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    void currentPassword;
    void newPassword;
  }

  async sendEmailVerification(): Promise<void> {}

  async reloadEmailVerification(): Promise<boolean> {
    return false;
  }
}
