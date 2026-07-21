"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Mail,
} from "lucide-react";
import { ProfileFormPageShell } from "@/presentation/components/profile/profileFormPageShell";
import { EmailVerificationForm } from "@/presentation/components/profile/emailVerificationForm";
import { SecurityForm } from "@/presentation/components/profile/securityForm";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useSecurityTour } from "@/presentation/hooks/useSecurityTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";
import { cn } from "@/lib/utils";

function SecurityStatusBadge({
  verified,
}: {
  verified: boolean;
}) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
        <CheckCircle2 className="size-4" aria-hidden />
        Verificada
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-sm font-semibold text-warning">
      <AlertCircle className="size-4" aria-hidden />
      Não verificado
    </span>
  );
}

export function SecurityScreen() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const { preferences } = usePreferences();
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const { showOfferDialog, beginTour, dismissOffer, offerTitle, offerDescription } =
    useSecurityTour({
      userId: user?.id,
      interfaceMode: preferences.interfaceMode,
    });

  if (loading || !user) {
    return (
      <div
        className="flex min-h-40 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Carregando segurança da conta</span>
      </div>
    );
  }

  const isEmailVerified = user.emailVerified ?? false;

  return (
    <>
      <ProfileFormPageShell
        backHref="/profile"
        backLabel="Voltar para o Perfil"
        title="Segurança"
        description="Gerencie a verificação da sua conta e a senha de acesso."
        headerAction={
          <TourHelpButton
            onClick={beginTour}
            label="Abrir tour guiado de segurança"
          />
        }
      >
        <div className="space-y-8">
          <section className="space-y-4" data-tour="security-verify">
            <h2 className="text-lg font-bold text-[#0f172a]">Verificar conta</h2>

            <button
              type="button"
              className={cn(
                "flex min-h-11 w-full items-center justify-between rounded-[14px] border border-[#e2e8f0] p-[17px] text-left transition-colors",
                !isEmailVerified && "cursor-pointer hover:bg-[#f8fafc]",
              )}
              onClick={() => {
                if (!isEmailVerified) {
                  setShowEmailPanel((current) => !current);
                }
              }}
              disabled={isEmailVerified}
              aria-expanded={!isEmailVerified ? showEmailPanel : undefined}
            >
              <span className="flex items-center gap-3">
                <Mail className="size-[18px] shrink-0 text-primary" aria-hidden />
                <span className="text-base font-medium text-[#0f172a]">
                  Verificar conta (e-mail)
                </span>
              </span>

              <span className="flex items-center gap-2">
                <SecurityStatusBadge verified={isEmailVerified} />
                {!isEmailVerified ? (
                  <ChevronRight
                    className={cn(
                      "size-[18px] shrink-0 text-[#64748b] transition-transform",
                      showEmailPanel && "rotate-90",
                    )}
                    aria-hidden
                  />
                ) : null}
              </span>
            </button>

            {isEmailVerified ? (
              <p className="text-sm leading-relaxed text-[#64748b]">
                Seu e-mail está confirmado. Sua conta está protegida.
              </p>
            ) : showEmailPanel ? (
              <EmailVerificationForm />
            ) : (
              <p className="text-sm leading-relaxed text-[#64748b]">
                Toque na opção acima para enviar o link de verificação para{" "}
                <strong className="font-medium text-[#0f172a]">{user.email}</strong>.
              </p>
            )}
          </section>

          <section
            className="space-y-4 border-t border-[#e2e8f0] pt-8"
            data-tour="security-password"
          >
            <h2 className="text-lg font-bold text-[#0f172a]">Alterar senha</h2>
            <SecurityForm onSuccess={() => router.push("/profile")} />
          </section>
        </div>
      </ProfileFormPageShell>

      <TourOfferDialog
        open={showOfferDialog}
        title={offerTitle}
        description={offerDescription}
        onDismiss={dismissOffer}
        onStart={beginTour}
      />
    </>
  );
}
