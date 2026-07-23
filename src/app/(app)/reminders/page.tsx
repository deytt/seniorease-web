"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell, Plus } from "lucide-react";
import { toast } from "@/presentation/lib/feedbackToast";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useRemindersListTour } from "@/presentation/hooks/useRemindersListTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { Button } from "@/presentation/components/ui/button";
import { PageHeader } from "@/presentation/components/ui/pageHeader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Reminder } from "@/domain/entities/Reminder";
import { ReminderCard } from "@/presentation/components/reminders/reminderCard";
import { ReminderFilterChips } from "@/presentation/components/reminders/reminderFilterChips";
import {
  DEFAULT_REMINDER_LIST_FILTER,
  matchesReminderListFilter,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { isReminderToday } from "@/presentation/components/reminders/reminderVisuals";
import { useSeniorFeedback } from "@/lib/feedback/useSeniorFeedback";
import { cn } from "@/lib/utils";

export default function RemindersPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[40vh] items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-base text-muted-foreground">Carregando lembretes...</p>
        </div>
      }
    >
      <RemindersPageContent />
    </Suspense>
  );
}

function RemindersPageContent() {
  const { user, loading: authLoading } = useAuthContext();
  const { preferences } = usePreferences();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<ReminderListFilter>(
    DEFAULT_REMINDER_LIST_FILTER,
  );
  const feedback = useSeniorFeedback();

  const {
    getRemindersUseCase,
    markReminderAsReadUseCase,
    deleteReminderUseCase,
  } = getRemindersDi();
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useRemindersListTour({
    userId: user?.id,
    interfaceMode: preferences.interfaceMode,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.id) return;

    const loadReminders = async () => {
      try {
        setLoading(true);
        const data = await getRemindersUseCase.execute(user.id);
        setReminders(data);
      } catch (err) {
        console.error("Erro ao carregar lembretes:", err);
        toast.error("Não foi possível carregar os lembretes. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    void loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!highlightId || loading) return;

    const target = reminders.find((r) => r.id === highlightId);
    if (!target) return;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(`reminder-${highlightId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    const clearHighlight = window.setTimeout(() => {
      router.replace("/reminders", { scroll: false });
    }, 2500);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clearHighlight);
    };
  }, [highlightId, loading, reminders, router]);

  const listFilter = useMemo<ReminderListFilter>(() => {
    if (!highlightId) return filter;
    const target = reminders.find((r) => r.id === highlightId);
    if (target && isReminderToday(target.scheduledAt)) return "today";
    return filter;
  }, [filter, highlightId, reminders]);

  const filteredReminders = useMemo(
    () =>
      reminders.filter((reminder) =>
        matchesReminderListFilter(reminder, listFilter, isReminderToday),
      ),
    [reminders, listFilter],
  );

  const pendingTodayCount = useMemo(
    () =>
      reminders.filter((r) => !r.isRead && isReminderToday(r.scheduledAt))
        .length,
    [reminders],
  );

  const handleMarkAsRead = async (reminderId: string) => {
    try {
      setBusyId(reminderId);
      await markReminderAsReadUseCase.execute(reminderId);
      feedback.success();
      setReminders((prev) =>
        prev.map((r) => (r.id === reminderId ? { ...r, isRead: true } : r)),
      );
      toast.success("Lembrete marcado como concluído!");
    } catch (err) {
      console.error("Erro ao marcar como concluído:", err);
      toast.error("Não foi possível marcar o lembrete. Tente novamente.");
    } finally {
      setBusyId(null);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    router.push(`/reminders/${reminder.id}/edit`);
  };

  const handleConfirmDelete = async () => {
    if (!reminderToDelete) return;

    try {
      setIsDeleting(true);
      await deleteReminderUseCase.execute(reminderToDelete.id);
      setReminders((prev) =>
        prev.filter((r) => r.id !== reminderToDelete.id),
      );
      toast.success("Lembrete excluído com sucesso!");
      setReminderToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir lembrete:", err);
      toast.error("Não foi possível excluir o lembrete. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando lembretes...</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <Dialog
          open={Boolean(reminderToDelete)}
          onOpenChange={(open) => {
            if (!open && !isDeleting) setReminderToDelete(null);
          }}
        >
          <DialogContent
            showCloseButton={false}
            className="gap-5 rounded-2xl border border-border bg-card p-6 shadow-modal sm:max-w-md"
          >
            <DialogHeader className="gap-3 text-left">
              <DialogTitle className="font-sans text-xl font-bold normal-case tracking-normal">
                Excluir lembrete?
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-muted-foreground">
                Tem certeza que deseja excluir o lembrete &quot;
                {reminderToDelete?.title}&quot;? Esta ação não pode ser
                desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 cursor-pointer rounded-[14px] border-border"
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                className="min-h-11 cursor-pointer rounded-[14px] bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
                loading={isDeleting}
                loadingText="Excluindo..."
                onClick={handleConfirmDelete}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PageHeader
          title="Central de Lembretes"
          description={
            pendingTodayCount === 0
              ? "Nenhum lembrete pendente para hoje"
              : pendingTodayCount === 1
                ? "1 lembrete restante hoje"
                : `${pendingTodayCount} lembretes restantes hoje`
          }
          backHref="/dashboard"
          backLabel="Voltar ao Dashboard"
          className="mb-2"
          dataTour="reminders-header"
          actions={
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              asChild
              size="sm"
              className="min-h-11 w-full shrink-0 cursor-pointer rounded-[14px] sm:w-auto"
              data-tour="reminders-create"
            >
              <Link href="/reminders/create">
                <Plus className="size-4" aria-hidden />
                Novo Lembrete
              </Link>
            </Button>
            <TourHelpButton
              onClick={beginTour}
              label="Abrir tour guiado dos lembretes"
            />
            </div>
          }
        />

        <div className="mb-6 mt-4">
          <ReminderFilterChips value={listFilter} onChange={setFilter} />
        </div>

        <div data-tour="reminders-list">
          {filteredReminders.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
              <Bell
                className="mx-auto mb-3 size-10 text-muted-foreground"
                aria-hidden
              />
              <p className="mb-1 font-semibold text-foreground">
                {reminders.length === 0
                  ? "Nenhum lembrete ainda"
                  : "Nenhum lembrete neste filtro"}
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                {reminders.length === 0
                  ? "Crie seu primeiro lembrete para receber avisos no horário certo."
                  : "Toque em outro filtro para ver mais lembretes."}
              </p>
              {reminders.length === 0 ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="cursor-pointer rounded-[14px]"
                >
                  <Link href="/reminders/create">
                    <Plus className="size-4" aria-hidden />
                    Criar Lembrete
                  </Link>
                </Button>
              ) : filter !== "today" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer rounded-[14px]"
                  onClick={() => setFilter("today")}
                >
                  Ver lembretes de hoje
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  id={`reminder-${reminder.id}`}
                  className={cn(
                    busyId === reminder.id && "pointer-events-none opacity-70",
                    highlightId === reminder.id &&
                      "rounded-[16px] ring-2 ring-primary ring-offset-2 ring-offset-background transition-shadow",
                  )}
                >
                  <ReminderCard
                    reminder={reminder}
                    onMarkDone={handleMarkAsRead}
                    onEdit={handleEdit}
                    onDelete={setReminderToDelete}
                    showDate={filter !== "today"}
                    completing={busyId === reminder.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
