import type { ReactNode } from "react";
import { BackNavigationButton } from "@/presentation/components/ui/backNavigationButton";
import { Card, CardContent } from "@/presentation/components/ui/card";

interface ProfileFormPageShellProps {
  backHref: string;
  backLabel: string;
  title: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function ProfileFormPageShell({
  backHref,
  backLabel,
  title,
  description,
  headerAction,
  children,
}: ProfileFormPageShellProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <BackNavigationButton
        href={backHref}
        label={backLabel}
        className="mb-6"
      />

      <div className="mb-8 flex items-start justify-between gap-3">
        <div className="min-w-0" data-tour="profile-form-header">
          <h1 className="page-title mb-2">{title}</h1>
          {description ? (
            <p className="text-base text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {headerAction ? (
          <div className="shrink-0 pt-1">{headerAction}</div>
        ) : null}
      </div>

      <Card className="rounded-2xl border border-border shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
