"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { de, enUS } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { type WastePickup } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const colorToHex: Record<string, string> = {
  "green-500": "#22c55e",
  "blue-500": "#3b82f6",
  "yellow-500": "#eab308",
  "gray-500": "#6b7280",
  "orange-500": "#f97316",
  "purple-500": "#a855f7",
  "red-500": "#ef4444",
  "amber-800": "#92400e",
  "black": "#000000",
}

function toLocalDateKey(d: Date | string): string {
  const dateObj = typeof d === "string" ? new Date(d) : d
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function WasteCalendarView({ pickups }: { pickups: WastePickup[] }) {
  const t = useTranslations("Waste.calendar")
  const locale = useLocale()
  const dateLocale = locale === "de" ? de : enUS

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Precompute map of date strings to pickups
  const pickupsByDate = useMemo(() => {
    const map = new Map<string, WastePickup[]>()
    for (const p of pickups) {
      const key = toLocalDateKey(p.date)
      const list = map.get(key) || []
      list.push(p)
      map.set(key, list)
    }
    return map
  }, [pickups])

  // Get distinct waste types for the legend
  const distinctWasteTypes = useMemo(() => {
    const seen = new Set<string>()
    const types: { name: string; color: string; hex: string }[] = []
    for (const p of pickups) {
      if (p.wasteType && !seen.has(p.wasteType.name)) {
        seen.add(p.wasteType.name)
        const colorKey = p.wasteType.color || "gray-500"
        const hex = colorToHex[colorKey] || colorKey
        types.push({ name: p.wasteType.name, color: colorKey, hex })
      }
    }
    return types
  }, [pickups])

  // Selected date pickups
  const selectedDatePickups = useMemo(() => {
    if (!selectedDate) return []
    return pickupsByDate.get(toLocalDateKey(selectedDate)) || []
  }, [selectedDate, pickupsByDate])

  // Upcoming pickups (today or future)
  const upcomingPickups = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return pickups
      .filter((p) => new Date(p.date).getTime() >= today.getTime())
      .slice(0, 4)
  }, [pickups])

  return (
    <Card className="h-full flex flex-col shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">{t("title")}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            {pickups.length} {locale === "de" ? "Termine" : "Events"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        {/* Prominent Calendar */}
        <div className="w-full flex justify-center bg-card rounded-lg border p-1 shadow-xs">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={dateLocale}
            className="w-full p-2"
            classNames={{
              months: "w-full",
              month: "w-full space-y-3",
              month_grid: "w-full",
              weekdays: "flex w-full justify-between",
              weekday: "w-10 text-center text-xs font-medium text-muted-foreground py-1",
              week: "flex w-full justify-between mt-1",
              day: "h-10 w-10 p-0 text-center relative focus-within:relative focus-within:z-20",
              day_button: "h-10 w-10 p-0 font-normal rounded-md transition-colors hover:bg-accent/70",
            }}
            components={{
              DayButton: ({ day, modifiers, className, ...buttonProps }) => {
                const dateKey = toLocalDateKey(day.date)
                const dayPickups = pickupsByDate.get(dateKey) || []
                const hasPickups = dayPickups.length > 0
                const isSelected = selectedDate && toLocalDateKey(selectedDate) === dateKey

                const tooltip = hasPickups
                  ? dayPickups.map((p) => p.wasteType?.name).filter(Boolean).join(", ")
                  : undefined

                return (
                  <button
                    type="button"
                    title={tooltip}
                    className={cn(
                      className,
                      "h-10 w-10 p-0 flex flex-col items-center justify-center relative rounded-md transition-all",
                      isSelected && "bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary",
                      hasPickups && !isSelected && "font-medium hover:bg-muted/80",
                      modifiers.outside && "opacity-35"
                    )}
                    {...buttonProps}
                  >
                    <span className="text-xs leading-none">{day.date.getDate()}</span>
                    {hasPickups && (
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {dayPickups.slice(0, 3).map((p, idx) => {
                          const color = p.wasteType?.color || "gray-500"
                          const hex = colorToHex[color] || color
                          return (
                            <span
                              key={idx}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full inline-block shadow-xs",
                                isSelected && "ring-1 ring-background"
                              )}
                              style={{ backgroundColor: hex }}
                            />
                          )
                        })}
                      </div>
                    )}
                  </button>
                )
              },
            }}
          />
        </div>

        {/* Selected date feedback */}
        {selectedDate && (
          <div className="p-3 bg-muted/50 rounded-lg border text-xs animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span>
                {selectedDate.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDate(undefined)}
                className="text-muted-foreground hover:text-foreground text-[11px] underline"
              >
                {locale === "de" ? "Zurücksetzen" : "Clear"}
              </button>
            </div>
            {selectedDatePickups.length > 0 ? (
              <div className="space-y-1">
                {selectedDatePickups.map((p) => {
                  const hex = colorToHex[p.wasteType?.color || ""] || p.wasteType?.color || "#6b7280"
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                      <span className="font-medium text-foreground">{p.wasteType?.name}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {locale === "de" ? "Keine Müllabfuhr an diesem Tag." : "No pickup on this date."}
              </p>
            )}
          </div>
        )}

        {/* Legend */}
        {distinctWasteTypes.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("legend")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {distinctWasteTypes.map((type) => (
                <div
                  key={type.name}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 border text-xs"
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: type.hex }} />
                  <span className="text-xs text-foreground font-medium">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Pickups */}
        <div className="space-y-2 pt-2 border-t mt-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("upcoming")}
            </h4>
            <Clock className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            {upcomingPickups.length === 0 ? (
              <p className="text-xs text-muted-foreground py-1">
                {locale === "de" ? "Keine anstehenden Termine" : "No upcoming pickups"}
              </p>
            ) : (
              upcomingPickups.map((p) => {
                const hex = colorToHex[p.wasteType?.color || ""] || p.wasteType?.color || "#6b7280"
                const dateObj = new Date(p.date)
                const isToday = new Date().toDateString() === dateObj.toDateString()

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50 text-xs hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                      <span className="truncate font-medium text-foreground">{p.wasteType?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {isToday && (
                        <Badge variant="destructive" className="text-[10px] py-0 px-1.5 h-4">
                          {locale === "de" ? "Heute" : "Today"}
                        </Badge>
                      )}
                      <span className="text-muted-foreground text-[11px] font-mono">
                        {dateObj.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
