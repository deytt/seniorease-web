"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "@/presentation/lib/feedbackToast";
import {
  NOTIFICATION_OFFSET_OPTIONS,
  type NotificationOffset,
} from "@/domain/entities/UserPreferences";
import { cn } from "@/lib/utils";
import { Button } from "@/presentation/components/ui/button";
import { Label } from "@/presentation/components/ui/label";
import { useAccessibility } from "@/presentation/hooks/useAccessibility";
import { usePreferencesStore } from "@/presentation/providers/PreferencesProvider";

type NotificationDraft = {
  tasksNotificationsEnabled: boolean;
  taskNotificationOffset: NotificationOffset;
  remindersNotificationsEnabled: boolean;
  reminderNotificationOffset: NotificationOffset;
};

export function EditNotificationPreferencesForm() {
  const router = useRouter();
  const { preferences, isLoaded, isSaving } = useAccessibility();
  const update = usePreferencesStore((state) => state.update);
  const [draft, setDraft] = useState<NotificationDraft | null>(null);

  const values = useMemo<NotificationDraft | null>(() => {
    if (!isLoaded) return null;
    return (
      draft ?? {
        tasksNotificationsEnabled: preferences.tasksNotificationsEnabled,
        taskNotificationOffset: preferences.taskNotificationOffset,
        remindersNotificationsEnabled: preferences.remindersNotificationsEnabled,
        reminderNotificationOffset: preferences.reminderNotificationOffset,
      }
    );
  }, [draft, isLoaded, preferences]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values) return;

    try {
      await update({
        tasksNotificationsEnabled: values.tasksNotificationsEnabled,
        taskNotificationOffset: values.taskNotificationOffset,
        remindersNotificationsEnabled: values.remindersNotificationsEnabled,
        reminderNotificationOffset: values.reminderNotificationOffset,
      });
      toast.success("Preferências de notificação salvas!");
      router.push("/profile");
    } catch (err) {
      console.error("Erro ao salvar preferências:", err);
      toast.error("Não foi possível salvar as preferências. Tente novamente.");
    }
  };

  const patchDraft = (patch: Partial<NotificationDraft>) => {
    setDraft((current) => ({
      ...(current ?? {
        tasksNotificationsEnabled: preferences.tasksNotificationsEnabled,
        taskNotificationOffset: preferences.taskNotificationOffset,
        remindersNotificationsEnabled: preferences.remindersNotificationsEnabled,
        reminderNotificationOffset: preferences.reminderNotificationOffset,
      }),
      ...patch,
    }));
  };

  if (!isLoaded || !values) {
    return (
      <p className="text-base text-[#64748b]" role="status">
        Carregando preferências...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6" data-tour="notif-tasks">
      <PreferenceToggle
        id="task-notifications"
        label="Notificações de tarefas"
        description="Receba avisos push quando uma tarefa estiver próxima do horário."
        checked={values.tasksNotificationsEnabled}
        onChange={(tasksNotificationsEnabled) =>
          patchDraft({ tasksNotificationsEnabled })
        }
        disabled={isSaving}
      />

      {values.tasksNotificationsEnabled ? (
        <OffsetPicker
          id="task-offset"
          label="Antecedência das tarefas"
          value={values.taskNotificationOffset}
          onChange={(taskNotificationOffset) => patchDraft({ taskNotificationOffset })}
          disabled={isSaving}
        />
      ) : null}
      </div>

      <div className="space-y-6" data-tour="notif-reminders">
      <PreferenceToggle
        id="reminder-notifications"
        label="Notificações de lembretes"
        description="Receba avisos push quando um lembrete estiver próximo do horário."
        checked={values.remindersNotificationsEnabled}
        onChange={(remindersNotificationsEnabled) =>
          patchDraft({ remindersNotificationsEnabled })
        }
        disabled={isSaving}
      />

      {values.remindersNotificationsEnabled ? (
        <OffsetPicker
          id="reminder-offset"
          label="Antecedência dos lembretes"
          value={values.reminderNotificationOffset}
          onChange={(reminderNotificationOffset) =>
            patchDraft({ reminderNotificationOffset })
          }
          disabled={isSaving}
        />
      ) : null}
      </div>

      <Button
        type="submit"
        data-tour="notif-save"
        className="w-full cursor-pointer rounded-[14px]"
        size="lg"
        loading={isSaving}
        loadingText="Salvando..."
      >
        Salvar alterações
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer rounded-[14px]"
        onClick={() => router.push("/profile")}
        disabled={isSaving}
      >
        Cancelar
      </Button>
    </form>
  );
}

function PreferenceToggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-[#e2e8f0] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label htmlFor={id} className="text-base font-semibold text-[#0f172a]">
            {label}
          </Label>
          <p className="mt-1 text-sm text-[#64748b]">{description}</p>
        </div>
        <button
          id={id}
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          disabled={disabled}
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
            checked
              ? "bg-primary"
              : "border-2 border-[#e2e8f0] bg-white hover:border-primary/40",
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer",
          )}
        >
          {checked ? (
            <Check className="size-4 text-white" strokeWidth={3} aria-hidden />
          ) : null}
        </button>
      </div>
    </div>
  );
}

function OffsetPicker({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: NotificationOffset;
  onChange: (value: NotificationOffset) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Label id={`${id}-label`} className="block">
        {label}
      </Label>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-labelledby={`${id}-label`}
      >
        {NOTIFICATION_OFFSET_OPTIONS.map((option) => (
          <PreferenceChoice
            key={option.value}
            selected={value === option.value}
            label={option.label}
            onClick={() => onChange(option.value)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function PreferenceChoice({
  selected,
  label,
  onClick,
  disabled,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8fafc]",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      {label}
    </button>
  );
}
