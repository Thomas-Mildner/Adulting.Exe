import { DashboardLayout } from "@/components/dashboard-layout"
import { getAppliance } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Download } from "lucide-react"
import { Link } from "@/lib/navigation"
import QRCode from "react-qr-code"
import { PrintButton } from "@/components/vault/print-button"
import { getTranslations } from "next-intl/server"

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
    const [appliance, t] = await Promise.all([
        getAppliance(id),
        getTranslations("Vault"),
    ])

    if (!appliance) {
        notFound()
    }

    const statusKey = appliance.status as "protected" | "solo" | "zombie"
    const label = ["protected", "solo", "zombie"].includes(appliance.status)
        ? t(`status.${statusKey}`)
        : t("detail.unknown")
    const style = statusStyles[appliance.status] || ""

    const dateLocale = locale === "de" ? "de-DE" : "en-US"

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
                            {t("detail.back")}
                        </Button>
                    </Link>
                    <PrintButton />
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl">{appliance.name}</CardTitle>
                                <p className="text-muted-foreground">{appliance.brand} ({appliance.category})</p>
                            </div>
                            <Badge variant="outline" className={style}>{label}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">{t("fields.purchaseDate")}</p>
                                <p className="font-medium">{new Date(appliance.purchaseDate).toLocaleDateString(dateLocale)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">{t("fields.warrantyEnd")}</p>
                                <p className="font-medium">{new Date(appliance.warrantyEnd).toLocaleDateString(dateLocale)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">{t("fields.price")}</p>
                                <p className="font-medium">{new Intl.NumberFormat(dateLocale, { style: "currency", currency: "EUR" }).format(appliance.price)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">{t("fields.boxLocation")}</p>
                                <p className="font-medium">{appliance.boxLocation}</p>
                            </div>
                        </div>

                        {appliance.receiptPath && (
                            <div className="pt-4 border-t space-y-3">
                                <p className="text-sm font-medium">{t("detail.receipt")}</p>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={appliance.receiptPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <FileText className="h-4 w-4" />
                                            {t("detail.preview")}
                                        </Button>
                                    </a>
                                    <a
                                        href={`/api/vault/download?id=${appliance.id}`}
                                    >
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Download className="h-4 w-4" />
                                            {t("detail.download")}
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t flex flex-col items-center gap-4">
                            <p className="text-sm text-muted-foreground">{t("detail.scanHint")}</p>
                            <div className="p-4 bg-white rounded-lg shadow-sm border">
                                <QRCode value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/vault/${appliance.id}`} size={200} />
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">{appliance.id}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

