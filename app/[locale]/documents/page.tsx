import { DashboardLayout } from "@/components/dashboard-layout"
import { DocumentsView } from "@/components/documents/documents-view"
import { getTranslations } from "next-intl/server"
import { getPersons, getIdentityDocuments } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function DocumentsPage() {
  const [persons, documents, t] = await Promise.all([
    getPersons(),
    getIdentityDocuments(),
    getTranslations("Documents"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <DocumentsView persons={persons} documents={documents} />
    </DashboardLayout>
  )
}
