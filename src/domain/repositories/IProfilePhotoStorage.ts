/**
 * Contrato de upload da foto de perfil (ADR-014).
 * Path no Storage: `profile_photos/{userId}`.
 */
export interface IProfilePhotoStorage {
  uploadProfilePhoto(userId: string, file: Blob, contentType: string): Promise<string>;
}
