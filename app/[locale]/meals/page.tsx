import { DashboardLayout } from "@/components/dashboard-layout"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { ExternalLink, Utensils } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function MealsPage() {
    const t = await getTranslations("Meals")

    return (
        <DashboardLayout
            title={t("title")}
            subtitle={t("subtitle")}
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="flex flex-col justify-center h-full border-primary/20 bg-primary/5">
                    <CardHeader>
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <Utensils className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl">{t("title")}</CardTitle>
                        <CardDescription className="text-base mt-2">
                            {t("description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <a href="https://7-meals.vercel.app/" target="_blank" rel="noopener noreferrer">
                                {t("openApp")}
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-3">
                            {t("openAppSubtitle")}
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border shadow-sm">
                    <div className="aspect-[4/3] w-full bg-muted relative flex items-center justify-center overflow-hidden">
                        {/* We use an iframe to load the actual app as a preview */}
                        <iframe 
                            src="https://7-meals.vercel.app/" 
                            className="w-full h-full border-0 pointer-events-auto"
                            title="7-meals Preview"
                            loading="lazy"
                        />
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    )
}
