"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { Check, Laptop, Moon, Palette, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("Settings.theme")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? theme : "system"

  const themes = [
    {
      id: "light",
      label: t("light"),
      description: t("lightDesc"),
      icon: Sun,
      preview: (
        <div className="w-full rounded-md border border-slate-200 bg-[#f8fafc] p-2 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-rose-400" />
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="ml-auto h-1.5 w-8 rounded bg-slate-200" />
          </div>
          <div className="space-y-1 pt-0.5">
            <div className="h-2 w-3/4 rounded bg-slate-300" />
            <div className="h-1.5 w-full rounded bg-slate-200" />
            <div className="h-1.5 w-1/2 rounded bg-slate-200" />
          </div>
          <div className="flex gap-1 pt-1">
            <div className="h-3 w-8 rounded bg-blue-500" />
            <div className="h-3 w-6 rounded bg-slate-200" />
          </div>
        </div>
      ),
    },
    {
      id: "dark",
      label: t("dark"),
      description: t("darkDesc"),
      icon: Moon,
      preview: (
        <div className="w-full rounded-md border border-zinc-800 bg-[#090d16] p-2 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-rose-500/70" />
            <div className="h-2 w-2 rounded-full bg-amber-500/70" />
            <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
            <div className="ml-auto h-1.5 w-8 rounded bg-zinc-700" />
          </div>
          <div className="space-y-1 pt-0.5">
            <div className="h-2 w-3/4 rounded bg-zinc-600" />
            <div className="h-1.5 w-full rounded bg-zinc-800" />
            <div className="h-1.5 w-1/2 rounded bg-zinc-800" />
          </div>
          <div className="flex gap-1 pt-1">
            <div className="h-3 w-8 rounded bg-blue-600" />
            <div className="h-3 w-6 rounded bg-zinc-700" />
          </div>
        </div>
      ),
    },
    {
      id: "system",
      label: t("system"),
      description: t("systemDesc"),
      icon: Laptop,
      preview: (
        <div className="relative w-full overflow-hidden rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="grid grid-cols-2">
            {/* Light Half */}
            <div className="bg-[#f8fafc] p-2 space-y-1.5 border-r border-slate-200">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <div className="space-y-1 pt-0.5">
                <div className="h-2 w-full rounded bg-slate-300" />
                <div className="h-1.5 w-3/4 rounded bg-slate-200" />
              </div>
              <div className="pt-1">
                <div className="h-3 w-6 rounded bg-blue-500" />
              </div>
            </div>
            {/* Dark Half */}
            <div className="bg-[#090d16] p-2 space-y-1.5">
              <div className="flex items-center justify-end">
                <div className="h-1.5 w-4 rounded bg-zinc-700" />
              </div>
              <div className="space-y-1 pt-0.5">
                <div className="h-2 w-full rounded bg-zinc-600" />
                <div className="h-1.5 w-3/4 rounded bg-zinc-800" />
              </div>
              <div className="pt-1">
                <div className="h-3 w-6 rounded bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((item) => {
            const isSelected = currentTheme === item.id
            const Icon = item.icon

            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTheme(item.id)}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : "border-border hover:border-border/80"
                )}
              >
                {/* Visual Preview */}
                <div className="w-full pointer-events-none">
                  {item.preview}
                </div>

                {/* Option Header */}
                <div className="flex items-center justify-between w-full mt-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  {isSelected && (
                    <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {item.description}
                </p>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
