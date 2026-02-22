"use client"

import React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/settings/theme-toggle"
import { NotificationCenter } from "@/components/notifications/notification-center"

export function DashboardLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-foreground leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground leading-tight">{subtitle}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <GlobalSearch />
            <NotificationCenter />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
