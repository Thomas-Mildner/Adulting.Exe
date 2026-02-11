"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { lentItems, getDaysRemaining } from "@/lib/data"
import { ShieldAlert, ShieldCheck } from "lucide-react"

function TrustStars({ level }: { level: number }) {
  const labels = ["", "Autsch", "Hmm", "Okay", "Solide", "Seelenverwandt"]
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-sm ${
              i < level ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">{labels[level]}</span>
    </div>
  )
}

export function LendOMeter() {
  const overdue = lentItems.filter((i) => getDaysRemaining(i.expectedReturn) < 0)
  const active = lentItems.filter((i) => getDaysRemaining(i.expectedReturn) >= 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Verliehene Sachen
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {lentItems.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Verstreut in der Nachbarschaft
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Puenktlich
            </p>
            <p className="text-2xl font-semibold tabular-nums text-success mt-1">
              {active.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {"Glaube an die Menschheit: haelt"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Ueberfaellig
            </p>
            <p className="text-2xl font-semibold tabular-nums text-destructive mt-1">
              {overdue.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {overdue.length > 0
                ? "Zeit fuer eine peinliche Nachricht"
                : "Keine passiv-aggressiven Nachrichten noetig"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Alle verliehenen Gegenstaende</CardTitle>
          <p className="text-xs text-muted-foreground">
            {"Behalte im Blick, was draussen ist. Und wer es hat. Und wann du es zurueckbekommst (hoffentlich)."}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Gegenstand</TableHead>
                <TableHead className="text-xs">Nachbar</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Ausleihdatum</TableHead>
                <TableHead className="text-xs">Rueckgabe bis</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Vertrauenslevel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lentItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-sm text-muted-foreground"
                  >
                    {"Nichts verliehen. Entweder sehr vorsichtig oder kein Werkzeug."}
                  </TableCell>
                </TableRow>
              ) : (
                lentItems
                  .sort((a, b) => getDaysRemaining(a.expectedReturn) - getDaysRemaining(b.expectedReturn))
                  .map((item) => {
                    const days = getDaysRemaining(item.expectedReturn)
                    const isOverdue = days < 0

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          {isOverdue ? (
                            <ShieldAlert className="h-4 w-4 text-destructive" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-success" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">
                          {item.item}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {item.borrower}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground tabular-nums hidden sm:table-cell">
                          {new Date(item.lentDate).toLocaleDateString("de-DE", {
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              isOverdue
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : days <= 3
                                  ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {isOverdue
                              ? `${Math.abs(days)}T ueberfaellig`
                              : `${days}T uebrig`}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <TrustStars level={item.trustLevel} />
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
