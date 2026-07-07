"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getRemindersDi } from "@/lib/di/remindersDi";

const createReminderSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres."),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres."),
  scheduledAt: z.string().min(1, "Data e hora são obrigatórios."),
  taskRelated: z.boolean(),
});

type CreateReminderFormValues = z.infer<typeof createReminderSchema>;

interface CreateReminderFormProps {
  onSuccess?: () => void;
}

export function CreateReminderForm({ onSuccess }: CreateReminderFormProps) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { createReminderUseCase } = getRemindersDi();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateReminderFormValues>({
    resolver: zodResolver(createReminderSchema),
    defaultValues: {
      title: "",
      message: "",
      scheduledAt: "",
      taskRelated: false,
    },
  });

  async function onSubmit(values: CreateReminderFormValues) {
    if (!user) return;

    try {
      await createReminderUseCase.execute({
        userId: user.id,
        title: values.title,
        message: values.message,
        scheduledAt: new Date(values.scheduledAt),
      });

      reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/reminders");
      }
    } catch (err) {
      console.error("Erro ao criar lembrete:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título do Lembrete</Label>
        <Input
          id="title"
          placeholder="Ex: Tomar medicamento"
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

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <textarea
          id="message"
          placeholder="Descreva o lembrete em detalhes..."
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
          rows={4}
          {...register("message")}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Scheduled Date & Time */}
      <div className="space-y-2">
        <Label htmlFor="scheduledAt" className="flex items-center gap-2">
          <Clock className="size-4" />
          Data e Hora
        </Label>
        <Input
          id="scheduledAt"
          type="datetime-local"
          {...register("scheduledAt")}
          disabled={isSubmitting}
        />
        {errors.scheduledAt && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="size-4" />
            {errors.scheduledAt.message}
          </p>
        )}
      </div>

      {/* Task Related */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Checkbox
          id="taskRelated"
          {...register("taskRelated")}
          disabled={isSubmitting}
        />
        <Label htmlFor="taskRelated" className="cursor-pointer flex-1">
          Este lembrete está relacionado a uma atividade
        </Label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Criando..." : "Criar Lembrete"}
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
