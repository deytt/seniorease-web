import type { Preview } from "storybook";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/presentation/components/ui/tooltip";
import "../src/app/globals.css";

const fontScale = {
  small: 0.875,
  medium: 1,
  large: 1.125,
  extra_large: 1.25,
} as const;

const spacingScale = {
  compact: 0.85,
  comfortable: 1,
  spacious: 1.5,
} as const;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

type AccessibilityRootProps = {
  appearance: string;
  fontSize: keyof typeof fontScale;
  spacing: keyof typeof spacingScale;
  largeTouchTargets: boolean;
  interfaceMode: "basic" | "advanced";
  children: ReactNode;
};

function AccessibilityRoot({
  appearance,
  fontSize,
  spacing,
  largeTouchTargets,
  interfaceMode,
  children,
}: AccessibilityRootProps) {
  const isDark = appearance === "dark" || appearance === "maximum";
  const contrast =
    appearance === "high"
      ? "high"
      : appearance === "maximum"
        ? "maximum"
        : "default";

  useEffect(() => {
    const root = document.documentElement;
    const fontClasses = [
      geistSans.variable,
      inter.variable,
      geistMono.variable,
    ].flatMap((className) => className.split(" "));

    root.lang = "pt-BR";
    root.classList.add("h-full", "antialiased", "scroll-smooth", ...fontClasses);
    root.style.setProperty("--a11y-font-scale", String(fontScale[fontSize]));
    root.style.setProperty(
      "--a11y-spacing-scale",
      String(spacingScale[spacing]),
    );
    root.classList.toggle("a11y-large-touch", largeTouchTargets);
    root.dataset.contrast = contrast;
    root.dataset.spacing = spacing;
    root.dataset.interfaceMode = interfaceMode;
  }, [contrast, fontSize, interfaceMode, largeTouchTargets, spacing]);

  const accessibilityStyles = {
    "--a11y-font-scale": fontScale[fontSize],
    "--a11y-spacing-scale": spacingScale[spacing],
  } as CSSProperties;

  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={isDark ? "dark" : "light"}
      enableSystem={false}
    >
      <TooltipProvider delayDuration={300}>
        <div
          className={`${geistSans.variable} ${inter.variable} ${geistMono.variable} ${isDark ? "dark" : ""} ${largeTouchTargets ? "a11y-large-touch" : ""} min-h-full bg-background font-sans text-foreground antialiased`}
          data-contrast={contrast}
          data-interface-mode={interfaceMode}
          data-spacing={spacing}
          style={accessibilityStyles}
        >
          {children}
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

const preview: Preview = {
  parameters: {
    actions: {},

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      toc: true,
    },

    backgrounds: { disable: true },

    viewport: {
      options: {
        mobile: {
          name: "Mobile — 375px",
          styles: { width: "375px", height: "812px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet — 768px",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop — 1440px",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story, context) => {
      const appearance = String(context.globals.appearance ?? "light");
      const fontSize = String(context.globals.fontSize ?? "medium") as keyof typeof fontScale;
      const spacing = String(context.globals.spacing ?? "comfortable") as keyof typeof spacingScale;
      const interfaceMode = String(
        context.globals.interfaceMode ?? "advanced",
      ) as "basic" | "advanced";
      const largeTouchTargets = Boolean(context.globals.largeTouchTargets);

      return (
        <AccessibilityRoot
          appearance={appearance}
          fontSize={fontSize}
          spacing={spacing}
          largeTouchTargets={largeTouchTargets}
          interfaceMode={interfaceMode}
        >
          <Story />
        </AccessibilityRoot>
      );
    },
  ],
};

export const globalTypes = {
  appearance: {
    description: "Tema e contraste usados pela aplicação real.",
    defaultValue: "light",
    toolbar: {
      icon: "contrast",
      items: [
        { value: "light", title: "Claro" },
        { value: "dark", title: "Escuro" },
        { value: "high", title: "Alto contraste" },
        { value: "maximum", title: "Contraste máximo" },
      ],
      dynamicTitle: true,
    },
  },
  fontSize: {
    description: "Escala tipográfica das preferências de acessibilidade.",
    defaultValue: "medium",
    toolbar: {
      icon: "zoom",
      items: [
        { value: "small", title: "Fonte pequena" },
        { value: "medium", title: "Fonte média" },
        { value: "large", title: "Fonte grande" },
        { value: "extra_large", title: "Fonte extragrande" },
      ],
      dynamicTitle: true,
    },
  },
  spacing: {
    description: "Densidade de espaçamento da aplicação.",
    defaultValue: "comfortable",
    toolbar: {
      icon: "component",
      items: [
        { value: "compact", title: "Compacto" },
        { value: "comfortable", title: "Confortável" },
        { value: "spacious", title: "Espaçoso" },
      ],
      dynamicTitle: true,
    },
  },
  largeTouchTargets: {
    description: "Amplia alvos interativos para 64px.",
    defaultValue: false,
    toolbar: {
      icon: "pointer",
      items: [
        { value: false, title: "Alvos padrão" },
        { value: true, title: "Alvos maiores" },
      ],
      dynamicTitle: true,
    },
  },
  interfaceMode: {
    description: "Visibilidade dos recursos avançados.",
    defaultValue: "advanced",
    toolbar: {
      icon: "switchalt",
      items: [
        { value: "advanced", title: "Modo avançado" },
        { value: "basic", title: "Modo básico" },
      ],
      dynamicTitle: true,
    },
  },
};

export default preview;
