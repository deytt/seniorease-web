export const PROFILE_NAME_MIN_LENGTH = 3;
export const PROFILE_NAME_MAX_LENGTH = 30;

export function validateProfileName(name: string): string | null {
  const trimmed = name.trim();

  if (trimmed.length < PROFILE_NAME_MIN_LENGTH) {
    return "Nome deve ter pelo menos 3 caracteres.";
  }

  if (trimmed.length > PROFILE_NAME_MAX_LENGTH) {
    return `Nome deve ter no máximo ${PROFILE_NAME_MAX_LENGTH} caracteres.`;
  }

  return null;
}
