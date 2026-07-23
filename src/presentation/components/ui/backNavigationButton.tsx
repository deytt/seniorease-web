import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { backNavButtonClassName } from "@/presentation/lib/backNavButtonClassName";
import { Button } from "@/presentation/components/ui/button";

interface BackNavigationButtonProps {
  href: string;
  label: string;
  className?: string;
}

export function BackNavigationButton({
  href,
  label,
  className,
}: BackNavigationButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(backNavButtonClassName, className)}
    >
      <Link href={href} aria-label={label}>
        <ArrowLeft aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
