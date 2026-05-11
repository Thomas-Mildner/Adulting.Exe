import { DashboardLayout } from "@/components/dashboard-layout"
import { GarageManager } from "@/components/garage/garage-manager"
import { getCars } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function GaragePage() {
  const cars = await getCars()
  const t = await getTranslations("Garage")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <GarageManager initialCars={cars} />
    </DashboardLayout>
  )
}
