import { DashboardLayout } from "@/components/dashboard-layout"
import { VaultGrid } from "@/components/vault/vault-grid"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getTranslations } from "next-intl/server"
import { getAppliances, getAppConfig } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function VaultPage() {
  const [appliances, appConfig, t] = await Promise.all([
    getAppliances(),
    getAppConfig(),
    getTranslations("Vault"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="vault"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("vault")}
      />
      <VaultGrid appliances={appliances} />
    </DashboardLayout>
  )
}
