"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { lentItems, getDaysRemaining } from "@/lib/data"
import Link from "next/link"
import { ArrowRight, ShieldAlert } from "lucide-react"

export function LendingCard() {
  const overdue = lentItems.filter((i) => getDaysRemaining(i.expectedReturn) < 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Verleih-O-Meter</CardTitle>
          <Link
            href="/lending"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Alle anzeigen <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          {overdue.length > 0
            ? `${overdue.length} Gegenstand${overdue.length > 1 ? "e" : ""} ueberfaellig. Vertrauensprobleme im Anmarsch.`
            : "Alles zurueckgegeben. Glaube an die Menschheit: intakt."}
        </p>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {lentItems.slice(0, 4).map((item) => {
          const days = getDaysRemaining(item.expectedReturn)
          const isOverdue = days < 0

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors"
            >
              {isOverdue && <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{item.item}</p>
                <p className="text-[11px] text-muted-foreground">
                  Verliehen an {item.borrower} &middot; Vertrauen:{" "}
                  {"*".repeat(item.trustLevel)}
                  {"*".repeat(0)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 ${
                  isOverdue
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "text-muted-foreground"
                }`}
              >
                {isOverdue ? `${Math.abs(days)}T ueberfaellig` : `${days}T uebrig`}
              </Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
