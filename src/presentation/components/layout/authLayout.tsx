import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Layout compartilhado pelas telas de Login, Register, Forgot Password e Success.
 * Espelha o mockup do Figma: badge "SE", título, subtítulo e card central.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center">
        <div
          aria-hidden="true"
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
        >
          <span className="font-heading text-xl font-bold">SE</span>
        </div>

        <h1 className="text-center font-heading text-3xl font-bold text-foreground">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-center text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}

        <div className="mt-8 w-full rounded-2xl border border-border bg-card p-8 shadow-card">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-base text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
