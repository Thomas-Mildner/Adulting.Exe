import { DashboardLayout } from "@/components/dashboard-layout"
import { PetManager } from "@/components/pets/pet-manager"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getPets, getVetRecords, getVaccinations, getAppConfig } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function PetsPage() {
  const [pets, vetRecords, vaccinations, appConfig, t] = await Promise.all([
    getPets(),
    getVetRecords(),
    getVaccinations(),
    getAppConfig(),
    getTranslations("Pets"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="pets"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("pets")}
      />
      <PetManager
        initialPets={pets}
        initialVetRecords={vetRecords}
        initialVaccinations={vaccinations}
      />
    </DashboardLayout>
  )
}
