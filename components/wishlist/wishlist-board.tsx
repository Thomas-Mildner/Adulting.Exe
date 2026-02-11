"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, type WishlistProject } from "@/lib/data"

const urgencyConfig: Record<
  WishlistProject["urgency"],
  { label: string; style: string }
> = {
  "nice-to-have": {
    label: "Wäre schön",
    style: "bg-muted text-muted-foreground",
  },
  "should-do": {
    label: "Sollte man machen",
    style: "bg-primary/10 text-primary border-primary/20",
  },
  "need-soon": {
    label: "Bald nötig",
    style: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  "falling-apart": {
    label: "Haus fällt auseinander",
    style: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

export function WishlistBoard({ wishlistProjects }: { wishlistProjects: WishlistProject[] }) {
  const totalEstimated = wishlistProjects.reduce(
    (s, p) => s + p.estimatedCost,
    0
  )
  const totalSaved = wishlistProjects.reduce(
    (s, p) => s + p.currentSavings,
    0
  )

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Projekte gesamt
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {wishlistProjects.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {wishlistProjects.filter((p) => p.urgency === "falling-apart").length}{" "}
              dringend
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Geschätzte Kosten
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {formatCurrency(totalEstimated)}
            </p>
            <p className="text-xs text-muted-foreground">
              {"Das sind viele Avocado-Toasts"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Gesamt gespart
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalSaved / totalEstimated) * 100)}% geschafft
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistProjects
          .sort((a, b) => {
            const order: WishlistProject["urgency"][] = [
              "falling-apart",
              "need-soon",
              "should-do",
              "nice-to-have",
            ]
            return order.indexOf(a.urgency) - order.indexOf(b.urgency)
          })
          .map((project) => {
            const pct = Math.round(
              (project.currentSavings / project.estimatedCost) * 100
            )
            const remaining = project.estimatedCost - project.currentSavings
            const { label, style } = urgencyConfig[project.urgency]

            return (
              <Card
                key={project.id}
                className="transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium text-foreground">
                        {project.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {project.category}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${style}`}
                    >
                      {label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">
                        {formatCurrency(project.currentSavings)} /{" "}
                        {formatCurrency(project.estimatedCost)}
                      </span>
                      <span className="font-mono text-foreground font-medium tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                  <p className="text-[10px] text-muted-foreground pt-1 border-t">
                    {pct >= 90
                      ? `${pct}% geschafft! Fast Zeit zum Loslegen.`
                      : pct >= 50
                        ? `Halbzeit. Weiter sparen!`
                        : `Noch ${formatCurrency(remaining)} zu gehen. Limonadenstand eröffnen?`}
                  </p>
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
