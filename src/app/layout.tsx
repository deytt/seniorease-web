import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/presentation/components/ui/tooltip";
import { PreferencesProvider } from "@/presentation/providers/PreferencesProvider";
import { AuthProvider } from "@/presentation/providers/AuthProvider";
import { FCMProvider } from "@/presentation/providers/FCMProvider";
import { Toaster } from "@/presentation/components/ui/sonner";
import { ScrollLockFix } from "@/presentation/components/layout/ScrollLockFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SeniorEase",
  description: "Accessibility-first platform for elderly users",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        "scroll-smooth",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
      )}
    >
      <TooltipProvider delayDuration={300}>
        <body className="min-h-full flex flex-col">
          <ScrollLockFix />
          <FCMProvider />
          <AuthProvider>
            <PreferencesProvider>
              {children}
              <Toaster />
            </PreferencesProvider>
          </AuthProvider>
        </body>
      </TooltipProvider>
    </html>
  );
}
