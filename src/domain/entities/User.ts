import type { Address } from "@/domain/entities/Address";

/**
 * Entidade de domínio — não conhece Firebase, Next.js ou qualquer framework.
 * Espelha `users/{userId}` — ver memory-bank/firebaseSchema.md (ADR-014).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date | null;
  emailVerified?: boolean;
  phone?: string | null;
  birthDate?: string | null;
  cpf?: string | null;
  photoUrl?: string | null;
  address?: Address | null;
  usesPasswordAuth?: boolean;
}
