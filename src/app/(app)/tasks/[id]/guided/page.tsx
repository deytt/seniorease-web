"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { getTasksDi } from "@/lib/di/tasksDi";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { GuidedTaskScreen } from "@/presentation/components/tasks/guidedTaskScreen";
import {
  getMaxNavigableStepIndex,
  getResumeStepIndex,
} from "@/presentation/components/tasks/guidedTaskUtils";
import type { Task } from "@/domain/entities/Task";
import { useSeniorFeedback } from "@/lib/feedback/useSeniorFeedback";
import { toast } from "sonner";

export default function GuidedTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: taskId } = use(params);
  const router = useRouter();
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const [task, setTask] = useState<Task | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const { taskRepository, completeTaskUseCase, advanceGuidedTaskStepUseCase } =
    getTasksDi();
  const feedback = useSeniorFeedback();

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const loadTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await taskRepository.getTaskById(taskId);
        if (cancelled) return;

        if (!data) {
          setError("Tarefa não encontrada");
          return;
        }
        setTask(data);
        setCurrentStepIndex(getResumeStepIndex(data));
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Erro ao carregar tarefa",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTask();

    return () => {
      cancelled = true;
    };
  }, [user, taskId, taskRepository]);

  const handleStepSelect = (index: number) => {
    if (!task) return;
    const maxIndex = getMaxNavigableStepIndex(task);
    if (index <= maxIndex) {
      setCurrentStepIndex(index);
    }
  };

  const handleNextStep = async () => {
    if (!task) return;
    feedback.light();

    try {
      setIsAdvancing(true);
      const updatedTask = await advanceGuidedTaskStepUseCase.execute(
        taskId,
        currentStepIndex,
      );
      setTask(updatedTask);
      setCurrentStepIndex((prev) =>
        Math.min((updatedTask.steps?.length ?? 1) - 1, prev + 1),
      );
    } catch (err) {
      console.error("Erro ao avançar passo:", err);
      toast.error("Não foi possível concluir este passo. Tente novamente.");
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!task) return;

    try {
      setIsCompleting(true);

      if (task.steps && task.steps.length > 0) {
        const lastIndex = task.steps.length - 1;
        if (!task.steps[lastIndex]?.isCompleted) {
          const updatedTask = await advanceGuidedTaskStepUseCase.execute(
            taskId,
            lastIndex,
          );
          setTask(updatedTask);
        }
      }

      await completeTaskUseCase.execute(taskId);
      feedback.success();
      setShowCelebration(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 4000);
    } catch (err) {
      console.error("Erro ao completar tarefa:", err);
      toast.error("Não foi possível concluir a tarefa. Tente novamente.");
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Carregando tarefa...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm bg-card shadow-card">
          <CardContent className="p-6 text-center">
            <p className="mb-4 font-medium text-destructive">
              {error || "Tarefa não encontrada"}
            </p>
            <Button asChild>
              <Link href="/tasks">Ver Tarefas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <GuidedTaskScreen
      task={task}
      currentStepIndex={currentStepIndex}
      onPrevious={() => {
        feedback.selection();
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      }}
      onNext={handleNextStep}
      onComplete={handleCompleteTask}
      onStepSelect={handleStepSelect}
      isCompleting={isCompleting}
      isAdvancing={isAdvancing}
      showCelebration={showCelebration}
      userId={user?.id}
      interfaceMode={preferences.interfaceMode}
    />
  );
}
