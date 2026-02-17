import { DashboardLayout } from "@/components/dashboard-layout"
import { InsuranceList } from "@/components/insurance/insurance-list"
import { getTranslations } from "next-intl/server"
import { getInsurances } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function InsurancePage() {
  const insurances = await getInsurances()
  const t = await getTranslations("Insurance")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <InsuranceList insurances={insurances} />
    </DashboardLayout>
  )
}
