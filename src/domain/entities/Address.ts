/**
 * Endereço do utilizador — espelha o map `address` em `users/{userId}`.
 * Ver memory-bank/firebaseSchema.md (ADR-014).
 */
export interface Address {
  neighborhood: string;
  street: string;
  number: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}

export function emptyAddress(): Address {
  return {
    neighborhood: "",
    street: "",
    number: "",
    zipCode: "",
    city: "",
    state: "",
    country: "Brasil",
  };
}

export function isAddressEmpty(address: Address | null | undefined): boolean {
  if (!address) return true;
  return !Object.values(address).some((value) => value.trim().length > 0);
}
