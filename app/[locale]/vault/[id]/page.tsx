import { DashboardLayout } from "@/components/dashboard-layout"
import { getAppliance } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/lib/navigation"
import QRCode from "react-qr-code"
import { PrintButton } from "@/components/vault/print-button"
import { getTranslations, getFormatter } from "next-intl/server"

const statusStyles: Record<string, string> = {
  protected: "bg-success/10 text-success border-success/20",
  solo: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  zombie: "bg-destructive/10 text-destructive border-destructive/20",
}

export default async function ApplianceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const [appliance, t, format] = await Promise.all([
    getAppliance(id),
    getTranslations("Vault"),
    getFormatter(),
  ])

  if (!appliance) {
    notFound()
  }

  const statusLabel =
    appliance.status in t.raw("status")
      ? t(`status.${appliance.status as "protected" | "solo" | "zombie"}`)
      : t("detail.unknown")
  const statusStyle = statusStyles[appliance.status] || ""

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const qrUrl = `${appUrl}/${locale}/vault/${appliance.id}`

  return (
    <DashboardLayout
      title={appliance.name}
      subtitle={t("detail.subtitle", { brand: appliance.brand })}
    >
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/vault">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("detail.backToVault")}
            </Button>
          </Link>
          <PrintButton />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{appliance.name}</CardTitle>
                <p className="text-muted-foreground">
                  {appliance.brand} ({appliance.category})
                </p>
              </div>
              <Badge variant="outline" className={statusStyle}>
                {statusLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("fields.purchaseDate")}</p>
                <p className="font-medium">
                  {format.dateTime(new Date(appliance.purchaseDate), { dateStyle: "medium" })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("fields.warrantyEnd")}</p>
                <p className="font-medium">
                  {format.dateTime(new Date(appliance.warrantyEnd), { dateStyle: "medium" })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("fields.price")}</p>
                <p className="font-medium">
                  {format.number(appliance.price, { style: "currency", currency: "EUR" })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("fields.boxLocation")}</p>
                <p className="font-medium">{appliance.boxLocation}</p>
              </div>
            </div>

            <div className="pt-6 border-t flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">{t("detail.qrScanPrompt")}</p>
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <QRCode value={qrUrl} size={200} />
              </div>
              <p className="text-xs text-muted-foreground font-mono">{appliance.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

