import { DashboardLayout } from "@/components/dashboard-layout"
import { Library } from "@/components/library/library"
import { getDocuments } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function LibraryPage() {
  const documents = await getDocuments()

  return (
    <DashboardLayout
      title="Die Bibliothek"
      subtitle="Alle Anleitungen, die du erst öffnest, wenn etwas kaputtgeht."
    >
      <Library documents={documents} />
    </DashboardLayout>
  )
}
