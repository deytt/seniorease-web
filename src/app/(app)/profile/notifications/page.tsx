"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Bell, ClipboardList, Save } from "lucide-react";

import type {
  NotificationOffset,
  UserPreferences,
} from "@/domain/entities/UserPreferences";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Switch } from "@/presentation/components/ui/switch";
import {
  usePreferencesStore,
} from "@/presentation/providers/PreferencesProvider";
import { cn } from "@/lib/utils";
import { backNavButtonClassName } from "@/presentation/lib/backNavButtonClassName";

const OFFSET_OPTIONS: Array<{ value: NotificationOffset; label: string }> = [
  { value: "15m", label: "15 minutos antes" },
  { value: "30m", label: "30 minutos antes" },
  { value: "1h", label: "1 hora antes" },
  { value: "6h", label: "6 horas antes" },
  { value: "1d", label: "1 dia antes" },
];

type NotificationDraft = Pick<
  UserPreferences,
  | "tasksNotificationsEnabled"
  | "taskNotificationOffset"
  | "remindersNotificationsEnabled"
  | "reminderNotificationOffset"
>;

function toNotificationDraft(preferences: UserPreferences): NotificationDraft {
  return {
    tasksNotificationsEnabled: preferences.tasksNotificationsEnabled,
    taskNotificationOffset: preferences.taskNotificationOffset,
    remindersNotificationsEnabled: preferences.remindersNotificationsEnabled,
    reminderNotificationOffset: preferences.reminderNotificationOffset,
  };
}

export default function NotificationPreferencesPage() {
  const preferences = usePreferencesStore((state) => state.preferences);
  const isLoaded = usePreferencesStore((state) => state.isLoaded);
  const isSaving = usePreferencesStore((state) => state.isSaving);
  const update = usePreferencesStore((state) => state.update);
  const [draft, setDraft] = useState<NotificationDraft | null>(null);

  const values = useMemo<NotificationDraft | null>(() => {
    if (!isLoaded) return null;
    return draft ?? toNotificationDraft(preferences);
  }, [draft, isLoaded, preferences]);

  const updateDraft = <K extends keyof NotificationDraft>(
    key: K,
    value: NotificationDraft[K],
  ) => {
    setDraft((current) => ({
      ...(current ?? toNotificationDraft(preferences)),
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!values) return;

    try {
      await update(values);
      toast.success("Preferências de notificação salvas.");
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    }
  };

  if (!isLoaded || !values) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">
          Carregando suas preferências...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-20">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn("mb-4", backNavButtonClassName)}
      >
        <Link href="/profile">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Notificações
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha quando deseja receber avisos das suas tarefas e lembretes.
        </p>
      </div>

      <div className="space-y-6">
        <NotificationSection
          icon={<ClipboardList className="size-5 text-primary" />}
          iconBackgroundClassName="bg-primary-light"
          title="Tarefas"
          description="Receba um aviso antes do horário de uma tarefa."
          enabled={values.tasksNotificationsEnabled}
          offset={values.taskNotificationOffset}
          onEnabledChange={(value) =>
            updateDraft("tasksNotificationsEnabled", value)
          }
          onOffsetChange={(value) =>
            updateDraft("taskNotificationOffset", value)
          }
        />

        <NotificationSection
          icon={<Bell className="size-5 text-secondary" />}
          iconBackgroundClassName="bg-secondary-light"
          title="Lembretes"
          description="Receba um aviso antes do horário de um lembrete."
          enabled={values.remindersNotificationsEnabled}
          offset={values.reminderNotificationOffset}
          onEnabledChange={(value) =>
            updateDraft("remindersNotificationsEnabled", value)
          }
          onOffsetChange={(value) =>
            updateDraft("reminderNotificationOffset", value)
          }
        />

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="size-5" />
          {isSaving ? "Salvando..." : "Salvar configurações"}
        </Button>
      </div>
    </div>
  );
}

interface NotificationSectionProps {
  icon: ReactNode;
  iconBackgroundClassName: string;
  title: string;
  description: string;
  enabled: boolean;
  offset: NotificationOffset;
  onEnabledChange: (enabled: boolean) => void;
  onOffsetChange: (offset: NotificationOffset) => void;
}

function NotificationSection({
  icon,
  iconBackgroundClassName,
  title,
  description,
  enabled,
  offset,
  onEnabledChange,
  onOffsetChange,
}: NotificationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              iconBackgroundClassName,
            )}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Avisar antes de {title.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground">
              {enabled ? "Os avisos estão ativados." : "Os avisos estão pausados."}
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
            aria-label={`Ativar avisos de ${title.toLowerCase()}`}
          />
        </div>

        <div
          className={cn(
            "rounded-xl border border-border p-4 transition-opacity",
            !enabled && "opacity-45",
          )}
        >
          <p className="text-sm font-semibold text-foreground">
            Antecedência do aviso
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Quanto tempo antes quer ser avisado.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {OFFSET_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={!enabled}
                aria-pressed={offset === option.value}
                onClick={() => onOffsetChange(option.value)}
                className={cn(
                  "min-h-11 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                  offset === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50",
                  !enabled && "cursor-not-allowed",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
