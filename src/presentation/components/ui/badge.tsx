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
        default: "rounded-full bg-primary-light text-primary px-3 py-1 text-sm",
        success: "rounded-full bg-success-light text-success px-3 py-1 text-sm",
        warning: "rounded-full bg-warning-light text-warning px-3 py-1 text-sm",
        destructive:
          "rounded-full bg-destructive-light text-destructive px-3 py-1 text-sm",
        secondary: "rounded-full bg-secondary-light text-secondary px-3 py-1 text-sm",
        purple: "rounded-full bg-primary-light text-primary px-3 py-1 text-sm",
        outline:
          "rounded-full border border-border bg-transparent text-foreground px-3 py-1 text-sm",
        // Counter badges — círculo sólido (Figma node 2:7894-2:7909)
        counter:
          "rounded-full size-6 bg-primary text-primary-foreground text-sm font-black",
        "counter-danger":
          "rounded-full size-6 bg-destructive text-destructive-foreground text-sm font-black",
        "counter-success":
          "rounded-full size-6 bg-success text-success-foreground text-sm font-black",
        "counter-secondary":
          "rounded-full size-6 bg-secondary text-secondary-foreground text-sm font-black",
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
