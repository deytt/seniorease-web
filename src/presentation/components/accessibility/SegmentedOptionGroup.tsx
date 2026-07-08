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
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
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
              "flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 px-3 py-3 text-center transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
              isSelected
                ? "border-primary bg-primary-light text-primary"
                : "border-border bg-card text-foreground hover:border-primary/40",
            )}
          >
            <span className="text-base font-semibold">{option.label}</span>
            {option.description && (
              <span className="text-sm text-muted-foreground">
                {option.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
