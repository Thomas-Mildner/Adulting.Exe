"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin } from "lucide-react"
import {
  appliances,
  getDaysRemaining,
  getWarrantyPercent,
  formatCurrency,
  type Appliance,
} from "@/lib/data"

const statusConfig: Record<
  Appliance["status"],
  { label: string; style: string }
> = {
  protected: {
    label: "Unter Schutz",
    style: "bg-success/10 text-success border-success/20",
  },
  solo: {
    label: "Auf sich allein gestellt",
    style: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  zombie: {
    label: "Zombie-Modus",
    style: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

export function VaultGrid() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return appliances
      .filter(
        (a) =>
          (tab === "all" ||
            (tab === "active" && a.status !== "zombie") ||
            (tab === "zombie" && a.status === "zombie")) &&
          (a.name.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.brand.toLowerCase().includes(q) ||
            a.boxLocation.toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime()
      )
  }, [search, tab])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs value={tab} onValueChange={setTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">
              Alle ({appliances.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Aktiv ({appliances.filter((a) => a.status !== "zombie").length})
            </TabsTrigger>
            <TabsTrigger value="zombie">
              Zombie ({appliances.filter((a) => a.status === "zombie").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Tresor durchsuchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {"Nichts gefunden. Entweder falsch gesucht oder du besitzt nichts. Beides besorgniserregend."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const days = getDaysRemaining(item.warrantyEnd)
            const pct = getWarrantyPercent(item.purchaseDate, item.warrantyEnd)
            const { label, style } = statusConfig[item.status]

            return (
              <Card
                key={item.id}
                className="group transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.brand} &middot; {item.category} &middot;{" "}
                        {formatCurrency(item.price)}
                      </p>
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
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Garantie</span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {days > 0 ? `${days} Tage uebrig` : "Abgelaufen"}
                      </span>
                    </div>
                    <Progress
                      value={Math.max(pct, 0)}
                      className="h-1.5"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>
                        {new Date(item.purchaseDate).toLocaleDateString(
                          "de-DE",
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                      <span>
                        {new Date(item.warrantyEnd).toLocaleDateString(
                          "de-DE",
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 border-t">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      {item.boxLocation}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
