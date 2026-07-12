"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListOrdered, Plus } from "lucide-react";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getTasksDi } from "@/lib/di/tasksDi";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { findNextGuidedTask } from "@/presentation/components/tasks/guidedTaskUtils";

export default function GuidedTaskHubPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const { getTasksUseCase } = getTasksDi();

  useEffect(() => {
    if (authLoading || !user) return;

    const resolveGuidedTask = async () => {
      try {
        setLoading(true);
        const tasks = await getTasksUseCase.execute(user.id);
        const nextTask = findNextGuidedTask(tasks);

        if (nextTask) {
          router.replace(`/tasks/${nextTask.id}/guided`);
          return;
        }

        setShowEmptyState(true);
      } catch (err) {
        console.error("Erro ao carregar modo guiado:", err);
        setShowEmptyState(true);
      } finally {
        setLoading(false);
      }
    };

    resolveGuidedTask();
  }, [authLoading, user, getTasksUseCase, router]);

  if (loading && !showEmptyState) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-[#f8fafc]"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">
            Procurando tarefa para o Modo Guiado...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center justify-center bg-[#f8fafc] py-8">
      <Card className="w-full border-border bg-card shadow-card">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary-light">
            <ListOrdered className="size-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Modo Guiado</h1>
          <p className="mb-6 text-muted-foreground">
            Não há tarefas com passos disponíveis no momento. Crie uma tarefa
            com etapas para usar o modo passo a passo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/tasks/create">
                <Plus className="size-5" aria-hidden="true" />
                Nova Tarefa
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tasks">Ver Tarefas</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
