import { DashboardLayout } from "@/components/dashboard-layout"
import { getTranslations } from "next-intl/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPlants, getSoilTreatments, getIrrigationZones, getLandscapingProjects } from "@/lib/actions"
// Components
import { PlantsGrid } from "@/components/outdoor/plants-grid"
import { SoilHistory } from "@/components/outdoor/soil-history"
import { IrrigationSchedules } from "@/components/outdoor/irrigation-schedules"
import { GardenGallery } from "@/components/outdoor/garden-gallery"

export const dynamic = "force-dynamic"

export default async function OutdoorPage() {
    const t = await getTranslations("Outdoor")

    const [plants, soilTreatments, irrigationZones, landscapingProjects] = await Promise.all([
        getPlants(),
        getSoilTreatments(),
        getIrrigationZones(),
        getLandscapingProjects(),
    ])

    return (
        <DashboardLayout title={t("title")} subtitle={t("subtitle")}>
            <div className="space-y-6">
                <Tabs defaultValue="plants" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                        <TabsTrigger value="plants">{t("tabs.plants")}</TabsTrigger>
                        <TabsTrigger value="soil">{t("tabs.soil")}</TabsTrigger>
                        <TabsTrigger value="irrigation">{t("tabs.irrigation")}</TabsTrigger>
                        <TabsTrigger value="gallery">{t("tabs.gallery")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="plants" className="mt-6 space-y-4">
                        <PlantsGrid initialPlants={plants} />
                    </TabsContent>

                    <TabsContent value="soil" className="mt-6 space-y-4">
                        <SoilHistory initialTreatments={soilTreatments} />
                    </TabsContent>

                    <TabsContent value="irrigation" className="mt-6 space-y-4">
                        <IrrigationSchedules initialZones={irrigationZones} />
                    </TabsContent>

                    <TabsContent value="gallery" className="mt-6 space-y-4">
                        <GardenGallery initialProjects={landscapingProjects} />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
