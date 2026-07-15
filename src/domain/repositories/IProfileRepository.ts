import type { Address } from "@/domain/entities/Address";
import type { User } from "@/domain/entities/User";

export interface SaveUserProfileInput {
  name?: string;
  phone?: string | null;
  birthDate?: string | null;
  cpf?: string | null;
  photoUrl?: string | null;
  address?: Address | null;
}

/**
 * Contrato do módulo Perfil (ADR-014).
 * Persiste `users/{userId}` com merge, preservando `id`/`createdAt`/`email`.
 */
export interface IProfileRepository {
  getProfile(userId: string): Promise<User | null>;
  saveProfile(userId: string, input: SaveUserProfileInput): Promise<User>;
}
