"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import celebrationAnimation from "@/../public/celebration.json";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import type { Task } from "@/domain/entities/Task";
import { cn } from "@/lib/utils";
import {
  getCompletedStepCount,
  getGuidedProgressPercent,
  getMaxNavigableStepIndex,
} from "@/presentation/components/tasks/guidedTaskUtils";
import { useGuidedTaskTour } from "@/presentation/hooks/useGuidedTaskTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";

interface GuidedTaskScreenProps {
  task: Task;
  currentStepIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  onStepSelect?: (index: number) => void;
  isCompleting?: boolean;
  isAdvancing?: boolean;
  showCelebration?: boolean;
  userId?: string;
  interfaceMode?: "basic" | "advanced";
}

function CompletedStepCheck({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-primary",
        className,
      )}
      aria-hidden="true"
    >
      <Check className="size-4 text-white" strokeWidth={3} />
    </span>
  );
}

function GuidedTaskStepper({
  steps,
  currentIndex,
  maxNavigableIndex,
  onStepSelect,
}: {
  steps: Task["steps"];
  currentIndex: number;
  maxNavigableIndex: number;
  onStepSelect?: (index: number) => void;
}) {
  return (
    <div
      className="flex w-full items-center pt-3"
      aria-label={`Progresso: passo ${currentIndex + 1} de ${steps.length}`}
    >
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = step.isCompleted;
        const showConnector = index < steps.length - 1;
        const canSelect = index <= maxNavigableIndex;

        return (
          <div
            key={step.id ?? index}
            className={cn(
              "flex items-center",
              showConnector ? "flex-1" : "shrink-0",
            )}
          >
            <button
              type="button"
              disabled={!canSelect || !onStepSelect}
              onClick={() => onStepSelect?.(index)}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                isCompleted
                  ? "bg-transparent p-0"
                  : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                canSelect && onStepSelect && !isCompleted
                  ? "cursor-pointer hover:ring-2 hover:ring-primary/30"
                  : isCompleted
                    ? "cursor-pointer"
                    : "cursor-default",
              )}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Passo ${index + 1}${isCompleted ? ", concluído" : ""}`}
            >
              {isCompleted ? <CompletedStepCheck /> : index + 1}
            </button>
            {showConnector && (
              <div
                className={cn(
                  "mx-1 h-1 flex-1 rounded-full sm:mx-2",
                  isCompleted ? "bg-primary" : "bg-muted",
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function GuidedTaskScreen({
  task,
  currentStepIndex,
  onPrevious,
  onNext,
  onComplete,
  onStepSelect,
  isCompleting = false,
  isAdvancing = false,
  showCelebration = false,
  userId,
  interfaceMode = "advanced",
}: GuidedTaskScreenProps) {
  const steps = task.steps ?? [];
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useGuidedTaskTour({ userId, interfaceMode });
  const hasSteps = steps.length > 0;
  const currentStep = hasSteps ? steps[currentStepIndex] : null;
  const isLastStep = hasSteps && currentStepIndex === steps.length - 1;
  const maxNavigableIndex = getMaxNavigableStepIndex(task);
  const progressPercent = getGuidedProgressPercent(task);
  const completedCount = getCompletedStepCount(task);
  const isBusy = isCompleting || isAdvancing;

  const stepTitle =
    currentStep?.title?.trim() || `Passo ${currentStepIndex + 1}`;
  const stepInstruction =
    currentStep?.instruction?.trim() ||
    "Siga as instruções deste passo com calma.";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col justify-center rounded-2xl bg-background px-3 py-4 sm:px-1 sm:py-6 lg:min-h-[calc(100vh-12rem)] lg:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-11 min-h-11 w-fit shrink-0 bg-transparent px-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground sm:text-base"
          asChild
        >
          <Link href="/tasks" aria-label="Sair do Modo Guiado">
            <X className="size-5" aria-hidden="true" />
            <span className="sm:hidden">Sair</span>
            <span className="hidden sm:inline">Sair do Modo Guiado</span>
          </Link>
        </Button>

        <div className="flex w-full min-w-0 items-center justify-center gap-2 sm:w-auto sm:justify-end">
          <span
            className="inline-flex w-full min-w-0 items-center justify-center rounded-full bg-secondary px-4 py-2 text-base font-semibold leading-snug text-secondary-foreground sm:w-auto sm:max-w-sm sm:justify-start sm:text-lg"
            title={task.title}
          >
            <span className="truncate">{task.title}</span>
          </span>
          <TourHelpButton
            onClick={beginTour}
            label="Abrir tour guiado do Modo Guiado"
          />
        </div>
      </div>

      {showCelebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guided-celebration-title"
        >
          <Card className="w-full max-w-sm shadow-modal">
            <CardContent className="p-8 text-center">
              <Lottie
                animationData={celebrationAnimation}
                loop={false}
                className="mx-auto mb-2 h-40 w-40"
                aria-hidden="true"
              />
              <h2
                id="guided-celebration-title"
                className="mb-2 text-2xl font-bold"
              >
                Parabéns!
              </h2>
              <p className="mb-4 text-muted-foreground">
                Você completou a tarefa &quot;{task.title}&quot; com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                Retornando ao painel...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {!hasSteps ? (
        <Card className="mt-8 border-border bg-card shadow-card">
          <CardContent className="p-8 text-center">
            <CheckCircle2
              className="mx-auto mb-4 size-12 text-success"
              aria-hidden="true"
            />
            <h2 className="mb-2 text-xl font-bold">Tarefa sem passos</h2>
            <p className="mb-6 text-muted-foreground">
              Esta tarefa não possui instruções passo a passo. Você pode
              marcá-la como concluída diretamente.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={onComplete}
              disabled={isBusy}
            >
              <CheckCircle2 className="size-5" aria-hidden="true" />
              {isCompleting ? "Concluindo..." : "Marcar como Concluída"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mt-4 space-y-2 sm:mt-6" data-tour="guided-progress">
            <div className="flex items-center justify-between gap-3 text-sm font-medium text-muted-foreground">
              <span aria-live="polite" className="shrink-0">
                Passo {currentStepIndex + 1} de {steps.length}
              </span>
              <span className="shrink-0 text-right">
                {progressPercent}% concluído
              </span>
            </div>

            <div
              className="h-4 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progressPercent}% da tarefa concluído (${completedCount} de ${steps.length} passos confirmados)`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <GuidedTaskStepper
              steps={steps}
              currentIndex={currentStepIndex}
              maxNavigableIndex={maxNavigableIndex}
              onStepSelect={onStepSelect}
            />
          </div>

          <Card
            className="mt-6 border-border bg-card shadow-card sm:mt-8"
            data-tour="guided-step-card"
          >
            <CardContent className="flex flex-col items-center px-4 py-8 text-center sm:px-10 sm:py-[2.5625rem]">
              <div
                className={cn(
                  "mb-5 flex size-16 items-center justify-center rounded-full sm:mb-6 sm:size-20",
                  currentStep?.isCompleted
                    ? "bg-success-light"
                    : "bg-primary-light",
                )}
                aria-hidden="true"
              >
                {currentStep?.isCompleted ? (
                  <span className="flex size-9 items-center justify-center rounded-full border-2 border-success sm:size-10">
                    <Check
                      className="size-4 text-success sm:size-5"
                      strokeWidth={3}
                    />
                  </span>
                ) : (
                  <span className="text-3xl font-black text-primary sm:text-4xl">
                    {currentStepIndex + 1}
                  </span>
                )}
              </div>

              <h2 className="max-w-lg text-xl font-bold leading-tight text-foreground sm:text-2xl lg:text-3xl">
                {stepTitle}
              </h2>

              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl">
                {stepInstruction}
              </p>

              {currentStep?.isCompleted && (
                <p className="mt-4 text-sm font-medium text-success">
                  Este passo já foi confirmado como concluído.
                </p>
              )}
            </CardContent>
          </Card>

          <div
            className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary-light px-3 py-3 text-sm text-foreground sm:mt-6 sm:px-4"
            role="note"
            data-tour="guided-tip"
          >
            <Info
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="min-w-0 leading-relaxed">
              Ao tocar em <strong>Próximo Passo</strong>, você confirma que
              concluiu o passo atual. Passos já confirmados não podem ser
              desfeitos, mas você pode voltar para revisá-los.
            </p>
          </div>

          <div
            className="sticky bottom-0 z-10 -mx-3 mt-4 border-t border-border bg-background/95 px-3 py-4 backdrop-blur-sm supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none"
            data-tour="guided-nav"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <button
                type="button"
                className={cn(
                  "inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-base font-bold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[4.375rem] sm:px-6 sm:py-5 sm:text-lg",
                )}
                onClick={onPrevious}
                disabled={currentStepIndex === 0 || isBusy}
                aria-disabled={currentStepIndex === 0}
              >
                <ArrowLeft
                  className="size-5 shrink-0 text-foreground sm:size-6"
                  aria-hidden="true"
                />
                Passo Anterior
              </button>

              {isLastStep ? (
                <Button
                  type="button"
                  size="lg"
                  className="min-h-11 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 sm:min-h-[4.375rem] sm:py-5 sm:text-lg"
                  onClick={onComplete}
                  disabled={isBusy}
                >
                  {isCompleting ? "Concluindo..." : "Concluir Tarefa"}
                  {!isCompleting && (
                    <CheckCircle2
                      className="size-5 sm:size-6"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  className="min-h-11 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 sm:min-h-[4.375rem] sm:py-5 sm:text-lg"
                  onClick={onNext}
                  disabled={isBusy}
                >
                  {isAdvancing ? "Salvando..." : "Próximo Passo"}
                  <ArrowRight className="size-5 sm:size-6" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      <TourOfferDialog
        open={showOfferDialog}
        title={offerTitle}
        description={offerDescription}
        onDismiss={dismissOffer}
        onStart={beginTour}
      />
    </div>
  );
}
