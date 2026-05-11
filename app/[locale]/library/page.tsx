import { DashboardLayout } from "@/components/dashboard-layout"
import { Library } from "@/components/library/library"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getDocuments, getAppConfig } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function LibraryPage() {
  const [documents, appConfig, t] = await Promise.all([
    getDocuments(),
    getAppConfig(),
    getTranslations("Library"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="library"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("library")}
      />
      <Library documents={documents} />
    </DashboardLayout>
  )
}
