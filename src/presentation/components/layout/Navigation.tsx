"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  CheckSquare2,
  ListOrdered,
  Bell,
  User,
  History,
  Accessibility,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Tarefas", href: "/tasks", icon: CheckSquare2 },
  {
    label: "Modo Guiado",
    href: "/tasks/guided",
    icon: ListOrdered,
    match: (pathname: string) =>
      pathname === "/tasks/guided" || /\/tasks\/[^/]+\/guided$/.test(pathname),
  },
  { label: "Lembretes", href: "/reminders", icon: Bell },
  { label: "Acessibilidade", href: "/acessibility", icon: Accessibility },
  { label: "Histórico", href: "/history", icon: History },
  { label: "Perfil", href: "/profile", icon: User },
];

function isNavItemActive(
  pathname: string | null,
  item: (typeof navigationItems)[number],
): boolean {
  if (!pathname) return false;
  if ("match" in item && item.match) {
    return item.match(pathname);
  }
  if (item.href === "/tasks") {
    return (
      pathname === "/tasks" ||
      pathname === "/tasks/create" ||
      (pathname.startsWith("/tasks/") && !pathname.endsWith("/guided"))
    );
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Abaixo disso a sidebar inicia colapsada para não comprimir o conteúdo. */
const SIDEBAR_EXPANDED_MIN_WIDTH = 1280;

interface NavigationProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Navigation({ onCollapsedChange }: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, isSigningOut } = useAuth();

  useEffect(() => {
    const media = window.matchMedia(
      `(max-width: ${SIDEBAR_EXPANDED_MIN_WIDTH - 1}px)`,
    );
    const sync = () => {
      const shouldCollapse = media.matches;
      setIsCollapsed(shouldCollapse);
      onCollapsedChange?.(shouldCollapse);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [onCollapsedChange]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSignOutDialogOpen(false);
      setIsMobileOpen(false);
    }
  };

  const handleCollapse = (value: boolean) => {
    setIsCollapsed(value);
    onCollapsedChange?.(value);
  };

  return (
    <>
      <Dialog open={isSignOutDialogOpen} onOpenChange={setIsSignOutDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-5 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] sm:max-w-md"
        >
          <DialogHeader className="gap-3 text-left">
            <DialogTitle className="font-sans text-xl font-bold normal-case tracking-normal text-[#0f172a]">
              Sair da conta?
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-[#64748b]">
              Você será desconectado do SeniorEase. Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="min-h-11 cursor-pointer rounded-[14px] border-[#e2e8f0]"
                disabled={isSigningOut}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="min-h-11 cursor-pointer rounded-[14px] bg-destructive text-white hover:bg-destructive/90 hover:text-white"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              {isSigningOut ? "Saindo..." : "Sair"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile / tablet header — até lg */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-bold text-sm">SE</span>
            </div>
            <span className="font-bold text-white text-lg truncate">
              SeniorEase
            </span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg p-3 text-slate-300 hover:bg-slate-700 hover:text-white"
            aria-label={isMobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
          >
            {isMobileOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {isMobileOpen && (
          <nav
            id="mobile-nav"
            className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-slate-700 bg-slate-900"
          >
            <div className="space-y-1 px-3 py-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                      isActive
                        ? "bg-primary font-semibold text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => setIsSignOutDialogOpen(true)}
                className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <LogOut className="size-5 shrink-0" />
                <span className="text-base">Sair</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {isMobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      {/* Desktop sidebar — a partir de lg */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden border-r border-slate-700 bg-slate-900 transition-all duration-300 lg:flex",
          isCollapsed ? "w-[68px]" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-slate-700",
            isCollapsed ? "justify-center px-0" : "gap-3 px-4",
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex min-w-0 items-center gap-3",
              !isCollapsed && "flex-1",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <span className="text-sm font-bold">SE</span>
            </div>
            {!isCollapsed && (
              <span className="truncate text-base font-bold text-white">
                SeniorEase
              </span>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => handleCollapse(true)}
              className="shrink-0 cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
              aria-label="Recolher menu"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center border-b border-slate-700 py-2">
            <button
              onClick={() => handleCollapse(false)}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
              aria-label="Expandir menu"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4">
          <div className={cn("space-y-1", isCollapsed ? "px-2" : "px-3")}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl transition-colors",
                    isCollapsed ? "justify-center px-0 py-3" : "px-3 py-3",
                    isActive
                      ? "bg-primary font-semibold text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div
          className={cn(
            "shrink-0 border-t border-slate-700 py-4",
            isCollapsed ? "px-2" : "px-3",
          )}
        >
          <button
            onClick={() => setIsSignOutDialogOpen(true)}
            title={isCollapsed ? "Sair" : undefined}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white",
              isCollapsed ? "justify-center px-0 py-3" : "px-3 py-3",
            )}
          >
            <LogOut className="size-5 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
