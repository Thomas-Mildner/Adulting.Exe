"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PackageOpen,
  Wrench,
  BookOpen,
  Gauge,
  Sparkles,
  HandCoins,
  Settings,
  Terminal,
} from "lucide-react"

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
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Der Tresor", href: "/vault", icon: PackageOpen },
  { title: "Rettungsteam", href: "/services", icon: Wrench },
  { title: "Bibliothek", href: "/library", icon: BookOpen },
]

const toolsNav = [
  { title: "Ressourcenfresser", href: "/utilities", icon: Gauge },
  { title: "Wunschliste", href: "/wishlist", icon: Sparkles },
  { title: "Verleih-O-Meter", href: "/lending", icon: HandCoins },
]

const systemNav = [
  { title: "Einstellungen", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

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
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Terminal className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
              Adulting.exe
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 font-mono">
              v2.0 &mdash; immer noch Beta
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {renderNavGroup(mainNav, "Hauptmenue")}
        {renderNavGroup(toolsNav, "Werkzeuge")}
        {renderNavGroup(systemNav, "System")}
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-sidebar-accent/50 border border-sidebar-border p-3">
          <p className="text-[11px] text-sidebar-foreground/50 font-mono leading-relaxed">
            {"Status: Haus steht (vorerst)"}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
