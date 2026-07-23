"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import type { LoginMethod } from "@/domain/entities/LoginPreferences";
import {
  signInUseCase,
  signUpUseCase,
  signOutUseCase,
  sendPasswordResetUseCase,
  signInWithGoogleUseCase,
  saveLoginPreferencesUseCase,
} from "@/lib/di/authDi";
import {
  consumePendingRememberMe,
  setPendingRememberMe,
} from "@/infrastructure/auth/LocalLoginPreferencesRepository";

interface ActionState {
  isLoading: boolean;
  error: string | null;
}

const idleState: ActionState = { isLoading: false, error: null };

function toMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "Algo deu errado. Tente novamente.";
}

function persistLoginPreferences(params: {
  rememberMe: boolean;
  email: string | null;
  method: LoginMethod;
}) {
  saveLoginPreferencesUseCase.execute({
    rememberMe: params.rememberMe,
    lastEmail: params.rememberMe ? params.email : null,
    lastMethod: params.rememberMe ? params.method : null,
  });
}

/**
 * Hook de apresentação para o módulo de Autenticação.
 * "Lembrar de mim" persiste só identidade local (paridade mobile), não a sessão.
 */
export function useAuth() {
  const router = useRouter();

  const [signInState, setSignInState] = useState<ActionState>(idleState);
  const [signUpState, setSignUpState] = useState<ActionState>(idleState);
  const [googleSignInState, setGoogleSignInState] =
    useState<ActionState>(idleState);
  const [signOutState, setSignOutState] = useState<ActionState>(idleState);
  const [resetState, setResetState] = useState<
    ActionState & { success: boolean }
  >({
    ...idleState,
    success: false,
  });

  const signIn = useCallback(
    async (email: string, password: string, rememberMe = true) => {
      setSignInState({ isLoading: true, error: null });
      try {
        await signInUseCase.execute({ email, password });
        persistLoginPreferences({
          rememberMe,
          email,
          method: "email",
        });
        setSignInState({ isLoading: false, error: null });
        router.push("/dashboard");
        return true;
      } catch (err) {
        setSignInState({ isLoading: false, error: toMessage(err) });
        return false;
      }
    },
    [router],
  );

  const signInWithGoogle = useCallback(
    async (rememberMe = true) => {
      setGoogleSignInState({ isLoading: true, error: null });
      setPendingRememberMe(rememberMe);
      try {
        const user = await signInWithGoogleUseCase.execute();
        persistLoginPreferences({
          rememberMe,
          email: user.email,
          method: "google",
        });
        setGoogleSignInState({ isLoading: false, error: null });
        router.push("/dashboard");
        return true;
      } catch (err) {
        const message = toMessage(err);

        if (message === "REDIRECT_IN_PROGRESS") {
          return false;
        }

        if (message.includes("cancelou")) {
          setGoogleSignInState({ isLoading: false, error: null });
          return false;
        }

        setGoogleSignInState({ isLoading: false, error: message });
        return false;
      }
    },
    [router],
  );

  const completeGoogleRedirect = useCallback(async () => {
    try {
      const user = await signInWithGoogleUseCase.completeRedirect();
      if (!user) return false;

      const pendingRemember = consumePendingRememberMe();
      const rememberMe = pendingRemember ?? true;
      persistLoginPreferences({
        rememberMe,
        email: user.email,
        method: "google",
      });

      setGoogleSignInState({ isLoading: true, error: null });
      router.push("/dashboard");
      return true;
    } catch (err) {
      setGoogleSignInState({ isLoading: false, error: toMessage(err) });
      return false;
    }
  }, [router]);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      setSignUpState({ isLoading: true, error: null });
      try {
        await signUpUseCase.execute({ name, email, password });
        router.push("/success");
      } catch (err) {
        setSignUpState({ isLoading: false, error: toMessage(err) });
      }
    },
    [router],
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    setResetState({ isLoading: true, error: null, success: false });
    try {
      await sendPasswordResetUseCase.execute(email);
      setResetState({ isLoading: false, error: null, success: true });
    } catch (err) {
      setResetState({
        isLoading: false,
        error: toMessage(err),
        success: false,
      });
    }
  }, []);

  const signOut = useCallback(async () => {
    setSignOutState({ isLoading: true, error: null });
    try {
      await signOutUseCase.execute();
      router.push("/login");
      setSignOutState({ isLoading: false, error: null });
    } catch (err) {
      setSignOutState({ isLoading: false, error: toMessage(err) });
      throw err;
    }
  }, [router]);

  return {
    signIn,
    isSigningIn: signInState.isLoading,
    signInError: signInState.error,

    signInWithGoogle,
    completeGoogleRedirect,
    isSigningInWithGoogle: googleSignInState.isLoading,
    signInWithGoogleError: googleSignInState.error,

    signUp,
    isSigningUp: signUpState.isLoading,
    signUpError: signUpState.error,

    requestPasswordReset,
    isRequestingReset: resetState.isLoading,
    resetError: resetState.error,
    resetSuccess: resetState.success,

    signOut,
    isSigningOut: signOutState.isLoading,
    signOutError: signOutState.error,
  };
}
