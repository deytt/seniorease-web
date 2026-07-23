"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInUseCase,
  signUpUseCase,
  signOutUseCase,
  sendPasswordResetUseCase,
  signInWithGoogleUseCase,
} from "@/lib/di/authDi";
import {
  clearRememberedEmail,
  setRememberedEmail,
} from "@/infrastructure/auth/rememberEmail";

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

/**
 * Hook de apresentação para o módulo de Autenticação.
 * Concentra sign in, sign up e reset de senha — consome os casos de uso
 * do Domain, nunca fala com o Firebase diretamente (ver lib/di/authDi.ts).
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
    async (email: string, password: string, rememberMe = false) => {
      setSignInState({ isLoading: true, error: null });
      try {
        await signInUseCase.execute({ email, password, rememberMe });
        if (rememberMe) {
          setRememberedEmail(email);
        } else {
          clearRememberedEmail();
        }
        setSignInState({ isLoading: false, error: null });
        router.push("/dashboard");
      } catch (err) {
        setSignInState({ isLoading: false, error: toMessage(err) });
      }
    },
    [router],
  );

  const signInWithGoogle = useCallback(
    async (rememberMe = false) => {
      setGoogleSignInState({ isLoading: true, error: null });
      try {
        await signInWithGoogleUseCase.execute({ rememberMe });
        setGoogleSignInState({ isLoading: false, error: null });
        router.push("/dashboard");
      } catch (err) {
        const message = toMessage(err);

        if (message === "REDIRECT_IN_PROGRESS") {
          // Navegação para o Google em andamento — mantém loading
          return;
        }

        if (message.includes("cancelou")) {
          setGoogleSignInState({ isLoading: false, error: null });
          return;
        }

        setGoogleSignInState({ isLoading: false, error: message });
      }
    },
    [router],
  );

  const completeGoogleRedirect = useCallback(async () => {
    try {
      const user = await signInWithGoogleUseCase.completeRedirect();
      if (!user) return false;

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
