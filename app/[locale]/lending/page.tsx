import { DashboardLayout } from "@/components/dashboard-layout"
import { LendOMeter } from "@/components/lending/lend-o-meter"
import { getLentItems } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function LendingPage() {
  const lentItems = await getLentItems()
  const t = await getTranslations("Lending")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <LendOMeter lentItems={lentItems} />
    </DashboardLayout>
  )
}
