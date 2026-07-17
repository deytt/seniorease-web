import { CircleHelp, Phone } from "lucide-react";

export function ProfileHelpCard() {
  return (
    <section className="rounded-2xl border border-primary/20 bg-primary p-[21px] text-primary-foreground">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-card">
          <CircleHelp className="size-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-7 text-primary-foreground">
            Precisa de Ajuda?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
            Nossa equipe de suporte está disponível para ajudar você a usar o
            SeniorEase com tranquilidade.
          </p>
          <a
            href="tel:18007366467"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-primary-foreground px-4 py-2 text-base font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
          >
            <Phone className="size-4" aria-hidden />
            1-800-SENIOR
          </a>
        </div>
      </div>
    </section>
  );
}
