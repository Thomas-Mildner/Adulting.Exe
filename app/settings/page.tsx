import { DashboardLayout } from "@/components/dashboard-layout"
import {
  NotificationSettings,
  DataSettings,
  AboutSettings
} from "@/components/settings/settings-panel"
import { HeatingSettings } from "@/components/settings/heating-settings"
import { getWasteTypes, getAppConfig } from "@/lib/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Home, Shield } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const [wasteTypes, appConfig] = await Promise.all([
    getWasteTypes(),
    getAppConfig()
  ])

  return (
    <DashboardLayout
      title="Einstellungen"
      subtitle="Konfiguriere deine digitale Festung."
    >
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Bell className="h-4 w-4" />
            Allgemein
          </TabsTrigger>
          <TabsTrigger value="household" className="gap-2">
            <Home className="h-4 w-4" />
            Haushalt
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Shield className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 max-w-2xl animate-in fade-in-50 duration-500">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="household" className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-1">
              <HeatingSettings currentType={appConfig.heatingType} />
            </div>
            
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6 max-w-2xl animate-in fade-in-50 duration-500">
          <DataSettings />
          <AboutSettings />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
