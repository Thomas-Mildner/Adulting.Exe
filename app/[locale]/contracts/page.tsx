import { DashboardLayout } from "@/components/dashboard-layout"
import { ContractsManager } from "@/components/contracts/contracts-manager"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getContracts, getAppConfig } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function ContractsPage() {
  const [contracts, appConfig, t] = await Promise.all([
    getContracts(),
    getAppConfig(),
    getTranslations("Contracts"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="contracts"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("contracts")}
      />
      <ContractsManager contracts={contracts} />
    </DashboardLayout>
  )
}
