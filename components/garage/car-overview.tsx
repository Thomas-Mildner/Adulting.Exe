"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, AlertTriangle, CheckCircle2, Snowflake, Sun } from "lucide-react"
import type { Car } from "@/lib/data"
import { getDaysRemaining } from "@/lib/data"

export function CarOverview({ car }: { car: Car }) {
  const t = useTranslations("Garage")

  // Calculate TÜV status
  const getTuvStatus = () => {
    if (!car.nextInspection) return null
    const days = getDaysRemaining(car.nextInspection)
    if (days < 0) return { status: "illegal", color: "destructive", days: Math.abs(days) }
    if (days < 30) return { status: "warning", color: "warning", days }
    return { status: "safe", color: "success", days }
  }

  const tuvStatus = getTuvStatus()

  // Calculate first aid kit status
  const getFirstAidStatus = () => {
    if (!car.firstAidKitExpiry) return null
    const days = getDaysRemaining(car.firstAidKitExpiry)
    if (days < 0) return { expired: true, days: Math.abs(days) }
    return { expired: false, days }
  }

  const firstAidStatus = getFirstAidStatus()

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* TÜV Status Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("tuv.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {tuvStatus ? (
              <div className="space-y-2">
                {tuvStatus.status === "illegal" && (
                  <>
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {t("tuv.illegal")}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t("tuv.overdue", { days: tuvStatus.days })}
                    </p>
                  </>
                )}
                {tuvStatus.status === "warning" && (
                  <>
                    <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-600">
                      <AlertTriangle className="h-3 w-3" />
                      {t("tuv.warning")}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t("tuv.dueIn", { days: tuvStatus.days })}
                    </p>
                  </>
                )}
                {tuvStatus.status === "safe" && (
                  <>
                    <Badge variant="outline" className="gap-1 border-green-500 text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      {t("tuv.safe")}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t("tuv.dueIn", { days: tuvStatus.days })}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("tuv.notSet")}</p>
            )}
          </CardContent>
        </Card>

        {/* Tire Reminder Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("tireReminder.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {car.currentTireType === "summer" ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Snowflake className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-sm">
                  {t("tireReminder.current", {
                    type: t(`tireReminder.${car.currentTireType}`),
                  })}
                </span>
              </div>
              {car.tireStorageLocation ? (
                <p className="text-xs text-muted-foreground">
                  {t("tireReminder.storage", { location: car.tireStorageLocation })}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">{t("tireReminder.noStorage")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* First Aid Kit Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("firstAid.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {firstAidStatus ? (
              <div className="space-y-2">
                {firstAidStatus.expired ? (
                  <>
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {t("tuv.expired")}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{t("firstAid.expired")}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("firstAid.expires", { date: car.firstAidKitExpiry || "" })}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("firstAid.notSet")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("details.title")}</CardTitle>
          <CardDescription>
            {car.brand} {car.model} • {car.licensePlate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">{t("details.purchaseDate")}</p>
              <p className="text-sm text-muted-foreground">{car.purchaseDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium">{t("details.purchasePrice")}</p>
              <p className="text-sm text-muted-foreground">
                €{car.purchasePrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="maintenance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="maintenance">{t("tabs.maintenance")}</TabsTrigger>
          <TabsTrigger value="fuel">{t("tabs.fuel")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("tabs.analytics")}</TabsTrigger>
          <TabsTrigger value="documents">{t("tabs.documents")}</TabsTrigger>
        </TabsList>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>{t("maintenance.title")}</CardTitle>
              <CardDescription>{t("maintenance.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("maintenance.empty")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle>{t("fuel.title")}</CardTitle>
              <CardDescription>{t("fuel.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("fuel.fuelEmpty")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>{t("costSummary.title")}</CardTitle>
              <CardDescription>{t("costSummary.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("details.analyticsPlaceholder")}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{t("documents.title")}</CardTitle>
              <CardDescription>{t("documents.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("documents.empty")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
