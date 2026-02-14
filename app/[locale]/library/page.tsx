import { DashboardLayout } from "@/components/dashboard-layout"
import { Library } from "@/components/library/library"
import { getDocuments } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function LibraryPage() {
  const t = await getTranslations("Library")
  const documents = await getDocuments()

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <Library documents={documents} />
    </DashboardLayout>
  )
}
