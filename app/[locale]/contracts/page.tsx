import { DashboardLayout } from "@/components/dashboard-layout"
import { ContractsManager } from "@/components/contracts/contracts-manager"
import { getContracts } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function ContractsPage() {
  const contracts = await getContracts()
  const t = await getTranslations("Contracts")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ContractsManager contracts={contracts} />
    </DashboardLayout>
  )
}
