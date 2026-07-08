"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getTasksDi } from "@/lib/di/tasksDi";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Task } from "@/domain/entities/Task";
import Lottie from "lottie-react";
import celebrationAnimation from "@/../public/celebration.json";

interface GuidedTaskPageProps {
  params: {
    id: string;
  };
}

export default function GuidedTaskPage({ params }: GuidedTaskPageProps) {
  const { user } = useAuthContext();
  const [task, setTask] = useState<Task | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const { taskRepository, completeTaskUseCase } = getTasksDi();

  useEffect(() => {
    if (!user) return;

    const loadTask = async () => {
      try {
        setLoading(true);
        const data = await taskRepository.getTaskById(params.id);
        if (data) {
          setTask(data);
        } else {
          setError("Tarefa não encontrada");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar tarefa",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [user, params.id, taskRepository]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando tarefa...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium mb-4">
              {error || "Tarefa não encontrada"}
            </p>
            <Button asChild>
              <Link href="/tasks">Voltar para tarefas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = task.steps || [];
  const hasSteps = steps.length > 0;
  const currentStep = hasSteps ? steps[currentStepIndex] : null;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = hasSteps
    ? ((currentStepIndex + 1) / steps.length) * 100
    : 100;

  const handleNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleCompleteTask = async () => {
    try {
      await completeTaskUseCase.execute(params.id);
      setShowCelebration(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 4000);
    } catch (err) {
      console.error("Erro ao completar tarefa:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href={`/tasks/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-lg md:text-xl font-bold">{task.title}</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {hasSteps
                ? `Passo ${currentStepIndex + 1} de ${steps.length}`
                : "Sem passos"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {hasSteps && (
        <div className="bg-card border-b p-4">
          <div className="max-w-4xl mx-auto">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-8 text-center">
              <Lottie
                animationData={celebrationAnimation}
                loop={false}
                className="w-40 h-40 mx-auto mb-2"
                aria-hidden="true"
              />
              <h2 className="text-2xl font-bold mb-2">Parabéns! 🎉</h2>
              <p className="text-muted-foreground mb-4">
                Você completou a atividade &quot;{task.title}&quot; com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                Retornando ao painel...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {!hasSteps ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="size-12 mx-auto mb-4 text-success" />
              <h2 className="text-xl font-bold mb-2">Tarefa sem passos</h2>
              <p className="text-muted-foreground mb-6">
                Esta tarefa não possui instruções passo a passo. Você pode
                marcá-la como concluída diretamente.
              </p>
              <Button size="lg" onClick={handleCompleteTask} className="w-full">
                <CheckCircle2 className="size-4 mr-2" />
                Marcar como Concluída
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Current Step */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  Passo {currentStepIndex + 1}: {currentStep?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">
                  {currentStep?.instruction}
                </p>
              </CardContent>
            </Card>

            {/* Steps Overview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Todos os passos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      idx === currentStepIndex
                        ? "bg-primary/10 border border-primary"
                        : idx < currentStepIndex
                          ? "bg-success/10 text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground"
                    }`}
                    onClick={() => setCurrentStepIndex(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === currentStepIndex
                            ? "bg-primary text-primary-foreground"
                            : idx < currentStepIndex
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx < currentStepIndex ? "✓" : idx + 1}
                      </div>
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0}
              >
                <ChevronUp className="size-4 mr-2" />
                Passo Anterior
              </Button>

              {isLastStep ? (
                <Button
                  className="flex-1"
                  onClick={handleCompleteTask}
                  size="lg"
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  Concluir Tarefa
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleNextStep}>
                  Próximo Passo
                  <ChevronDown className="size-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
