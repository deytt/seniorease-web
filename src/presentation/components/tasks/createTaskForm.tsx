"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { AlertCircle, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getTasksDi } from "@/lib/di/tasksDi";
import { useState } from "react";

const createTaskSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres."),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres."),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  category: z
    .enum(["medication", "health", "exercise", "social", "personal"])
    .optional(),
  reminderTime: z.string().optional(),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      category: "personal",
      reminderTime: "",
    },
  });

  const handleAddStep = () => {
    if (stepTitle.trim() && stepInstruction.trim()) {
      setSteps([
        ...steps,
        {
          order: steps.length,
          title: stepTitle,
          instruction: stepInstruction,
        },
      ]);
      setStepTitle("");
      setStepInstruction("");
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  async function onSubmit(values: CreateTaskFormValues) {
    if (!user) return;

    try {
      await createTaskUseCase.execute({
        userId: user.id,
        title: values.title,
        description: values.description,
        steps: steps,
        dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
        priority: values.priority,
        category: values.category,
        reminderTime: values.reminderTime,
      });

      reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/tasks");
      }
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título da Atividade</Label>
        <Input
          id="title"
          placeholder="Ex: Fazer compras no mercado"
          {...register("title")}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <textarea
          id="description"
          placeholder="Descreva a atividade em detalhes..."
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
          rows={4}
          {...register("description")}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate">Data de Vencimento (Opcional)</Label>
        <Input
          id="dueDate"
          type="date"
          {...register("dueDate")}
          disabled={isSubmitting}
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority">Prioridade (Opcional)</Label>
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
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoria (Opcional)</Label>
        <select
          id="category"
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
          {...register("category")}
          disabled={isSubmitting}
        >
          <option value="personal">Pessoal</option>
          <option value="medication">Medicação</option>
          <option value="health">Saúde</option>
          <option value="exercise">Exercício</option>
          <option value="social">Social</option>
        </select>
      </div>

      {/* Reminder Time */}
      <div className="space-y-2">
        <Label htmlFor="reminderTime">Horário de Lembrete (Opcional)</Label>
        <Input
          id="reminderTime"
          type="time"
          placeholder="HH:mm"
          {...register("reminderTime")}
          disabled={isSubmitting}
        />
      </div>

      {/* Steps Section */}
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold">Passos (Opcional)</h3>

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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Criando..." : "Criar Atividade"}
      </Button>

      {/* Cancel Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => router.back()}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </form>
  );
}
