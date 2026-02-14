"use client"

import { useTranslations } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getDaysRemaining, getWarrantyPercent, type Appliance } from "@/lib/data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Status labels moved inside component for translation
/*const statusLabels: Record<string, { label: string; style: string }> = {
  protected: { label: "Unter Schutz", style: "bg-success/10 text-success border-success/20" },
  solo: { label: "Auf sich allein gestellt", style: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
  zombie: { label: "Zombie-Modus", style: "bg-destructive/10 text-destructive border-destructive/20" },
}*/

export function WarrantyOverview({ appliances }: { appliances: Appliance[] }) {
  const t = useTranslations("WarrantyOverview")

  const statusStyles: Record<string, string> = {
    protected: "bg-success/10 text-success border-success/20",
    solo: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    zombie: "bg-destructive/10 text-destructive border-destructive/20",
  }
  const upcoming = appliances
    .filter((a) => a.status !== "zombie")
    .sort(
      (a, b) =>
        new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime()
    )
    .slice(0, 4)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
          <Link
            href="/vault"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            {t("openVault")} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.map((item) => {
          const days = getDaysRemaining(item.warrantyEnd)
          const pct = getWarrantyPercent(item.purchaseDate, item.warrantyEnd)
          const style = statusStyles[item.status]
          const label = t(`status.${item.status}`)

          return (
            <div key={item.id} className="space-y-2 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.brand} &middot; {item.boxLocation}
                  </p>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ml-2 ${style}`}>
                  {label}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={pct} className="h-1.5 flex-1" />
                <span className="text-[11px] font-mono text-muted-foreground tabular-nums w-14 text-right">
                  {days > 0
                    ? t("daysRemaining", { days })
                    : t("expired")}
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
