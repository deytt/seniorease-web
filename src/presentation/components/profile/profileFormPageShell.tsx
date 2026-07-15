import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";

interface ProfileFormPageShellProps {
  backHref: string;
  backLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ProfileFormPageShell({
  backHref,
  backLabel,
  title,
  description,
  children,
}: ProfileFormPageShellProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-20">
      <Link href={backHref}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 min-h-11 cursor-pointer rounded-[14px] text-[#64748b] hover:text-[#0f172a]"
        >
          <ChevronLeft className="mr-2 size-4" aria-hidden />
          {backLabel}
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#0f172a]">{title}</h1>
        {description ? (
          <p className="text-base text-[#64748b]">{description}</p>
        ) : null}
      </div>

      <Card className="rounded-2xl border border-[#e2e8f0] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
