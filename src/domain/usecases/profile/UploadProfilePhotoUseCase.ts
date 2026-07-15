import type { User } from "@/domain/entities/User";
import type { IProfilePhotoStorage } from "@/domain/repositories/IProfilePhotoStorage";
import type { IProfileRepository } from "@/domain/repositories/IProfileRepository";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export class UploadProfilePhotoUseCase {
  constructor(
    private readonly photoStorage: IProfilePhotoStorage,
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string, file: File): Promise<User> {
    if (!file.type.startsWith("image/")) {
      throw new Error("Escolha uma imagem válida (JPG, PNG ou WebP).");
    }

    if (file.size > MAX_PHOTO_BYTES) {
      throw new Error("A imagem deve ter no máximo 5 MB.");
    }

    const photoUrl = await this.photoStorage.uploadProfilePhoto(
      userId,
      file,
      file.type,
    );

    return this.profileRepository.saveProfile(userId, { photoUrl });
  }
}
