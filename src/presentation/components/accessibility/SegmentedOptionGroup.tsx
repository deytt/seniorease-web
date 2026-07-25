"use client";

import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SegmentedOptionGroupProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
}

/**
 * Seletor em cards (não dropdown) — clareza acima de completude
 * (productContext.md): o usuário vê e toca todas as opções de uma vez,
 * sem precisar abrir um menu.
 *
 * Em viewports estreitas (fonte 125% + espaçoso) empilha em 1 coluna
 * para não estourar o layout (issue #81 item 7).
 */
export function SegmentedOptionGroup<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: SegmentedOptionGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "grid grid-cols-1 gap-3",
        options.length === 2 && "sm:grid-cols-2",
        options.length === 3 && "sm:grid-cols-3",
        options.length >= 4 && "sm:grid-cols-2 md:grid-cols-4",
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 px-2 py-3 text-center transition-colors sm:min-h-16 sm:px-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
              isSelected
                ? "border-primary bg-primary-light text-primary"
                : "border-border bg-card text-foreground hover:border-primary/40",
            )}
          >
            <span className="max-w-full text-base font-semibold leading-tight text-balance">
              {option.label}
            </span>
            {option.description && (
              <span className="max-w-full text-sm leading-tight text-muted-foreground text-balance">
                {option.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
