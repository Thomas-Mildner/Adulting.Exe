"use client"

import { Card, CardContent } from "@/components/ui/card"
import { appliances, maintenanceTasks, lentItems, getDaysRemaining } from "@/lib/data"

export function HouseHealth() {
  const activeWarranties = appliances.filter((a) => a.status === "protected").length
  const totalAppliances = appliances.length
  const pendingTasks = maintenanceTasks.filter((t) => !t.completed).length
  const highPriority = maintenanceTasks.filter(
    (t) => t.priority === "high" && !t.completed
  ).length
  const overdueItems = lentItems.filter(
    (i) => getDaysRemaining(i.expectedReturn) < 0
  ).length

  const score = Math.round(
    ((activeWarranties / totalAppliances) * 40 +
      ((1 - highPriority / Math.max(pendingTasks, 1)) * 40) +
      ((1 - overdueItems / Math.max(lentItems.length, 1)) * 20))
  )

  const getVerdict = () => {
    if (score >= 80) return { text: "Steht (vorerst)", color: "text-success" }
    if (score >= 60) return { text: "Braucht Aufmerksamkeit", color: "text-chart-3" }
    if (score >= 40) return { text: "Klebeband-Territorium", color: "text-warning" }
    return { text: "Beten und Handwerker rufen", color: "text-destructive" }
  }

  const verdict = getVerdict()

  return (
    <Card className="border-dashed">
      <CardContent className="py-4 px-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Hauszustand
            </p>
            <p className={`text-lg font-semibold ${verdict.color}`}>{verdict.text}</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums text-foreground">{score}</span>
            <span className="text-xs text-muted-foreground font-mono">/100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
