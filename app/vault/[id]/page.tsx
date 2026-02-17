import { DashboardLayout } from "@/components/dashboard-layout"
import { getAppliance } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import QRCode from "react-qr-code"
import { PrintButton } from "@/components/vault/print-button"

const statusConfig = {
    protected: { label: "Unter Schutz", style: "bg-success/10 text-success border-success/20" },
    solo: { label: "Auf sich allein gestellt", style: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
    zombie: { label: "Zombie-Modus", style: "bg-destructive/10 text-destructive border-destructive/20" },
}

export default async function ApplianceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const appliance = await getAppliance(id)

    if (!appliance) {
        notFound()
    }

    const { label, style } = statusConfig[appliance.status] || { label: "Unbekannt", style: "" }

    return (
        <DashboardLayout
            title={appliance.name}
            subtitle={`Details zu deinem ${appliance.brand}-Gerät.`}
        >
            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                    <Link href="/vault">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Zurück zum Tresor
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
                                <p className="text-muted-foreground">Kaufdatum</p>
                                <p className="font-medium">{new Date(appliance.purchaseDate).toLocaleDateString("de-DE")}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Garantie bis</p>
                                <p className="font-medium">{new Date(appliance.warrantyEnd).toLocaleDateString("de-DE")}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Preis</p>
                                <p className="font-medium">{new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(appliance.price)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Lagerort</p>
                                <p className="font-medium">{appliance.boxLocation}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t flex flex-col items-center gap-4">
                            <p className="text-sm text-muted-foreground">Scanne diesen Code, um direkt hierher zu gelangen.</p>
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
