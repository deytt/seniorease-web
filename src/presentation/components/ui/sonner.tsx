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
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--success-bg": "var(--success-light)",
          "--success-border": "var(--success)",
          "--success-text": "var(--success-dark)",
          "--error-bg": "var(--destructive-light)",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--destructive-dark)",
          "--warning-bg": "var(--warning-light)",
          "--warning-border": "var(--warning)",
          "--warning-text": "var(--foreground)",
          "--info-bg": "var(--primary-light)",
          "--info-border": "var(--info)",
          "--info-text": "var(--primary-dark)",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "14px",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

