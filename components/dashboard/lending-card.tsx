"use client"

import { useTranslations } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDaysRemaining, type LentItem } from "@/lib/data"
import { Link } from "@/lib/navigation"
import { ArrowRight, ShieldAlert } from "lucide-react"

export function LendingCard({ lentItems }: { lentItems: LentItem[] }) {
  const t = useTranslations("LendingCard")
  const overdue = lentItems.filter((i) => getDaysRemaining(i.expectedReturn) < 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
          <Link
            href="/lending"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            {t("viewAll")} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("overdueMessage", { count: overdue.length })}
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
                  {t("lentTo", { name: item.borrower })} &middot; {t("trust")}:{" "}
                  {"*".repeat(item.trustLevel)}
                  {"*".repeat(0)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 ${isOverdue
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "text-muted-foreground"
                  }`}
              >
                {isOverdue
                  ? t("daysOverdue", { days: Math.abs(days) })
                  : t("daysRemaining", { days })
                }
              </Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
