import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { WasteTypeSettings } from "@/components/settings/waste-type-settings"
import { getWasteTypes } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const wasteTypes = await getWasteTypes()

  return (
    <DashboardLayout
      title="Einstellungen"
      subtitle="Konfiguriere deine digitale Festung."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <SettingsPanel />
        </div>
        <div>
          <WasteTypeSettings wasteTypes={wasteTypes} />
        </div>
      </div>
    </DashboardLayout>
  )
}
