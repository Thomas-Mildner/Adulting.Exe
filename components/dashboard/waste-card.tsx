"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Leaf, FileText, Package, Calendar } from "lucide-react"
import { type WastePickup } from "@/lib/data"
import { Link } from "@/lib/navigation"
import { useTranslations, useFormatter } from "next-intl"

const iconMap: Record<string, React.ElementType> = {
  Trash2,
  Leaf,
  FileText,
  Package,
}

export function WasteCard({ nextPickup }: { nextPickup: WastePickup | null }) {
  const t = useTranslations("WasteCard")
  const format = useFormatter()

  if (!nextPickup) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t("emptyTitle")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("emptySubtitle")}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Calendar className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-xs">{t("emptyMessage")}</p>
            <Link href="/waste" className="mt-4 text-xs text-primary hover:underline">
              {t("manageDates")}
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const Icon = iconMap[nextPickup.wasteType?.icon || "Trash2"] || Trash2
  const date = new Date(nextPickup.date)
  const isToday = new Date().toDateString() === date.toDateString()

  // Calculate relative time
  const diffTime = date.getTime() - new Date().setHours(0, 0, 0, 0)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let relativeText = t("inDays", { days: diffDays })
  if (diffDays === 0) relativeText = t("today")
  if (diffDays === 1) relativeText = t("tomorrow")

  const rawColor = nextPickup.wasteType?.color || "#3b82f6"
  const isHex = rawColor.startsWith("#")
  const iconBgStyle = isHex ? { backgroundColor: `${rawColor}1A` } : { backgroundColor: "rgba(59, 130, 246, 0.1)" }
  const iconColorStyle = isHex ? { color: rawColor } : { color: "#3b82f6" }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
          <Badge variant={isToday ? "destructive" : "secondary"} className="text-[10px] animate-pulse">
            {relativeText}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 py-2">
          <div className="p-3 rounded-full" style={iconBgStyle}>
            <Icon className="h-6 w-6" style={iconColorStyle} />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">{nextPickup.wasteType?.name}</p>
            <p className="text-sm text-muted-foreground">
              {format.dateTime(date, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/waste"
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Calendar className="h-3 w-3" />
            {t("viewCalendar")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
