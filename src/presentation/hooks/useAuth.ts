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
  const [resetState, setResetState] = useState<
    ActionState & { success: boolean }
  >({
    ...idleState,
    success: false,
  });

  const signIn = useCallback(
    async (email: string, password: string) => {
      setSignInState({ isLoading: true, error: null });
      try {
        await signInUseCase.execute({ email, password });
        // Reset loading state before redirect to avoid button being stuck
        setSignInState({ isLoading: false, error: null });
        router.push("/dashboard");
      } catch (err) {
        setSignInState({ isLoading: false, error: toMessage(err) });
      }
    },
    [router],
  );

  const signInWithGoogle = useCallback(async () => {
    setGoogleSignInState({ isLoading: true, error: null });
    try {
      await signInWithGoogleUseCase.execute();
      // Reset loading state before redirect to avoid button being stuck
      setGoogleSignInState({ isLoading: false, error: null });
      router.push("/dashboard");
    } catch (err) {
      const message = toMessage(err);
      // Ignore the canceled popup message
      if (message.includes("cancelou")) {
        setGoogleSignInState({ isLoading: false, error: null });
      } else {
        setGoogleSignInState({ isLoading: false, error: message });
      }
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
    await signOutUseCase.execute();
    router.push("/login");
  }, [router]);

  return {
    signIn,
    isSigningIn: signInState.isLoading,
    signInError: signInState.error,

    signInWithGoogle,
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
  };
}
