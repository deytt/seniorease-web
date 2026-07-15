"use client";

import { forwardRef } from "react";
import { Input } from "@/presentation/components/ui/input";
import {
  applyInputMask,
  type InputMaskType,
} from "@/lib/inputMasks";

interface MaskedInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  mask: InputMaskType;
  value: string;
  onValueChange: (value: string) => void;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput(
    { mask, value, onValueChange, onBlur, ...props },
    ref,
  ) {
    return (
      <Input
        ref={ref}
        value={value}
        onChange={(event) => onValueChange(applyInputMask(mask, event.target.value))}
        onBlur={onBlur}
        {...props}
      />
    );
  },
);
