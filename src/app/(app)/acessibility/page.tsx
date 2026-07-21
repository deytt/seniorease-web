"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useAccessibility } from "@/presentation/hooks/useAccessibility";
import { useAccessibilityTour } from "@/presentation/hooks/useAccessibilityTour";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/presentation/components/ui/dialog";
import {
  TourHelpButton,
  TourOfferDialog,
} from "@/presentation/tour/TourChrome";
import { backNavButtonClassName } from "@/presentation/lib/backNavButtonClassName";
import { cn } from "@/lib/utils";

interface ToggleRowProps {
  emoji: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({
  emoji,
  label,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors min-h-[56px] text-left"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {emoji}
        </span>
        <div>
          <p className="font-medium text-sm">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "relative w-12 h-6 rounded-full border transition-colors flex-shrink-0 ml-3",
          checked ? "border-primary bg-primary" : "border-border bg-input",
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform",
            checked ? "translate-x-6" : "translate-x-0.5",
          )}
        />
      </div>
    </button>
  );
}

export default function AccessibilityCenterPage() {
  const { user } = useAuthContext();
  const { preferences, isLoaded, isSaving, setField, resetToDefaults } =
    useAccessibility();
  const {
    showOfferDialog,
    beginTour,
    dismissOffer,
    offerTitle,
    offerDescription,
  } = useAccessibilityTour({
    userId: user?.id,
    interfaceMode: preferences.interfaceMode,
  });

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && isLoaded) {
      const t = setTimeout(() => {
        setIsSaved(true);
        const r = setTimeout(() => setIsSaved(false), 2000);
        return () => clearTimeout(r);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isSaving, isLoaded]);

  const fontSizeLabel =
    preferences.fontSize === "small"
      ? "Pequena (88%)"
      : preferences.fontSize === "medium"
        ? "Média (100%)"
        : preferences.fontSize === "large"
          ? "Grande (113%)"
          : "Extra Grande (125%)";

  const fontSizeValue =
    preferences.fontSize === "small"
      ? 0
      : preferences.fontSize === "medium"
        ? 1
        : preferences.fontSize === "large"
          ? 2
          : 3;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p role="status" aria-live="polite" className="text-lg text-muted-foreground">
          Carregando suas preferências...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className={cn("mb-4", backNavButtonClassName)}
              aria-label="Voltar ao Dashboard"
            >
              <ArrowLeft className="size-4 mr-2" aria-hidden="true" />
              Voltar
            </Button>
          </Link>
          <div
            className="flex items-start justify-between gap-3"
            data-tour="a11y-header"
          >
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold">
                Configurações de Acessibilidade
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ajuste a aparência do app para facilitar o uso. As mudanças são
                salvas automaticamente.
              </p>
            </div>
            <TourHelpButton
              onClick={beginTour}
              label="Abrir tour guiado de acessibilidade"
            />
          </div>
        </div>
      </div>

      <div
        className="max-w-2xl mx-auto p-4 md:p-6 space-y-6 a11y-space-section"
        role="main"
        aria-label="Configurações de acessibilidade"
      >
        <Card data-tour="a11y-font">
          <CardContent className="pt-6 a11y-space-card">
            <div className="mb-4">
              <label
                htmlFor="font-size-slider"
                className="text-sm font-semibold text-foreground"
              >
                Tamanho da Fonte
              </label>
              <p
                id="font-size-desc"
                className="text-xs text-muted-foreground mt-1"
              >
                Atual: {fontSizeLabel}
              </p>
            </div>

            <div className="space-y-3">
              <input
                id="font-size-slider"
                type="range"
                min="0"
                max="3"
                step="1"
                aria-describedby="font-size-desc"
                aria-valuetext={fontSizeLabel}
                value={fontSizeValue}
                onChange={(e) => {
                  const sizes = [
                    "small",
                    "medium",
                    "large",
                    "extra_large",
                  ] as const;
                  setField("fontSize", sizes[parseInt(e.target.value)]);
                }}
                className="font-size-slider w-full h-2 rounded-full appearance-none cursor-pointer bg-input accent-primary"
              />
              <div
                className="flex justify-between text-xs text-muted-foreground"
                aria-hidden="true"
              >
                <span>Pequena</span>
                <span>Média</span>
                <span>Grande</span>
                <span>Extra Grande</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-tour="a11y-mode">
          <CardContent className="pt-6 a11y-space-card">
            <fieldset>
              <legend className="text-sm font-semibold text-foreground mb-1">
                Modo de Interface
              </legend>
              <p className="text-xs text-muted-foreground mb-3">
                O Modo Básico simplifica a interface, ocultando elementos menos
                essenciais.
              </p>
              <div className="flex gap-3" role="group">
                {(["basic", "advanced"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={preferences.interfaceMode === mode}
                    onClick={() => setField("interfaceMode", mode)}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg border font-medium transition-colors min-h-[44px]",
                      preferences.interfaceMode === mode
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {mode === "basic" ? "Básico" : "Avançado"}
                  </button>
                ))}
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <Card data-tour="a11y-spacing">
          <CardContent className="pt-6 a11y-space-card">
            <fieldset>
              <legend className="text-sm font-semibold text-foreground mb-1">
                Espaçamento entre Elementos
              </legend>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Controla o espaço entre botões, cards e campos do formulário.
              </p>
              <div className="grid grid-cols-3 gap-3" role="group">
                {(
                  [
                    {
                      key: "compact",
                      label: "Compacto",
                      sublabel: "Menos espaço",
                      emoji: "⬛",
                    },
                    {
                      key: "comfortable",
                      label: "Confortável",
                      sublabel: "Espaço padrão",
                      emoji: "🔲",
                    },
                    {
                      key: "spacious",
                      label: "Espaçoso",
                      sublabel: "Mais espaço",
                      emoji: "⬜",
                    },
                  ] as const
                ).map(({ key, label, sublabel, emoji }) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={preferences.spacing === key}
                    onClick={() => setField("spacing", key)}
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-4 rounded-xl border-2 font-medium transition-colors min-h-[80px]",
                      preferences.spacing === key
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {emoji}
                    </span>
                    <span className="text-xs font-semibold">{label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {sublabel}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <Card data-tour="a11y-toggles">
          <CardContent className="pt-6 a11y-space-card">
            <p className="text-sm font-semibold text-foreground mb-4">
              Ajustes Rápidos
            </p>
            <div className="space-y-1 divide-y divide-border">
              <ToggleRow
                emoji="🌙"
                label="Modo Escuro"
                description="Fundo escuro para reduzir o cansaço visual"
                checked={preferences.darkMode}
                onChange={(v) => setField("darkMode", v)}
              />
              <ToggleRow
                emoji="◑"
                label="Alto Contraste"
                description="Bordas e textos mais definidos para maior legibilidade"
                checked={preferences.contrast !== "default"}
                onChange={(v) =>
                  setField("contrast", v ? "high" : "default")
                }
              />
              <ToggleRow
                emoji="🔊"
                label="Feedback de Áudio"
                description="Sons de confirmação ao concluir ações"
                checked={preferences.audioFeedbackEnabled}
                onChange={(v) => setField("audioFeedbackEnabled", v)}
              />
              <ToggleRow
                emoji="👆"
                label="Botões Maiores"
                description="Aumenta a área clicável de todos os botões (mínimo 64px)"
                checked={preferences.largeTouchTargets}
                onChange={(v) => setField("largeTouchTargets", v)}
              />
            </div>
          </CardContent>
        </Card>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            {isSaving
              ? "Salvando..."
              : isSaved
                ? "✓ Configurações salvas"
                : "Ajustes salvos automaticamente"}
          </p>
        </div>

        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            data-tour="a11y-reset"
            onClick={() => setIsResetDialogOpen(true)}
          >
            Redefinir para Padrões
          </Button>
          <DialogContent>
            <DialogHeader className="pr-2">
              <DialogTitle>Redefinir para o padrão?</DialogTitle>
              <DialogDescription>
                Isso vai desfazer todos os ajustes de acessibilidade que você
                fez. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="min-h-11">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                className="min-h-11"
                onClick={() => {
                  resetToDefaults();
                  setIsResetDialogOpen(false);
                }}
              >
                Redefinir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
