import { updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { auth, db } from "@/infrastructure/firebase/config";
import type { Address } from "@/domain/entities/Address";
import { emptyAddress } from "@/domain/entities/Address";
import type { User } from "@/domain/entities/User";
import type {
  IProfileRepository,
  SaveUserProfileInput,
} from "@/domain/repositories/IProfileRepository";

function parseAddress(raw: unknown): Address | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;
  const address = {
    neighborhood: String(data.neighborhood ?? ""),
    street: String(data.street ?? ""),
    number: String(data.number ?? ""),
    zipCode: String(data.zipCode ?? ""),
    city: String(data.city ?? ""),
    state: String(data.state ?? ""),
    country: String(data.country ?? "Brasil"),
  };

  const hasValue = Object.values(address).some((value) => value.trim().length > 0);
  return hasValue ? address : null;
}

function toDomainUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string | null;
    birthDate?: string | null;
    cpf?: string | null;
    photoUrl?: string | null;
    address?: unknown;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  },
  fallbackEmail = "",
  fallbackPhotoUrl?: string | null,
): User {
  return {
    id,
    name: data.name ?? "",
    email: data.email ?? fallbackEmail,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? null,
    phone: data.phone ?? null,
    birthDate: data.birthDate ?? null,
    cpf: data.cpf ?? null,
    photoUrl: data.photoUrl ?? fallbackPhotoUrl ?? null,
    address: parseAddress(data.address),
  };
}

export class FirebaseProfileRepository implements IProfileRepository {
  async getProfile(userId: string): Promise<User | null> {
    const snapshot = await getDoc(doc(db, "users", userId));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    const currentUser = auth.currentUser;

    return toDomainUser(
      userId,
      data,
      currentUser?.email ?? "",
      currentUser?.photoURL,
    );
  }

  async saveProfile(userId: string, input: SaveUserProfileInput): Promise<User> {
    const userDocRef = doc(db, "users", userId);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      throw new Error("Usuário não encontrado");
    }

    const currentData = snapshot.data();
    const payload: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (input.name !== undefined) payload.name = input.name;
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.birthDate !== undefined) payload.birthDate = input.birthDate;
    if (input.cpf !== undefined) payload.cpf = input.cpf;
    if (input.photoUrl !== undefined) payload.photoUrl = input.photoUrl;
    if (input.address !== undefined) {
      payload.address =
        input.address && Object.values(input.address).some((v) => v.trim())
          ? input.address
          : null;
    }

    await setDoc(userDocRef, payload, { merge: true });

    const currentUser = auth.currentUser;
    if (currentUser && input.name) {
      await updateProfile(currentUser, { displayName: input.name });
    }
    if (currentUser && input.photoUrl) {
      await updateProfile(currentUser, { photoURL: input.photoUrl });
    }

    const nextName = input.name ?? currentData.name;
    const nextPhone = input.phone !== undefined ? input.phone : currentData.phone;
    const nextBirthDate =
      input.birthDate !== undefined ? input.birthDate : currentData.birthDate;
    const nextCpf = input.cpf !== undefined ? input.cpf : currentData.cpf;
    const nextPhotoUrl =
      input.photoUrl !== undefined ? input.photoUrl : currentData.photoUrl;
    const nextAddress =
      input.address !== undefined
        ? input.address &&
          Object.values(input.address).some((v) => v.trim())
          ? input.address
          : null
        : parseAddress(currentData.address) ?? emptyAddress();

    return {
      id: userId,
      name: nextName ?? "",
      email: currentData.email ?? currentUser?.email ?? "",
      createdAt: currentData.createdAt?.toDate?.() ?? new Date(),
      updatedAt: new Date(),
      phone: nextPhone ?? null,
      birthDate: nextBirthDate ?? null,
      cpf: nextCpf ?? null,
      photoUrl: nextPhotoUrl ?? currentUser?.photoURL ?? null,
      address:
        nextAddress && Object.values(nextAddress).some((v) => v.trim())
          ? nextAddress
          : null,
    };
  }
}
