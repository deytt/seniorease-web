import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  reload,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/infrastructure/firebase/config";
import type {
  IAuthRepository,
  SignInCredentials,
  SignUpInput,
  UpdateUserInput,
} from "@/domain/repositories/IAuthRepository";
import type { Address } from "@/domain/entities/Address";
import type { User } from "@/domain/entities/User";
import { usesPasswordAuth } from "@/infrastructure/firebase/authProviderUtils";

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
  name: string,
  email: string,
  createdAt: Date = new Date(),
  extras?: {
    updatedAt?: Date | null;
    emailVerified?: boolean;
    phone?: string | null;
    birthDate?: string | null;
    cpf?: string | null;
    photoUrl?: string | null;
    address?: Address | null;
    usesPasswordAuth?: boolean;
  },
): User {
  return {
    id,
    name,
    email,
    createdAt,
    updatedAt: extras?.updatedAt ?? null,
    emailVerified: extras?.emailVerified ?? false,
    phone: extras?.phone ?? null,
    birthDate: extras?.birthDate ?? null,
    cpf: extras?.cpf ?? null,
    photoUrl: extras?.photoUrl ?? null,
    address: extras?.address ?? null,
    usesPasswordAuth: extras?.usesPasswordAuth,
  };
}

/**
 * Traduz códigos de erro do Firebase para linguagem simples e humana,
 * conforme productContext.md — "Linguagem simples e humana".
 */
function toFriendlyMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos. Verifique e tente novamente.";
    case "auth/too-many-requests":
      return "Muitas tentativas seguidas. Aguarde um momento e tente de novo.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado. Tente entrar em vez de criar uma nova conta.";
    case "auth/weak-password":
      return "Escolha uma senha um pouco mais forte, com pelo menos 6 caracteres.";
    case "auth/invalid-email":
      return "Este e-mail não parece válido. Confira e tente novamente.";
    case "auth/requires-recent-login":
      return "Por segurança, saia e entre novamente antes de alterar a senha.";
    case "auth/operation-not-allowed":
      return "Esta conta não permite alterar a senha por aqui. Use o login com Google.";
    case "auth/invalid-verification-code":
      return "Código incorreto. Verifique o app autenticador e tente novamente.";
    default:
      return "Algo deu errado. Tente novamente em instantes.";
  }
}

export class FirebaseAuthRepository implements IAuthRepository {
  async signIn({ email, password }: SignInCredentials): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return toDomainUser(
        user.uid,
        user.displayName ?? "",
        user.email ?? email,
        new Date(),
        {
          emailVerified: user.emailVerified,
          usesPasswordAuth: usesPasswordAuth(user),
        },
      );
    } catch (error) {
      throw new Error(toFriendlyMessage(this.extractCode(error)));
    }
  }

  async signUp({ name, email, password }: SignUpInput): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
      });

      return toDomainUser(user.uid, name, email, new Date(), {
        usesPasswordAuth: usesPasswordAuth(user),
      });
    } catch (error) {
      throw new Error(toFriendlyMessage(this.extractCode(error)));
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      // Verificar se o usuário já existe no Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // Criar novo usuário com dados do Google
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          createdAt: serverTimestamp(),
        });
      }

      return toDomainUser(user.uid, user.displayName ?? "", user.email ?? "", new Date(), {
        emailVerified: user.emailVerified,
        usesPasswordAuth: usesPasswordAuth(user),
      });
    } catch (error) {
      const errorCode = (error as { code?: string })?.code;
      if (errorCode === "auth/popup-closed-by-user") {
        throw new Error("Você cancelou o login com Google.");
      }
      throw new Error(toFriendlyMessage(this.extractCode(error)));
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(toFriendlyMessage(this.extractCode(error)));
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser: FirebaseUser | null) => {
          unsubscribe();

          if (!firebaseUser) {
            resolve(null);
            return;
          }

          const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
          const data = snapshot.data() as
            | {
                name?: string;
                phone?: string | null;
                birthDate?: string | null;
                cpf?: string | null;
                photoUrl?: string | null;
                address?: unknown;
                createdAt?: { toDate: () => Date };
                updatedAt?: { toDate: () => Date };
              }
            | undefined;

          resolve(
            toDomainUser(
              firebaseUser.uid,
              data?.name ?? firebaseUser.displayName ?? "",
              firebaseUser.email ?? "",
              data?.createdAt?.toDate() ?? new Date(),
              {
                updatedAt: data?.updatedAt?.toDate() ?? null,
                emailVerified: firebaseUser.emailVerified,
                phone: data?.phone,
                birthDate: data?.birthDate,
                cpf: data?.cpf,
                photoUrl: data?.photoUrl ?? firebaseUser.photoURL,
                address: parseAddress(data?.address),
                usesPasswordAuth: usesPasswordAuth(firebaseUser),
              },
            ),
          );
        },
      );
    });
  }

  private extractCode(error: unknown): string {
    return (error as { code?: string })?.code ?? "";
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const currentData = userDoc.data();
      const updateData = Object.fromEntries(
        Object.entries(input).filter(([, value]) => value !== undefined),
      );

      await updateDoc(userDocRef, updateData);

      // Also update Firebase Auth displayName if name is being updated
      const currentUser = auth.currentUser;
      if (currentUser && input.name) {
        await updateProfile(currentUser, { displayName: input.name });
      }

      return toDomainUser(
        userId,
        input.name ?? currentData.name,
        currentData.email,
        currentData.createdAt?.toDate?.() ?? new Date(),
        {
          updatedAt: new Date(),
          phone: input.phone ?? currentData.phone,
          birthDate: currentData.birthDate,
          cpf: input.cpf ?? currentData.cpf,
          photoUrl: currentData.photoUrl,
          address: parseAddress(currentData.address),
          usesPasswordAuth: currentUser ? usesPasswordAuth(currentUser) : undefined,
        },
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil",
      );
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser?.email) {
      throw new Error("Sessão expirada. Entre novamente.");
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      throw new Error(toFriendlyMessage(this.extractCode(error)));
    }
  }

  async sendEmailVerification(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Sessão expirada. Entre novamente.");
    }

    if (currentUser.emailVerified) {
      return;
    }

    try {
      await sendEmailVerification(currentUser);
    } catch (error) {
      throw new Error(toFriendlyMessage(this.extractCode(error)));
    }
  }

  async reloadEmailVerification(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Sessão expirada. Entre novamente.");
    }

    try {
      await reload(currentUser);
      return currentUser.emailVerified;
    } catch (error) {
      throw new Error(toFriendlyMessage(this.extractCode(error)));
    }
  }
}
