import { DashboardLayout } from "@/components/dashboard-layout"
import { DocumentsView } from "@/components/documents/documents-view"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getTranslations } from "next-intl/server"
import { getPersons, getIdentityDocuments, getAppConfig } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function DocumentsPage() {
  const [persons, documents, appConfig, t] = await Promise.all([
    getPersons(),
    getIdentityDocuments(),
    getAppConfig(),
    getTranslations("Documents"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="documents"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("documents")}
      />
      <DocumentsView persons={persons} documents={documents} />
    </DashboardLayout>
  )
}
