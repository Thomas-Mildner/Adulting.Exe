import { DashboardLayout } from "@/components/dashboard-layout"
import { LendOMeter } from "@/components/lending/lend-o-meter"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getLentItems, getAppConfig } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function LendingPage() {
  const [lentItems, appConfig, t] = await Promise.all([
    getLentItems(),
    getAppConfig(),
    getTranslations("Lending"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="lending"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("lending")}
      />
      <LendOMeter lentItems={lentItems} />
    </DashboardLayout>
  )
}
