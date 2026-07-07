import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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
import type { User } from "@/domain/entities/User";

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
    default:
      return "Algo deu errado. Tente novamente em instantes.";
  }
}

function toDomainUser(id: string, name: string, email: string): User {
  return { id, name, email, createdAt: new Date() };
}

export class FirebaseAuthRepository implements IAuthRepository {
  async signIn({ email, password }: SignInCredentials): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return toDomainUser(
        user.uid,
        user.displayName ?? "",
        user.email ?? email,
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

      return toDomainUser(user.uid, name, email);
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

      return toDomainUser(user.uid, user.displayName ?? "", user.email ?? "");
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
          const data = snapshot.data() as { name?: string } | undefined;

          resolve(
            toDomainUser(
              firebaseUser.uid,
              data?.name ?? firebaseUser.displayName ?? "",
              firebaseUser.email ?? "",
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
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil",
      );
    }
  }
}
