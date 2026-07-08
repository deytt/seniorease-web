"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/infrastructure/firebase/config";
import { Navigation } from "@/presentation/components/layout/Navigation";

/**
 * Guard de rota do grupo (app) — systemPatterns.md: "Rota protegida
 * (redirect se não autenticado)". Agora com navegação responsiva (sidebar desktop + hamburger mobile).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authenticated">(
    "checking",
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      setStatus("authenticated");
    });

    return unsubscribe;
  }, [router]);

  if (status === "checking") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen w-full items-center justify-center bg-background"
      >
        <p className="text-lg text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation */}
      <Navigation onCollapsedChange={setSidebarCollapsed} />

      {/* Main content — shifts based on sidebar state */}
      <main
        className={`transition-all duration-300 pt-16 md:pt-0 min-h-screen ${
          sidebarCollapsed ? "md:ml-[68px]" : "md:ml-64"
        }`}
      >
        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
