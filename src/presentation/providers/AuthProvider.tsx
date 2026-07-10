"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { onAuthStateChanged } from "firebase/auth";

import type { User } from "@/domain/entities/User";
import { auth } from "@/infrastructure/firebase/config";
import { getGetCurrentUserUseCase, getSignOutUseCase } from "@/lib/di/authDi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fonte de verdade da sessão na Presentation.
 * Escuta `onAuthStateChanged` de forma contínua — um check único no mount
 * ficava com `user=null` após o login (feito na rota /login) e páginas como
 * /reminders e /profile redirecionavam de volta ao login.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fcmInitRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      void (async () => {
        try {
          const currentUser = await getGetCurrentUserUseCase().execute();
          setUser(currentUser);
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao verificar autenticação",
          );
          setUser(null);
        } finally {
          setLoading(false);
        }
      })();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.id) {
      fcmInitRef.current = null;
      return;
    }
    if (fcmInitRef.current === user.id) return;
    fcmInitRef.current = user.id;

    const initFCM = async () => {
      try {
        const { requestFCMToken, setupMessageListener } =
          await import("@/infrastructure/firebase/fcmService");

        const token = await requestFCMToken();
        if (token) {
          console.log("FCM Token obtained successfully");
        }

        await setupMessageListener((payload) => {
          console.log("New notification:", payload);
        });
      } catch (err) {
        console.error("Error initializing FCM:", err);
      }
    };

    void initFCM();
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      const signOutUseCase = getSignOutUseCase();
      await signOutUseCase.execute();
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err instanceof Error ? err.message : "Erro ao fazer logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signOut: handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }
  return context;
}
