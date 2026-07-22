"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { AlertCircle, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getTasksDi } from "@/lib/di/tasksDi";
import { useState } from "react";

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Título da tarefa é obrigatório")
    .max(30, "Título não pode ter mais de 30 caracteres"),
  description: z
    .string()
    .max(100, "Descrição não pode ter mais de 100 caracteres")
    .optional()
    .or(z.literal("")),
  dueDate: z
    .string()
    .min(1, "Defina a data e hora da tarefa")
    .refine(
      (val) => new Date(val) > new Date(),
      "A data e hora não pode ser no passado",
    ),
  priority: z
    .enum(["low", "medium", "high"])
    .refine((val) => val !== null, "Prioridade é obrigatória"),
  category: z
    .enum(["medication", "health", "exercise", "social", "personal"])
    .refine((val) => val !== null, "Categoria é obrigatória"),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

interface TaskStep {
  order: number;
  title: string;
  instruction: string;
}

interface CreateTaskFormProps {
  onSuccess?: () => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function CreateTaskForm({ onSuccess, formRef }: CreateTaskFormProps) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { createTaskUseCase } = getTasksDi();
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [stepTitle, setStepTitle] = useState("");
  const [stepInstruction, setStepInstruction] = useState("");
  const [stepsError, setStepsError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      category: "health",
    },
  });

  const titleValue = useWatch({ control, name: "title" }) ?? "";
  const descriptionValue = useWatch({ control, name: "description" }) ?? "";

  const handleAddStep = () => {
    if (stepTitle.trim() && stepInstruction.trim()) {
      const newSteps = [
        ...steps,
        {
          order: steps.length,
          title: stepTitle,
          instruction: stepInstruction,
        },
      ];
      setSteps(newSteps);
      setStepTitle("");
      setStepInstruction("");
      if (newSteps.length > 0) setStepsError(null);
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  async function onSubmit(values: CreateTaskFormValues) {
    if (!user) return;

    if (steps.length === 0) {
      setStepsError("Adicione pelo menos 1 passo à tarefa");
      return;
    }

    try {
      await createTaskUseCase.execute({
        userId: user.id,
        title: values.title,
        description: values.description ?? "",
        steps: steps,
        dueDate: new Date(values.dueDate),
        priority: values.priority,
        category: values.category,
      });

      reset();
      toast.success("Tarefa criada com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/tasks");
      }
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
      toast.error("Não foi possível criar a tarefa. Tente novamente.");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title + Description */}
      <div className="space-y-6" data-tour="create-task-basics">
        <div className="space-y-2">
          <Label htmlFor="title">
            Título da Tarefa <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Ex: Fazer compras no mercado"
            maxLength={30}
            {...register("title")}
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <span
              className={`text-xs ${titleValue.length >= 30 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {titleValue.length}/30
            </span>
          </div>
          {errors.title && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="size-4" />
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            placeholder="Adicione mais detalhes..."
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            rows={3}
            maxLength={100}
            {...register("description")}
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <span
              className={`text-xs ${descriptionValue.length >= 100 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {descriptionValue.length}/100
            </span>
          </div>
          {errors.description && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="size-4" />
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Priority and Category - Same Line on Desktop */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        data-tour="create-task-meta"
      >
        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">
            Prioridade <span className="text-destructive">*</span>
          </Label>
          <select
            id="priority"
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            {...register("priority")}
            disabled={isSubmitting}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          {errors.priority && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="size-4" />
              {errors.priority.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Categoria <span className="text-destructive">*</span>
          </Label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            {...register("category")}
            disabled={isSubmitting}
          >
            <option value="medication">Medicação</option>
            <option value="health">Saúde</option>
            <option value="exercise">Exercício</option>
            <option value="social">Social</option>
            <option value="personal">Pessoal</option>
          </select>
          {errors.category && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="size-4" />
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-2" data-tour="create-task-schedule">
        <Label htmlFor="dueDate">
          Data e Hora <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dueDate"
          type="datetime-local"
          {...register("dueDate")}
          disabled={isSubmitting}
        />
        {errors.dueDate && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.dueDate.message}
          </p>
        )}
      </div>

      {/* Steps Section */}
      <div
        className="space-y-4 p-4 bg-muted/50 rounded-lg"
        data-tour="create-task-steps"
      >
        <div>
          <h3 className="font-semibold">
            Passos da Tarefa <span className="text-destructive">*</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Divida a tarefa em passos simples para o modo guiado.
          </p>
        </div>

        {/* Add Step Form */}
        <div className="space-y-3">
          <Input
            placeholder="Título do passo..."
            value={stepTitle}
            onChange={(e) => setStepTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Instrução do passo..."
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            rows={2}
            value={stepInstruction}
            onChange={(e) => setStepInstruction(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddStep}
            disabled={
              isSubmitting || !stepTitle.trim() || !stepInstruction.trim()
            }
            className="w-full"
          >
            <Plus className="size-4 mr-2" />
            Adicionar Passo
          </Button>
        </div>

        {stepsError && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {stepsError}
          </p>
        )}

        {/* Steps List */}
        {steps.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {steps.length} passos adicionados
            </p>
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-background rounded"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {idx + 1}. {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {step.instruction}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStep(idx)}
                  className="text-destructive hover:bg-destructive/10 p-1 rounded"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full cursor-pointer rounded-[14px]"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          data-tour="create-task-submit"
          className="w-full cursor-pointer rounded-[14px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando..." : "Criar Tarefa"}
        </Button>
      </div>
    </form>
  );
}
