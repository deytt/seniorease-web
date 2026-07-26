import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BackNavigationButton } from "@/presentation/components/ui/backNavigationButton";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Botões de ação secundários (Filtrar, Nova Tarefa, etc.). No mobile ficam abaixo do título. */
  actions?: ReactNode;
  /** Botão do tour guiado. No mobile fica sozinho no canto superior direito, ao lado do título. */
  tourAction?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  backClassName?: string;
  dataTour?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  tourAction,
  backHref,
  backLabel = "Voltar",
  className,
  titleClassName,
  descriptionClassName,
  backClassName = "mb-4",
  dataTour,
}: PageHeaderProps) {
  const hasDesktopTrailing = Boolean(actions || tourAction);

  return (
    <>
      {backHref ? (
        <BackNavigationButton
          href={backHref}
          label={backLabel}
          className={backClassName}
        />
      ) : null}

      <header className={cn("flex flex-col gap-4", className)} data-tour={dataTour}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className={cn("page-title", titleClassName)}>{title}</h1>
            {description ? (
              <div
                className={cn(
                  "mt-1 text-base leading-6 text-muted-foreground",
                  descriptionClassName,
                )}
              >
                {description}
              </div>
            ) : null}
          </div>

          {tourAction ? (
            <div className="shrink-0 sm:hidden">{tourAction}</div>
          ) : null}

          {hasDesktopTrailing ? (
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              {actions}
              {tourAction}
            </div>
          ) : null}
        </div>

        {actions ? <div className="w-full sm:hidden">{actions}</div> : null}
      </header>
    </>
  );
}
