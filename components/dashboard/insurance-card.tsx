"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertCircle, TrendingUp } from "lucide-react"
import { type Insurance, formatCurrency, getDaysRemaining } from "@/lib/data"
import { Link } from "@/lib/navigation"

function calculateMonthlyPremium(amount: number, frequency: Insurance["paymentFrequency"]): number {
  if (frequency === "Monthly") return amount
  if (frequency === "Quarterly") return amount / 3
  if (frequency === "Annually") return amount / 12
  return 0
}

export function InsuranceCard({ insurances }: { insurances: Insurance[] }) {
  const t = useTranslations("Insurance")

  if (!insurances || insurances.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t("title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{t("list.empty")}</p>
        </CardHeader>
        <CardContent>
          <Link href="/insurance">
            <Button size="sm" variant="outline" className="w-full">
              {t("create.button")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // Calculate total monthly premium
  const totalMonthly = insurances.reduce((sum, ins) => {
    return sum + calculateMonthlyPremium(ins.premiumAmount, ins.paymentFrequency)
  }, 0)

  const totalYearly = totalMonthly * 12

  // Find policies expiring soon (within 90 days)
  const expiringSoon = insurances.filter((ins) => {
    const daysToCancel = getDaysRemaining(ins.cancellationDeadline)
    return daysToCancel > 0 && daysToCancel <= 90
  })

  const activeCount = insurances.filter((ins) => getDaysRemaining(ins.cancellationDeadline) > 0).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t("title")}
          </CardTitle>
          <Link href="/insurance">
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              {t("list.title")}
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {t("stats.totalPolicies")}
            </p>
            <p className="text-2xl font-semibold tabular-nums">{insurances.length}</p>
            <p className="text-[10px] text-muted-foreground">
              {activeCount} {t("stats.activePolicies").toLowerCase()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {t("stats.premiumPerMonth")}
            </p>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(totalMonthly)}</p>
            <p className="text-[10px] text-muted-foreground">
              {formatCurrency(totalYearly)} / {t("paymentFrequency.Annually").toLowerCase()}
            </p>
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringSoon.length > 0 && (
          <div className="rounded-lg bg-chart-3/10 border border-chart-3/20 p-3 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-chart-3 mt-0.5 shrink-0" />
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs font-medium text-chart-3">
                  {expiringSoon.length} {t("stats.expiringPolicies")}
                </p>
                <div className="space-y-1">
                  {expiringSoon.slice(0, 3).map((ins) => {
                    const days = getDaysRemaining(ins.cancellationDeadline)
                    return (
                      <div
                        key={ins.id}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="text-muted-foreground truncate">
                          {ins.providerName}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] bg-background/50 border-chart-3/30 shrink-0 ml-2"
                        >
                          {days}d
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Breakdown by Type (Top 3) */}
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {t("summary.title")}
          </p>
          <div className="space-y-1.5">
            {Object.entries(
              insurances.reduce((acc, ins) => {
                const key = ins.policyType === "Custom" && ins.customPolicyType
                  ? ins.customPolicyType
                  : ins.policyType
                const monthly = calculateMonthlyPremium(ins.premiumAmount, ins.paymentFrequency)
                acc[key] = (acc[key] || 0) + monthly
                return acc
              }, {} as Record<string, number>)
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([type, monthly]) => (
                <div key={type} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground truncate">{type}</span>
                  <span className="font-mono tabular-nums text-foreground font-medium">
                    {formatCurrency(monthly)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
