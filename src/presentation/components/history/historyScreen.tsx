"use client";

import type { ReactNode } from "react";
import { Award, CircleHelp } from "lucide-react";
import type { HistoryEvent } from "@/domain/entities/HistoryEvent";
import type { InterfaceMode } from "@/domain/entities/UserPreferences";
import { cn } from "@/lib/utils";
import { useHistoryTour } from "@/presentation/hooks/useHistoryTour";
import {
  HISTORY_STAT_CARDS,
  filterHistoryEventsForMode,
  formatHistoryEventDate,
  getHistoryEventVisual,
  getStreakBannerDescription,
  getStreakBannerTitle,
  shouldShowStreakBanner,
  type HistoryStatsView,
} from "@/presentation/components/history/historyUtils";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";

interface HistoryScreenProps {
  userId: string;
  events: HistoryEvent[];
  stats: HistoryStatsView;
  interfaceMode: InterfaceMode;
  loading?: boolean;
  error?: string | null;
}

function HistoryCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#e2e8f0] bg-white shadow-card",
        className,
      )}
    >
      {children}
    </section>
  );
}

function HistoryStatCard({
  icon: Icon,
  iconWrapClassName,
  value,
  label,
}: {
  icon: (typeof HISTORY_STAT_CARDS)[number]["icon"];
  iconWrapClassName: string;
  value: string;
  label: string;
}) {
  return (
    <HistoryCard className="flex flex-col items-center p-5 text-center">
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-[14px]",
          iconWrapClassName,
        )}
      >
        <Icon className="size-[22px]" aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-black leading-8 text-[#0f172a]">{value}</p>
      <p className="mt-1 text-sm leading-5 text-[#64748b]">{label}</p>
    </HistoryCard>
  );
}

function HistoryTimelineEvent({ event }: { event: HistoryEvent }) {
  const visual = getHistoryEventVisual(event);
  const Icon = visual.icon;

  return (
    <div className="flex w-full items-center gap-4">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          visual.ringClassName,
        )}
        aria-hidden
      >
        <Icon className="size-3.5" />
      </div>

      <HistoryCard className="min-w-0 flex-1 p-[17px]">
        <p className="text-[15px] font-semibold leading-[22.5px] text-[#0f172a]">
          {event.title}
        </p>
        <p className="mt-1 text-sm leading-5 text-[#94a3b8]">
          {formatHistoryEventDate(event.occurredAt)}
        </p>
      </HistoryCard>
    </div>
  );
}

export function HistoryScreen({
  userId,
  events,
  stats,
  interfaceMode,
  loading = false,
  error = null,
}: HistoryScreenProps) {
  const visibleEvents = filterHistoryEventsForMode(events, interfaceMode);
  const showStreakBanner = shouldShowStreakBanner(stats.streak);
  const { showOfferDialog, beginTour, dismissOffer } = useHistoryTour({
    userId,
    interfaceMode,
  });

  return (
    <div className="pb-20">
      <header className="mb-8 flex items-start justify-between gap-4" data-tour="history-header">
        <div>
          <h1 className="text-[30px] font-bold leading-9 text-[#0f172a]">
            Histórico de Atividades
          </h1>
          <p className="mt-2 text-base leading-6 text-[#64748b]">
            Parabéns! Você tem sido muito consistente.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0 cursor-pointer rounded-[14px]"
          onClick={beginTour}
          aria-label="Abrir tour guiado do histórico"
        >
          <CircleHelp className="size-5" aria-hidden />
        </Button>
      </header>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        data-tour="history-stats"
      >
        {HISTORY_STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = loading ? "—" : card.getValue(stats);

          return (
            <HistoryStatCard
              key={card.key}
              icon={Icon}
              iconWrapClassName={card.iconWrapClassName}
              value={value}
              label={card.label}
            />
          );
        })}
      </div>

      {showStreakBanner ? (
        <div
          className="mt-8 flex items-center gap-4 rounded-2xl border border-[#e2e8f0] p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
          style={{
            backgroundImage:
              "linear-gradient(174.58deg, rgba(245, 158, 11, 0.133) 0%, rgb(255, 251, 235) 100%)",
          }}
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f59e0b] text-white">
            <Award className="size-7" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-7 text-[#0f172a]">
              {getStreakBannerTitle(stats.streak)}
            </p>
            <p className="mt-0.5 text-base leading-6 text-[#64748b]">
              {getStreakBannerDescription(stats.streak)}
            </p>
          </div>
        </div>
      ) : null}

      <section className="mt-8" data-tour="history-activity">
        <h2 className="text-xl font-bold leading-[30px] text-[#0f172a]">
          Atividade Recente
        </h2>

        {error ? (
          <div
            className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-4"
            role="alert"
          >
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : null}

        {loading ? (
          <HistoryCard className="mt-4 p-8 text-center">
            <p className="text-base text-[#64748b]">Carregando histórico...</p>
          </HistoryCard>
        ) : visibleEvents.length === 0 ? (
          <HistoryCard className="mt-4 p-12 text-center">
            <p className="text-base text-[#64748b]">
              Nenhuma atividade no histórico ainda.
            </p>
          </HistoryCard>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {visibleEvents.map((event) => (
              <HistoryTimelineEvent key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <Dialog open={showOfferDialog} onOpenChange={(open) => !open && dismissOffer()}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Quer um tour guiado do histórico?</DialogTitle>
            <DialogDescription>
              Em poucos passos, mostramos como acompanhar suas estatísticas,
              sequência de dias e atividades recentes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer rounded-[14px]"
              onClick={dismissOffer}
            >
              Agora não
            </Button>
            <Button
              type="button"
              className="cursor-pointer rounded-[14px]"
              onClick={beginTour}
            >
              Começar tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
