import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BackNavigationButton } from "@/presentation/components/ui/backNavigationButton";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
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
  backHref,
  backLabel = "Voltar",
  className,
  titleClassName,
  descriptionClassName,
  backClassName = "mb-4",
  dataTour,
}: PageHeaderProps) {
  return (
    <>
      {backHref ? (
        <BackNavigationButton
          href={backHref}
          label={backLabel}
          className={backClassName}
        />
      ) : null}

      <header
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
          className,
        )}
        data-tour={dataTour}
      >
        <div className="min-w-0">
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
        {actions ? (
          <div className="w-full shrink-0 sm:w-auto">{actions}</div>
        ) : null}
      </header>
    </>
  );
}
