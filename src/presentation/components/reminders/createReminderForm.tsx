"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { AlertCircle, Clock } from "lucide-react";
import { toast } from "@/presentation/lib/feedbackToast";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { Reminder } from "@/domain/entities/Reminder";
import {
  REMINDER_CATEGORIES,
  REMINDER_CATEGORY_LABELS,
  type ReminderCategory,
} from "@/domain/entities/ReminderCategory";
import { cn } from "@/lib/utils";

const TITLE_MAX = 30;
const SUBMIT_DELAY_MS = 2000;

const reminderFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter pelo menos 3 caracteres.")
    .max(TITLE_MAX, `O título pode ter no máximo ${TITLE_MAX} caracteres.`),
  message: z
    .string()
    .trim()
    .min(3, "A mensagem deve ter pelo menos 3 caracteres.")
    .max(200, "A mensagem pode ter no máximo 200 caracteres."),
  category: z.enum(["medication", "appointment", "hydration", "meal", "bills"]),
  scheduledAt: z
    .string()
    .min(1, "Informe a data e a hora.")
    .refine((value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
    }, "Escolha uma data e hora no futuro."),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

const BASIC_MODE_CATEGORIES: ReminderCategory[] = ["medication", "appointment"];

export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface CreateReminderFormProps {
  initial?: Reminder;
  onSuccess?: () => void;
}

export function CreateReminderForm({
  initial,
  onSuccess,
}: CreateReminderFormProps) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const { createReminderUseCase, updateReminderUseCase } = getRemindersDi();
  const isEditing = Boolean(initial);
  const isBasicMode = preferences.interfaceMode === "basic";
  const categories = isBasicMode ? BASIC_MODE_CATEGORIES : REMINDER_CATEGORIES;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      message: initial?.message ?? "",
      category: initial?.category ?? "medication",
      scheduledAt: initial
        ? toDatetimeLocalValue(new Date(initial.scheduledAt))
        : "",
    },
  });

  async function onSubmit(values: ReminderFormValues) {
    if (!user) return;

    try {
      // Delay intencional para feedback de loading no CTA (UX de produção)
      await wait(SUBMIT_DELAY_MS);

      if (isEditing && initial) {
        await updateReminderUseCase.execute({
          id: initial.id,
          title: values.title,
          message: values.message,
          category: values.category,
          scheduledAt: new Date(values.scheduledAt),
          taskId: initial.taskId,
        });
        toast.success("Lembrete atualizado com sucesso!");
      } else {
        await createReminderUseCase.execute({
          userId: user.id,
          title: values.title,
          message: values.message,
          category: values.category,
          scheduledAt: new Date(values.scheduledAt),
        });
        toast.success("Lembrete criado com sucesso!");
        reset();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/reminders");
      }
    } catch (err) {
      console.error(
        isEditing ? "Erro ao atualizar lembrete:" : "Erro ao criar lembrete:",
        err,
      );
      toast.error(
        isEditing
          ? "Não foi possível salvar as alterações. Tente novamente."
          : "Não foi possível criar o lembrete. Tente novamente.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6" data-tour="create-reminder-basics">
        <div className="space-y-2">
          <Label htmlFor="title">
            Título do lembrete <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="title"
                  placeholder="Ex: Tomar medicamento"
                  maxLength={TITLE_MAX}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={isSubmitting}
                  className="rounded-[14px]"
                />
                <div className="flex items-center justify-between gap-2">
                  {errors.title ? (
                    <p className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="size-4" aria-hidden />
                      {errors.title.message}
                    </p>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Use um nome curto e claro
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {field.value.length}/{TITLE_MAX}
                  </span>
                </div>
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">
            Mensagem <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="message"
            placeholder="Ex: Tomar com alimento"
            rows={3}
            maxLength={200}
            className="w-full rounded-[14px] border border-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted"
            {...register("message")}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" aria-hidden />
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2" data-tour="create-reminder-category">
        <Label id="category-label">
          Categoria <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-labelledby="category-label"
            >
              {categories.map((category) => {
                const selected = field.value === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={isSubmitting}
                    onClick={() => field.onChange(category)}
                    className={cn(
                      "min-h-11 cursor-pointer rounded-[14px] border px-4 py-2 text-sm font-semibold transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {REMINDER_CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.category && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            {errors.category.message}
          </p>
        )}
      </div>

      <div className="space-y-2" data-tour="create-reminder-schedule">
        <Label htmlFor="scheduledAt" className="flex items-center gap-2">
          <Clock className="size-4" aria-hidden />
          Data e hora <span className="text-destructive">*</span>
        </Label>
        <Input
          id="scheduledAt"
          type="datetime-local"
          className="rounded-[14px]"
          {...register("scheduledAt")}
          disabled={isSubmitting}
        />
        {errors.scheduledAt && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            {errors.scheduledAt.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer rounded-[14px]"
        size="sm"
        loading={isSubmitting}
        loadingText={isEditing ? "Salvando..." : "Criando lembrete..."}
        data-tour="create-reminder-submit"
      >
        {isEditing ? "Salvar alterações" : "Criar Lembrete"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer rounded-[14px]"
        onClick={() => router.back()}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </form>
  );
}
