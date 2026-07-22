import type { ReactNode } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

export const TOAST_DURATION = {
  success: 3000,
  info: 4000,
  warning: 4000,
  error: 5000,
} as const;

function optionsWithDuration(
  duration: number,
  options?: ExternalToast,
): ExternalToast {
  return { ...options, duration };
}

/**
 * Única porta de feedback via toast da aplicação.
 * Não use sucesso quando a mesma ação já exibir modal ou celebração.
 */
export const toast = {
  success(message: ReactNode, options?: ExternalToast) {
    return sonnerToast.success(
      message,
      optionsWithDuration(TOAST_DURATION.success, options),
    );
  },
  info(message: ReactNode, options?: ExternalToast) {
    return sonnerToast.info(
      message,
      optionsWithDuration(TOAST_DURATION.info, options),
    );
  },
  warning(message: ReactNode, options?: ExternalToast) {
    return sonnerToast.warning(
      message,
      optionsWithDuration(TOAST_DURATION.warning, options),
    );
  },
  error(message: ReactNode, options?: ExternalToast) {
    return sonnerToast.error(
      message,
      optionsWithDuration(TOAST_DURATION.error, options),
    );
  },
  loading(message: ReactNode, options?: ExternalToast) {
    return sonnerToast.loading(message, options);
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
};
