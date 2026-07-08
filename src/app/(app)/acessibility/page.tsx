"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { useAccessibility } from "@/presentation/hooks/useAccessibility";
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
import { ArrowLeft } from "lucide-react";

export default function AccessibilityCenterPage() {
  const { preferences, isLoaded, isSaving, setField, resetToDefaults } =
    useAccessibility();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && isLoaded) {
      const timer = setTimeout(() => {
        setIsSaved(true);
        const resetTimer = setTimeout(() => setIsSaved(false), 2000);
        return () => clearTimeout(resetTimer);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isSaving, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p role="status" className="text-lg text-muted-foreground">
          Carregando suas preferências...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="size-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">
            Configurações de Acessibilidade
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Font Size Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <label className="text-sm font-semibold text-foreground">
                Tamanho da Fonte
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Atual:{" "}
                {preferences.fontSize === "small"
                  ? "88%"
                  : preferences.fontSize === "medium"
                    ? "100%"
                    : preferences.fontSize === "large"
                      ? "113%"
                      : "125%"}
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="3"
                value={
                  preferences.fontSize === "small"
                    ? 0
                    : preferences.fontSize === "medium"
                      ? 1
                      : preferences.fontSize === "large"
                        ? 2
                        : 3
                }
                onChange={(e) => {
                  const sizes = [
                    "small",
                    "medium",
                    "large",
                    "extra_large",
                  ] as const;
                  setField("fontSize", sizes[parseInt(e.target.value)]);
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pequena</span>
                <span>Grande</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interface Mode Section */}
        <Card>
          <CardContent className="pt-6">
            <label className="text-sm font-semibold text-foreground block mb-3">
              Modo de Interface
            </label>
            <div className="flex gap-3">
              {(["basic", "advanced"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setField("interfaceMode", mode)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    preferences.interfaceMode === mode
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {mode === "basic" ? "Básico" : "Avançado"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              O Modo Básico simplifica a interface, ocultando elementos menos essenciais.
            </p>
          </CardContent>
        </Card>

        {/* Spacing Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <label className="text-sm font-semibold text-foreground block">
                Espaçamento entre Elementos
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Controla o espaço entre botões, cards e campos do formulário.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { key: "compact", label: "Compacto", emoji: "⬛" },
                  { key: "comfortable", label: "Confortável", emoji: "🔲" },
                  { key: "spacious", label: "Espaçoso", emoji: "⬜" },
                ] as const
              ).map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => setField("spacing", key)}
                  aria-pressed={preferences.spacing === key}
                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 font-medium transition-colors ${
                    preferences.spacing === key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Toggles Section */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              {/* Dark Mode */}
              <button
                onClick={() => setField("darkMode", !preferences.darkMode)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌙</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">Modo Escuro</p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.darkMode ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.darkMode ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>

              {/* High Contrast */}
              <button
                onClick={() =>
                  setField(
                    "contrast",
                    preferences.contrast === "default" ? "high" : "default",
                  )
                }
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">◑</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">Alto Contraste</p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.contrast !== "default"
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.contrast !== "default"
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>

              {/* Audio Feedback */}
              <button
                onClick={() =>
                  setField(
                    "audioFeedbackEnabled",
                    !preferences.audioFeedbackEnabled,
                  )
                }
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔊</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">Feedback de Áudio</p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.audioFeedbackEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.audioFeedbackEnabled
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>

              {/* Large Touch Targets */}
              <button
                onClick={() =>
                  setField("largeTouchTargets", !preferences.largeTouchTargets)
                }
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👆</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">
                      Alvos de Toque Maiores
                    </p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.largeTouchTargets ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      preferences.largeTouchTargets
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Save Status */}
        <div className="text-center">
          <p
            role="status"
            aria-live="polite"
            className="text-sm text-muted-foreground"
          >
            {isSaving
              ? "Salvando..."
              : isSaved
                ? "✓ Configurações salvas"
                : "Ajustes automáticos"}
          </p>
        </div>

        {/* Reset Button */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsResetDialogOpen(true)}
          >
            Redefinir para Padrões
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redefinir para o padrão?</DialogTitle>
              <DialogDescription>
                Isso vai desfazer todos os ajustes de acessibilidade que você
                fez. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
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
    </div>
  );
}
