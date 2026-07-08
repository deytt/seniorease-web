"use client";

import { Card } from "@/presentation/components/ui/card";
import type { UserPreferences } from "@/domain/entities/UserPreferences";

/**
 * Mostra o efeito real das preferências atuais — productContext.md
 * (princípio 7: "Adaptabilidade real"). O card usa diretamente as CSS
 * custom properties já aplicadas em <html> pelo PreferencesProvider.
 */
export function LivePreviewCard({
  preferences,
}: {
  preferences: UserPreferences;
}) {
  return (
    <Card className="p-6" data-contrast={preferences.contrast}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Pré-visualização em tempo real
      </p>
      <div
        className="rounded-xl border border-border bg-background p-5"
        style={{
          fontSize: "calc(1rem * var(--a11y-font-scale))",
          padding: "calc(1rem * var(--a11y-spacing-scale))",
        }}
      >
        <p className="font-heading text-xl font-bold text-foreground">
          Bom dia! ☀️
        </p>
        <p className="mt-1 text-foreground">
          Você tem 3 tarefas restantes hoje.
        </p>
        <button
          type="button"
          className="mt-4 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          Iniciar tarefa
        </button>
      </div>
    </Card>
  );
}
