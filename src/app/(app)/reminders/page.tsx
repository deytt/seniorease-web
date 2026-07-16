"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { getRemindersDi } from "@/lib/di/remindersDi";
import { Button } from "@/presentation/components/ui/button";
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
import {
  ReminderFilterPills,
  matchesReminderFilter,
  useReminderListFilter,
} from "@/presentation/components/reminders/reminderFilterPills";
import { isReminderToday } from "@/presentation/components/reminders/reminderVisuals";

export default function RemindersPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { preferences } = usePreferences();
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { filter, setFilter } = useReminderListFilter({ kind: "all" });

  const isBasicMode = preferences.interfaceMode === "basic";
  const {
    getRemindersUseCase,
    markReminderAsReadUseCase,
    deleteReminderUseCase,
  } = getRemindersDi();

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

  const filteredReminders = useMemo(
    () =>
      reminders.filter((reminder) =>
        matchesReminderFilter(reminder, filter, isReminderToday),
      ),
    [reminders, filter],
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
      <div className="mx-auto w-full max-w-5xl">
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
                  className="min-h-11 cursor-pointer rounded-[14px] border-[#e2e8f0]"
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                className="min-h-11 cursor-pointer rounded-[14px] bg-destructive text-white hover:bg-destructive/90 hover:text-white"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-[#0f172a] sm:text-3xl">
              Central de Lembretes
            </h1>
            <p className="mt-1 text-base text-[#64748b]">
              {pendingTodayCount === 0
                ? "Nenhum lembrete pendente para hoje"
                : pendingTodayCount === 1
                  ? "1 lembrete restante hoje"
                  : `${pendingTodayCount} lembretes restantes hoje`}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="min-h-11 w-full shrink-0 cursor-pointer rounded-[14px] sm:w-auto"
          >
            <Link href="/reminders/create">
              <Plus className="size-4" aria-hidden />
              Novo Lembrete
            </Link>
          </Button>
        </div>

        <div className="mb-6 mt-4">
          <ReminderFilterPills
            value={filter}
            onChange={setFilter}
            isBasicMode={isBasicMode}
          />
        </div>

        {filteredReminders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
            <Bell
              className="mx-auto mb-3 size-10 text-muted-foreground"
              aria-hidden
            />
            <p className="mb-1 font-semibold text-[#0f172a]">
              {reminders.length === 0
                ? "Nenhum lembrete ainda"
                : "Nenhum lembrete neste filtro"}
            </p>
            <p className="mb-4 text-sm text-[#64748b]">
              {reminders.length === 0
                ? "Crie seu primeiro lembrete para receber avisos no horário certo."
                : "Tente outro filtro para ver mais lembretes."}
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
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer rounded-[14px]"
                onClick={() => setFilter({ kind: "all" })}
              >
                Ver todos
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={
                  busyId === reminder.id
                    ? "pointer-events-none opacity-70"
                    : undefined
                }
              >
                <ReminderCard
                  reminder={reminder}
                  onMarkDone={handleMarkAsRead}
                  onEdit={handleEdit}
                  onDelete={setReminderToDelete}
                  showDate={filter.kind !== "today"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
