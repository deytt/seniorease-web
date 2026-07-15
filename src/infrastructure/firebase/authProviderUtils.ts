import type { User as FirebaseUser } from "firebase/auth";

export function usesPasswordAuthFromIds(providerIds: string[]): boolean {
  return providerIds.includes("password");
}

export function usesPasswordAuth(firebaseUser: FirebaseUser): boolean {
  return usesPasswordAuthFromIds(
    firebaseUser.providerData.map((provider) => provider.providerId),
  );
}
