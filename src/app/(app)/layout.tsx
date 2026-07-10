"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/infrastructure/firebase/config";
import { Navigation } from "@/presentation/components/layout/Navigation";
import { cn } from "@/lib/utils";

const SIDEBAR_EXPANDED_MIN_WIDTH = 1280;

/**
 * Guard de rota do grupo (app) + shell responsivo.
 * - < lg: header mobile
 * - lg–xl: sidebar colapsada por padrão (pode expandir e empurra o conteúdo)
 * - ≥ 1280px: sidebar expandida por padrão
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authenticated">(
    "checking",
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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

  useEffect(() => {
    const media = window.matchMedia(
      `(max-width: ${SIDEBAR_EXPANDED_MIN_WIDTH - 1}px)`,
    );
    const sync = () => setSidebarCollapsed(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc]">
      <Navigation onCollapsedChange={setSidebarCollapsed} />

      <main
        className={cn(
          "min-h-screen min-w-0 pt-16 transition-all duration-300 lg:pt-0",
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64",
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
