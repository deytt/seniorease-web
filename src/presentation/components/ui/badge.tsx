import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Badge — Identificadores visuais de status, prioridade e categoria.
 *
 * ## Variantes de Status (pill com fundo colorido)
 * - `default` → azul (info/social)
 * - `success` → verde (Concluída)
 * - `warning` → âmbar (Em andamento)
 * - `destructive` → vermelho (Alta prioridade / Urgente)
 * - `secondary` → verde-água (Saúde / Hidratação)
 * - `purple` → roxo (Agendado)
 * - `outline` → contorno (tags de categoria)
 *
 * ## Variantes de Contador (círculo sólido)
 * - `counter` → azul primário
 * - `counter-danger` → vermelho
 * - `counter-success` → verde
 * - `counter-secondary` → verde-água
 *
 * Referência Figma: SeniorEase Design System → Badges & Labels (node 2:7760)
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        // Status badges — pill com fundo colorido claro (Figma node 2:7869-2:7883)
        default: "rounded-full bg-[#eff6ff] text-[#2563eb] px-3 py-1 text-sm",
        success: "rounded-full bg-[#f0fdf4] text-[#22c55e] px-3 py-1 text-sm",
        warning: "rounded-full bg-[#fffbeb] text-[#f59e0b] px-3 py-1 text-sm",
        destructive:
          "rounded-full bg-[#fef2f2] text-[#ef4444] px-3 py-1 text-sm",
        secondary: "rounded-full bg-[#f0fdfa] text-[#14b8a6] px-3 py-1 text-sm",
        purple: "rounded-full bg-[#f5f3ff] text-[#7c3aed] px-3 py-1 text-sm",
        outline:
          "rounded-full border border-border bg-transparent text-foreground px-3 py-1 text-sm",
        // Counter badges — círculo sólido (Figma node 2:7894-2:7909)
        counter:
          "rounded-full size-6 bg-[#2563eb] text-white text-xs font-black",
        "counter-danger":
          "rounded-full size-6 bg-[#ef4444] text-white text-xs font-black",
        "counter-success":
          "rounded-full size-6 bg-[#22c55e] text-white text-xs font-black",
        "counter-secondary":
          "rounded-full size-6 bg-[#14b8a6] text-white text-xs font-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
