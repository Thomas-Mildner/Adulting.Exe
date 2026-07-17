import { DashboardLayout } from "@/components/dashboard-layout"
import { IllnessManager } from "@/components/illnesses/illness-manager"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getAppConfig, getIllnesses, getPersons } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function IllnessesPage() {
  const [persons, illnesses, appConfig, t] = await Promise.all([
    getPersons(),
    getIllnesses(),
    getAppConfig(),
    getTranslations("Illnesses"),
  ])

  return (
    <DashboardLayout title={t("title")} subtitle={t("subtitle")}>
      <ModuleTutorial
        moduleKey="illnesses"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("illnesses")}
      />
      <IllnessManager persons={persons} illnesses={illnesses} />
    </DashboardLayout>
  )
}
