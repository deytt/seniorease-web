import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "@/infrastructure/firebase/config";
import type { IProfilePhotoStorage } from "@/domain/repositories/IProfilePhotoStorage";

export class FirebaseProfilePhotoStorage implements IProfilePhotoStorage {
  async uploadProfilePhoto(
    userId: string,
    file: Blob,
    contentType: string,
  ): Promise<string> {
    const objectRef = ref(storage, `profile_photos/${userId}`);

    await uploadBytes(objectRef, file, { contentType });
    return getDownloadURL(objectRef);
  }
}
