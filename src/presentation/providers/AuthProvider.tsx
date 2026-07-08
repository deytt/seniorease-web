"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import type { User } from "@/domain/entities/User";
import { getGetCurrentUserUseCase, getSignOutUseCase } from "@/lib/di/authDi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const getCurrentUserUseCase = getGetCurrentUserUseCase();
        const currentUser = await getCurrentUserUseCase.execute();
        setUser(currentUser);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao verificar autenticação",
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Initialize FCM notifications when user is authenticated (one-time setup per userId)
  const fcmInitRef = useRef(false);

  useEffect(() => {
    if (!user?.id || fcmInitRef.current) return;
    fcmInitRef.current = true;

    // Dynamically import and initialize FCM
    const initFCM = async () => {
      try {
        const { requestFCMToken, setupMessageListener } =
          await import("@/infrastructure/firebase/fcmService");

        const token = await requestFCMToken();
        if (token) {
          console.log("FCM Token obtained successfully");
          // TODO: Save token to Firestore user document
        }

        await setupMessageListener((payload) => {
          console.log("New notification:", payload);
        });
      } catch (err) {
        console.error("Error initializing FCM:", err);
      }
    };

    initFCM();
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
