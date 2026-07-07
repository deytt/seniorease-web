"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import {
  Menu,
  X,
  Home,
  CheckSquare2,
  Bell,
  User,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Tarefas", href: "/tasks", icon: CheckSquare2 },
  { label: "Lembretes", href: "/reminders", icon: Bell },
  { label: "Histórico", href: "/history", icon: History },
  { label: "Perfil", href: "/profile", icon: User },
];

interface NavigationProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Navigation({ onCollapsedChange }: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut: signOutFn } = useAuthContext() as any;

  const handleCollapse = (value: boolean) => {
    setIsCollapsed(value);
    onCollapsedChange?.(value);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-bold text-sm">SE</span>
            </div>
            <span className="font-bold text-white text-lg">SeniorEase</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Alternar menu"
          >
            {isMobileOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {isMobileOpen && (
          <nav className="border-t border-slate-700 bg-slate-900">
            <div className="px-3 py-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-primary text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="size-5 flex-shrink-0" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={async () => {
                  try {
                    await signOutFn();
                  } catch (err) {
                    console.error(err);
                  }
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogOut className="size-5 flex-shrink-0" />
                <span className="text-base">Sair</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-700 z-40 transition-all duration-300 ${
          isCollapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {/* Logo + Collapse Toggle */}
        <div
          className={`flex items-center border-b border-slate-700 h-16 flex-shrink-0 ${
            isCollapsed ? "justify-center px-0" : "px-4 gap-3"
          }`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 min-w-0 ${isCollapsed ? "" : "flex-1"}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white flex-shrink-0">
              <span className="font-bold text-sm">SE</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-white text-base truncate">
                SeniorEase
              </span>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => handleCollapse(true)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Recolher menu"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center py-2 border-b border-slate-700">
            <button
              onClick={() => handleCollapse(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Expandir menu"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className={`space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-xl transition-colors ${
                    isCollapsed ? "justify-center px-0 py-3" : "px-3 py-3"
                  } ${
                    isActive
                      ? "bg-primary text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="size-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sign Out */}
        <div
          className={`border-t border-slate-700 py-4 flex-shrink-0 ${
            isCollapsed ? "px-2" : "px-3"
          }`}
        >
          <button
            onClick={async () => {
              try {
                await signOutFn();
              } catch (err) {
                console.error(err);
              }
            }}
            title={isCollapsed ? "Sair" : undefined}
            className={`w-full flex items-center gap-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${
              isCollapsed ? "justify-center px-0 py-3" : "px-3 py-3"
            }`}
          >
            <LogOut className="size-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
