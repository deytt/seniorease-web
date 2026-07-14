"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // 24px visual, mas a área clicável real vem do <label> que envolve o componente (min 44px)
      // Figma (node 2:7569/2:7575): border-2 (2px) e rounded-[10px] — não rounded-md padrão.
      "peer h-6 w-6 shrink-0 rounded-[10px] border-2 border-input bg-background text-primary-foreground",
      "transition-colors",
      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="size-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
