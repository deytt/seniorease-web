/**
 * Entidade de domínio — não conhece Firebase, Next.js ou qualquer framework.
 * Ver memory-bank/systemPatterns.md
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
