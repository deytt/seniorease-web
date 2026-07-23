"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import { BackNavigationButton } from "@/presentation/components/ui/backNavigationButton";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { CreateReminderForm } from "@/presentation/components/reminders/createReminderForm";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { Reminder } from "@/domain/entities/Reminder";

export default function EditReminderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { reminderRepository } = getRemindersDi();
  const reminderId = params.id;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.id || !reminderId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reminderRepository.getReminderById(reminderId);
        if (!data || data.userId !== user.id) {
          setError("Lembrete não encontrado.");
          setReminder(null);
          return;
        }
        if (data.isRead) {
          setError("Lembretes concluídos não podem ser editados.");
          setReminder(null);
          return;
        }
        setReminder(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar lembrete",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, reminderId]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando lembrete...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <BackNavigationButton
        href="/reminders"
        label="Voltar para Lembretes"
        className="mb-6"
      />

      <div className="mb-8">
        <h1 className="page-title mb-2">Editar Lembrete</h1>
        <p className="text-muted-foreground">
          Altere os dados do lembrete e salve. A data e hora precisam estar no
          futuro.
        </p>
      </div>

      {error || !reminder ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive-light p-4"
          role="alert"
        >
          <p className="mb-4 text-sm text-destructive">
            {error ?? "Lembrete não encontrado."}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/reminders">Voltar para a lista</Link>
          </Button>
        </div>
      ) : (
        <Card className="rounded-2xl border border-border shadow-card">
          <CardContent className="p-6">
            <CreateReminderForm initial={reminder} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
