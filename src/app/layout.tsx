import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Playfair_Display,
  Inter,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/presentation/components/ui/tooltip";
import { PreferencesProvider } from "@/presentation/providers/PreferencesProvider";
import { AuthProvider } from "@/presentation/providers/AuthProvider";
import { FCMProvider } from "@/presentation/providers/FCMProvider";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

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
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <TooltipProvider delayDuration={300}>
        <body className="min-h-full flex flex-col">
          <FCMProvider />
          <AuthProvider>
            <PreferencesProvider>{children}</PreferencesProvider>
          </AuthProvider>
        </body>
      </TooltipProvider>
    </html>
  );
}
