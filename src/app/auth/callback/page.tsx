"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  saveLoginPreferencesUseCase,
  signInWithGoogleUseCase,
} from "@/lib/di/authDi";
import { consumePendingRememberMe } from "@/infrastructure/auth/LocalLoginPreferencesRepository";

/**
 * Completa o login Google iniciado via redirect (fallback quando o popup
 * é bloqueado). O Firebase devolve o resultado na mesma origem.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const processRedirect = async () => {
      try {
        const user = await signInWithGoogleUseCase.completeRedirect();
        if (user) {
          const pendingRemember = consumePendingRememberMe();
          const rememberMe = pendingRemember ?? true;
          saveLoginPreferencesUseCase.execute({
            rememberMe,
            lastEmail: rememberMe ? user.email : null,
            lastMethod: rememberMe ? "google" : null,
          });
          router.replace("/dashboard");
          return;
        }
        router.replace("/login");
      } catch {
        router.replace("/login");
      }
    };

    void processRedirect();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Processando login...
        </h1>
        <p className="text-muted-foreground">Por favor, aguarde.</p>
      </div>
    </div>
  );
}
