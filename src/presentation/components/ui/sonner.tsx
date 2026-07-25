"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

type ToastPosition = NonNullable<ToasterProps["position"]>;

/**
 * Toaster global — desktop: canto inferior direito;
 * mobile: canto inferior (centralizado).
 * Usa richColors com CSS variables do design system (Figma).
 *
 * Padrão de feedback (issue #61): posição responsiva, sem botão de fechar e
 * durações definidas em `feedbackToast.ts`. Toasts de sucesso só acompanham
 * ações sem modal ou celebração; erros usam mensagens simples em português.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const [position, setPosition] = useState<ToastPosition>("bottom-right");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => {
      setPosition(media.matches ? "bottom-center" : "bottom-right");
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors={true}
      closeButton={false}
      className="toaster group"
      position={position}
      icons={{
        success: <CircleCheckIcon className="size-[1.35em]" />,
        info: <InfoIcon className="size-[1.35em]" />,
        warning: <TriangleAlertIcon className="size-[1.35em]" />,
        error: <OctagonXIcon className="size-[1.35em]" />,
        loading: <Loader2Icon className="size-[1.35em] animate-spin" />,
      }}
      style={
        {
          "--success-bg": "var(--toast-success-bg)",
          "--success-border": "var(--toast-success-border)",
          "--success-text": "var(--toast-success-text)",
          "--error-bg": "var(--toast-error-bg)",
          "--error-border": "var(--toast-error-border)",
          "--error-text": "var(--toast-error-text)",
          "--warning-bg": "var(--toast-warning-bg)",
          "--warning-border": "var(--toast-warning-border)",
          "--warning-text": "var(--toast-warning-text)",
          "--info-bg": "var(--toast-info-bg)",
          "--info-border": "var(--toast-info-border)",
          "--info-text": "var(--toast-info-text)",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "14px",
        } as CSSProperties
      }
      toastOptions={{
        duration: 3000,
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

