"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight } from "lucide-react";
import { toast } from "@/presentation/lib/feedbackToast";
import { TOUR_CATALOG } from "@/presentation/tour/tourCatalog";
import { setPendingTour } from "@/presentation/tour/pendingTour";
import { resolveTourRoute } from "@/presentation/tour/resolveTourRoute";
import { Button } from "@/presentation/components/ui/button";
import { useAuthContext } from "@/presentation/providers/AuthProvider";

export function GuidesScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [startingId, setStartingId] = useState<string | null>(null);

  const startGuide = async (tourId: string, route: string) => {
    if (startingId) return;

    setStartingId(tourId);
    try {
      const resolved = await resolveTourRoute(tourId, route, user?.id);

      if (resolved.errorMessage) {
        toast.info(resolved.errorMessage);
        if (resolved.route === "/tasks" && tourId === "taskDetails") {
          // Sem tarefa alvo: não dispara o tour na lista.
          router.push(resolved.route);
          return;
        }
      }

      setPendingTour(tourId);
      router.push(resolved.route);
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl pb-16">
      <header className="mb-6">
        <h1 className="page-title">
          Guia do aplicativo
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Escolha um tour guiado para conhecer as telas com calma, passo a passo.
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-primary/10">
            <BookOpen className="size-5 text-primary" aria-hidden />
          </div>
          <div>
            <h2 className="card-title">Como funciona</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Toque em um guia abaixo. Vamos abrir a tela certa e destacar cada
              parte importante. Você pode sair a qualquer momento.
            </p>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {TOUR_CATALOG.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              disabled={startingId !== null}
              onClick={() => void startGuide(item.id, item.route)}
              className="flex min-h-[72px] w-full cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-70"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-secondary/15">
                <BookOpen className="size-5 text-secondary" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ChevronRight
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button asChild variant="outline" className="min-h-11 cursor-pointer rounded-[14px]">
          <Link href="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
