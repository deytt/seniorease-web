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
              <div className="space-y-3 text-sm leading-relaxed text-foreground">
                <p>
                  O <strong>SeniorEase</strong> foi criado no contexto do
                  Hackathon FIAP Inclusive para tornar a experiência digital mais
                  acessível para pessoas idosas em ambientes acadêmicos e
                  profissionais.
                </p>
                <p className="text-muted-foreground">
                  Organize tarefas, lembretes e preferências de acessibilidade com
                  linguagem simples, botões grandes e feedback claro em cada ação.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] bg-muted p-4" data-tour="about-version">
            <p className="text-sm font-semibold uppercase tracking-[0.3px] text-muted-foreground">
              Versão
            </p>
            <p className="mt-1 text-[15px] font-medium text-foreground">
              {APP_VERSION}
            </p>
          </div>

          <div
            className="rounded-[14px] border border-border p-4"
            data-tour="about-web"
          >
            <p className="text-base font-semibold text-foreground">
              Aplicação web
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
