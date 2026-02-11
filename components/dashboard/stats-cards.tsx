"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Wrench, Receipt } from "lucide-react"
import { type Appliance, type MaintenanceTask, formatCurrency } from "@/lib/data"

type StatsCardsProps = {
  appliances: Appliance[]
  maintenanceTasks: MaintenanceTask[]
  taxDeductible: number
}

export function StatsCards({ appliances, maintenanceTasks, taxDeductible }: StatsCardsProps) {
  const stats = [
    {
      title: "Aktive Garantien",
      value: appliances.filter((a) => a.status === "protected").length.toString(),
      subtitle: `${appliances.filter((a) => a.status === "zombie").length} abgelaufen, ${appliances.filter((a) => a.status === "solo").length} ohne Schutz`,
      icon: ShieldCheck,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Offene Wartungen",
      value: maintenanceTasks.filter((t) => !t.completed).length.toString(),
      subtitle: `${maintenanceTasks.filter((t) => t.priority === "high" && !t.completed).length} hohe Prioritaet`,
      icon: Wrench,
      accent: "bg-chart-3/10 text-chart-3",
    },
    {
      title: "Steuerlich absetzbar (2025)",
      value: formatCurrency(taxDeductible),
      subtitle: "Handwerkerkosten gesamt",
      icon: Receipt,
      accent: "bg-success/10 text-success",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold tabular-nums text-foreground tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.accent}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
