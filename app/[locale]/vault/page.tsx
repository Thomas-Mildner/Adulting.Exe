import { DashboardLayout } from "@/components/dashboard-layout"
import { VaultGrid } from "@/components/vault/vault-grid"
import { getTranslations } from "next-intl/server"
import { getAppliances } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function VaultPage() {
  const appliances = await getAppliances()
  const t = await getTranslations("Vault")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <VaultGrid appliances={appliances} />
    </DashboardLayout>
  )
}
