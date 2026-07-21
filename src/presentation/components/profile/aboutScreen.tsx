"use client";

import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { ProfileFormPageShell } from "@/presentation/components/profile/profileFormPageShell";
import { Button } from "@/presentation/components/ui/button";
import { APP_VERSION } from "@/lib/appInfo";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useAboutTour } from "@/presentation/hooks/useAboutTour";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";

export function AboutScreen() {
  const { user } = useAuthContext();
  const { preferences } = usePreferences();
  const { showOfferDialog, beginTour, dismissOffer, offerTitle, offerDescription } =
    useAboutTour({
      userId: user?.id,
      interfaceMode: preferences.interfaceMode,
    });

  return (
    <>
      <ProfileFormPageShell
        backHref="/profile"
        backLabel="Voltar para o Perfil"
        title="Sobre o SeniorEase"
        description="Conheça o propósito do aplicativo e como ele ajuda no dia a dia."
        headerAction={
          <TourHelpButton onClick={beginTour} label="Abrir tour sobre o app" />
        }
      >
        <div className="space-y-6">
          <div
            className="rounded-[14px] border border-primary/20 bg-primary-light p-4"
            data-tour="about-purpose"
          >
            <div className="flex items-start gap-3">
              <HeartHandshake
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden
              />
              <div className="space-y-3 text-sm leading-relaxed text-[#0f172a]">
                <p>
                  O <strong>SeniorEase</strong> foi criado no contexto do
                  Hackathon FIAP Inclusive para tornar a experiência digital mais
                  acessível para pessoas idosas em ambientes acadêmicos e
                  profissionais.
                </p>
                <p className="text-[#64748b]">
                  Organize tarefas, lembretes e preferências de acessibilidade com
                  linguagem simples, botões grandes e feedback claro em cada ação.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] bg-[#f8fafc] p-4" data-tour="about-version">
            <p className="text-xs font-semibold uppercase tracking-[0.3px] text-[#94a3b8]">
              Versão
            </p>
            <p className="mt-1 text-[15px] font-medium text-[#0f172a]">
              {APP_VERSION}
            </p>
          </div>

          <div
            className="rounded-[14px] border border-[#e2e8f0] p-4"
            data-tour="about-web"
          >
            <p className="text-base font-semibold text-[#0f172a]">
              Aplicação web
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
              Você está usando a versão web do SeniorEase no navegador. Ela
              funciona no computador e no tablet.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 min-h-11 cursor-pointer rounded-[14px]"
            >
              <Link href="/dashboard">Ir para o início</Link>
            </Button>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full cursor-pointer rounded-[14px]"
          >
            <Link href="/profile">Voltar para o Perfil</Link>
          </Button>
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
