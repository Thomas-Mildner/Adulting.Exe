import { DashboardLayout } from "@/components/dashboard-layout"
import { VaultGrid } from "@/components/vault/vault-grid"
import { getAppliances } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function VaultPage() {
  const appliances = await getAppliances()

  return (
    <DashboardLayout
      title="Der Garantie- & Kartontresor"
      subtitle="Wo Quittungen ihr bestes Leben führen."
    >
      <VaultGrid appliances={appliances} />
    </DashboardLayout>
  )
}
