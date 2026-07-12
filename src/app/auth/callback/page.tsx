"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/infrastructure/firebase/config";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processRedirect = async () => {
      try {
        console.log("[AuthCallback] Processing redirect result...");
        const result = await getRedirectResult(auth);
        console.log(
          "[AuthCallback] Redirect result:",
          result?.user?.email ?? "null",
        );

        if (result?.user) {
          console.log(
            "[AuthCallback] User authenticated, redirecting to dashboard",
          );
          // Add a small delay to ensure auth state is updated
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/dashboard");
        } else {
          console.log(
            "[AuthCallback] No user in redirect result, going back to login",
          );
          router.push("/login");
        }
      } catch (error) {
        console.error("[AuthCallback] Error processing redirect:", error);
        router.push("/login");
      }
    };

    processRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Processando login...</h1>
        <p className="text-muted-foreground">Por favor, aguarde.</p>
      </div>
    </div>
  );
}
