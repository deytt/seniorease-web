import type { User } from "@/domain/entities/User";
import type {
  GoogleSignInOptions,
  IAuthRepository,
  SignInCredentials,
  SignUpInput,
  UpdateUserInput,
} from "@/domain/repositories/IAuthRepository";

const MOCK_USER_STORAGE_KEY = "mock_auth_user";
const MOCK_SESSION_KEY = "mock_auth_session";

/**
 * Mock de autenticação para desenvolvimento local
 * Simula um usuário logado sem depender de credenciais Firebase reais
 * Persiste dados em localStorage/sessionStorage conforme "lembrar de mim"
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

  private saveUserToStorage(user: User, rememberMe: boolean): void {
    if (typeof window === "undefined") return;

    const payload = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(MOCK_USER_STORAGE_KEY, payload);
      sessionStorage.removeItem(MOCK_SESSION_KEY);
    } else {
      sessionStorage.setItem(MOCK_SESSION_KEY, payload);
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
  }

  private getUserFromStorage(): User | null {
    if (typeof window === "undefined") return null;

    const stored =
      sessionStorage.getItem(MOCK_SESSION_KEY) ??
      localStorage.getItem(MOCK_USER_STORAGE_KEY);

    if (!stored) return null;

    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }

  private clearUserFromStorage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  }

  async signIn(credentials: SignInCredentials): Promise<User> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const user = this.createMockUser(credentials.email);
    this.saveUserToStorage(user, credentials.rememberMe ?? false);
    return user;
  }

  async signUp(input: SignUpInput): Promise<User> {
    if (!input.name || !input.email || !input.password) {
      throw new Error("Nome, email e senha são obrigatórios");
    }

    const user = this.createMockUser(input.email, input.name);
    this.saveUserToStorage(user, true);
    return user;
  }

  async signOut(): Promise<void> {
    this.clearUserFromStorage();
  }

  async signInWithGoogle(options: GoogleSignInOptions = {}): Promise<User> {
    const user = this.createMockUser("user@example.com", "Mock User");
    this.saveUserToStorage(user, options.rememberMe ?? false);
    return user;
  }

  async completeGoogleRedirect(): Promise<User | null> {
    return null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.getUserFromStorage();
  }

  async sendPasswordReset(email: string): Promise<void> {
    void email;
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
