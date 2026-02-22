"use client";

import * as React from "react";
import { Link, usePathname } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  PackageOpen,
  Wrench,
  BookOpen,
  Gauge,
  Sparkles,
  HandCoins,
  ClipboardCheck,
  Settings,
  Terminal,
  CalendarDays,
  CreditCard,
  FileCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useVersionCheck } from "@/hooks/use-version-check";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const { isUpdateAvailable, latestVersion, currentVersion: builtVersion } = useVersionCheck();

  const mainNav = [
    { title: t("dashboard"), href: "/", icon: LayoutDashboard },
    { title: t("vault"), href: "/vault", icon: PackageOpen },
    { title: t("services"), href: "/services", icon: Wrench }, // "Rettungsteam" needs translation key if not present, assume "services"
    { title: t("documents"), href: "/documents", icon: FileCheck },
    { title: t("library"), href: "/library", icon: BookOpen },
  ];

  const toolsNav = [
    { title: t("waste"), href: "/waste", icon: CalendarDays },
    { title: t("maintenance"), href: "/maintenance", icon: ClipboardCheck }, // "Wartungen"
    { title: t("utilities"), href: "/utilities", icon: Gauge },
    { title: t("contracts"), href: "/contracts", icon: CreditCard },
    { title: t("wishlist"), href: "/wishlist", icon: Sparkles },
    { title: t("lending"), href: "/lending", icon: HandCoins }, // "Verleih-O-Meter"
  ];

  const systemNav = [
    { title: t("settings"), href: "/settings", icon: Settings },
  ];

  const renderNavGroup = (items: typeof mainNav, label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest font-medium">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                }
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary relative">
            <Terminal className="h-4 w-4 text-sidebar-primary-foreground" />
            {isUpdateAvailable && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
              Adulting.exe
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 font-mono">
              v{builtVersion} &mdash; immer noch Beta
            </span>
            {isUpdateAvailable && latestVersion && (
              <span className="text-[10px] text-green-500 font-mono mt-0.5 animate-pulse">
                Update verfügbar: v{latestVersion}
              </span>
            )}
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {renderNavGroup(mainNav, "Hauptmenü")}
        {renderNavGroup(toolsNav, "Werkzeuge")}
        {renderNavGroup(systemNav, "System")}
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-sidebar-accent/50 border border-sidebar-border p-3">
          <p className="text-[11px] text-sidebar-foreground/50 font-mono leading-relaxed">
            {t("sidebarStatus")}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
