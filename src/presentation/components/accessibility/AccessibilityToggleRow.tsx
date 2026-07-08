"use client";

import { Switch } from "@/presentation/components/ui/switch";

interface AccessibilityToggleRowProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function AccessibilityToggleRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: AccessibilityToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <label htmlFor={id} className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-foreground">
          {title}
        </span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
