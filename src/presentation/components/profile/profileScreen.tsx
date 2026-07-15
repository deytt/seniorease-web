"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ChevronRight,
  CircleHelp,
  Info,
  Shield,
} from "lucide-react";
import type { User } from "@/domain/entities/User";
import type { UserPreferences } from "@/domain/entities/UserPreferences";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/presentation/components/profile/profileAvatar";
import { ProfileHelpCard } from "@/presentation/components/profile/profileHelpCard";
import { useProfileTour } from "@/presentation/hooks/useProfileTour";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  formatAddressDisplay,
  formatBirthDateDisplay,
  formatMemberSince,
  formatProfileValue,
  formatStreakDays,
  getNotificationSummary,
  getProfilePhoneDisplay,
} from "@/presentation/components/profile/profileUtils";

interface ProfileStats {
  totalCompleted: number;
  streak: number;
}

interface ProfileScreenProps {
  user: User;
  preferences: UserPreferences;
  stats: ProfileStats;
  statsLoading?: boolean;
  isUploadingPhoto?: boolean;
  onPhotoClick?: () => void;
}

function ProfileCard({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#e2e8f0] bg-white shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

function ProfileSectionHeader({
  title,
  editHref,
  editLabel = "Editar",
}: {
  title: string;
  editHref?: string;
  editLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold leading-7 text-[#0f172a]">{title}</h2>
      {editHref ? (
        <Link
          href={editHref}
          className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-[10px] bg-primary-light px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          {editLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ProfileInfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[14px] bg-[#f8fafc] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3px] text-[#94a3b8]">
        {label}
      </p>
      <p className="mt-1 text-[15px] font-medium leading-[1.5] text-[#0f172a]">
        {value}
      </p>
    </div>
  );
}

function ProfileStatusRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-2",
        !isLast && "border-b border-[#e2e8f0] pb-[9px] pt-2",
      )}
    >
      <span className="text-sm leading-5 text-[#64748b]">{label}</span>
      <span className="text-right text-sm font-semibold leading-5 text-[#0f172a]">
        {value}
      </span>
    </div>
  );
}

function ProfileSecurityLink({
  href,
  label,
  icon: Icon,
  iconClassName,
  showAlert = false,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  showAlert?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center justify-between rounded-[14px] border border-[#e2e8f0] p-[17px] transition-colors hover:bg-[#f8fafc]"
    >
      <span className="flex items-center gap-3">
        <Icon className={cn("size-[18px] shrink-0", iconClassName)} aria-hidden />
        <span className="text-base font-medium text-[#0f172a]">{label}</span>
      </span>
      <span className="flex items-center gap-2">
        {showAlert ? (
          <AlertCircle
            className="size-[18px] shrink-0 text-warning"
            aria-label="Ação pendente"
          />
        ) : null}
        <ChevronRight
          className="size-[18px] shrink-0 text-[#64748b]"
          aria-hidden
        />
      </span>
    </Link>
  );
}

export function ProfileScreen({
  user,
  preferences,
  stats,
  statsLoading = false,
  isUploadingPhoto = false,
  onPhotoClick,
}: ProfileScreenProps) {
  const notifications = getNotificationSummary(preferences);
  const { showOfferDialog, beginTour, dismissOffer } = useProfileTour({
    userId: user.id,
    interfaceMode: preferences.interfaceMode,
  });

  return (
    <div className="mx-auto w-full max-w-6xl pb-16">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[30px] font-bold leading-9 text-[#0f172a]">
          Meu Perfil
        </h1>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0 cursor-pointer rounded-[14px]"
          onClick={beginTour}
          aria-label="Abrir tour guiado do perfil"
        >
          <CircleHelp className="size-5" aria-hidden />
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,328px)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-4">
          <ProfileCard className="p-[25px]" data-tour="profile-photo">
            <div className="flex flex-col items-center text-center">
              <ProfileAvatar name={user.name} photoUrl={user.photoUrl} />

              <h2 className="mt-4 text-xl font-bold leading-7 text-[#0f172a]">
                {formatProfileValue(user.name)}
              </h2>
              <p className="mt-1 text-base leading-6 text-[#64748b]">
                {formatProfileValue(user.email)}
              </p>
              <p className="mt-1 text-sm leading-5 text-[#94a3b8]">
                {getProfilePhoneDisplay(user)}
              </p>

              <button
                type="button"
                onClick={onPhotoClick}
                disabled={isUploadingPhoto}
                className="mt-4 inline-flex h-[42px] w-full max-w-[278px] cursor-pointer items-center justify-center rounded-[14px] border border-[#e2e8f0] text-sm font-semibold text-primary transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingPhoto ? "Enviando..." : "Editar Foto de Perfil"}
              </button>
            </div>
          </ProfileCard>

          <ProfileCard className="p-[21px]" data-tour="profile-account-status">
            <h2 className="text-lg font-bold leading-[27px] text-[#0f172a]">
              Status da Conta
            </h2>
            <div className="mt-3 space-y-0">
              <ProfileStatusRow
                label="Membro desde"
                value={formatMemberSince(user.createdAt)}
              />
              <ProfileStatusRow
                label="Atividades concluídas"
                value={
                  statsLoading
                    ? "—"
                    : stats.totalCompleted > 0
                      ? String(stats.totalCompleted)
                      : "—"
                }
              />
              <ProfileStatusRow
                label="Melhor sequência"
                value={statsLoading ? "—" : formatStreakDays(stats.streak)}
                isLast
              />
            </div>
          </ProfileCard>

          <div data-tour="profile-help">
            <ProfileHelpCard />
          </div>
        </div>

        <div className="space-y-5">
          <ProfileCard className="p-[25px]" data-tour="profile-personal-info">
            <ProfileSectionHeader
              title="Informações Pessoais"
              editHref="/profile/edit"
            />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileInfoField
                label="Nome Completo"
                value={formatProfileValue(user.name)}
              />
              <ProfileInfoField
                label="Data de Nascimento"
                value={formatBirthDateDisplay(user.birthDate)}
              />
              <ProfileInfoField
                label="Telefone"
                value={getProfilePhoneDisplay(user)}
              />
              {preferences.interfaceMode !== "basic" ? (
                <ProfileInfoField
                  label="CPF"
                  value={formatProfileValue(user.cpf)}
                />
              ) : null}
            </div>
          </ProfileCard>

          <ProfileCard className="p-[25px]" data-tour="profile-address">
            <ProfileSectionHeader
              title="Endereço"
              editHref="/profile/edit"
            />
            <div className="mt-4">
              <ProfileInfoField
                label="Endereço completo"
                value={formatAddressDisplay(user.address)}
              />
            </div>
          </ProfileCard>

          <ProfileCard className="p-[25px]" data-tour="profile-notifications">
            <ProfileSectionHeader
              title="Preferências de Notificação"
              editHref="/profile/notifications/edit"
            />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileInfoField
                label="Notificações de tarefas"
                value={notifications.taskNotifications}
              />
              <ProfileInfoField
                label="Notificações de lembretes"
                value={notifications.reminderNotifications}
              />
            </div>
          </ProfileCard>

          <ProfileCard className="p-[25px]" data-tour="profile-account-support">
            <h2 className="text-lg font-bold leading-7 text-[#0f172a]">
              Conta e suporte
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              <ProfileSecurityLink
                href="/profile/security"
                label="Segurança"
                icon={Shield}
                iconClassName="text-secondary"
                showAlert={!user.emailVerified}
              />
              <ProfileSecurityLink
                href="/about"
                label="Sobre o SeniorEase"
                icon={Info}
                iconClassName="text-primary"
              />
            </div>
          </ProfileCard>
        </div>
      </div>

      <Dialog open={showOfferDialog} onOpenChange={(open) => !open && dismissOffer()}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Quer um tour guiado do perfil?</DialogTitle>
            <DialogDescription>
              Em poucos passos, mostramos cada área do perfil — foto, dados,
              notificações, segurança e onde pedir ajuda.
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
