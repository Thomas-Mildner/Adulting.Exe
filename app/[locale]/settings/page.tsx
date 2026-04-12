import { DashboardLayout } from "@/components/dashboard-layout"
import {
  NotificationSettings,
  DataSettings,
  AboutSettings
} from "@/components/settings/settings-panel"
import { HeatingSettings } from "@/components/settings/heating-settings"
import { LanguageSwitcher } from "@/components/settings/language-switcher"
import { WasteTypeSettings } from "@/components/settings/waste-type-settings"
import { WebhookSettings } from "@/components/settings/webhook-settings"
import { ModuleSettings } from "@/components/settings/module-settings"
import { getAppConfig, getWasteTypes, getWebhookConfig } from "@/lib/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Home, Layers, Shield } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const [appConfig, wasteTypes, webhookConfig, t] = await Promise.all([
    getAppConfig(),
    getWasteTypes(),
    getWebhookConfig(),
    getTranslations("Settings")
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Bell className="h-4 w-4" />
            {t("general")}
          </TabsTrigger>
          <TabsTrigger value="household" className="gap-2">
            <Home className="h-4 w-4" />
            {t("household")}
          </TabsTrigger>
          <TabsTrigger value="modules" className="gap-2">
            <Layers className="h-4 w-4" />
            {t("modulesTab")}
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Shield className="h-4 w-4" />
            {t("system")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 max-w-2xl animate-in fade-in-50 duration-500">
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
          </div>
          <NotificationSettings />
          <WebhookSettings
            initialUrl={webhookConfig.webhookUrl}
            initialEnabled={webhookConfig.webhookEnabled}
          />
        </TabsContent>

        <TabsContent value="household" className="space-y-6 animate-in fade-in-50 duration-500">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-1">
              <HeatingSettings currentType={appConfig.heatingType} />
            </div>
            <div className="md:col-span-1">
              <WasteTypeSettings initialTypes={wasteTypes} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6 max-w-2xl animate-in fade-in-50 duration-500">
          <ModuleSettings disabledModules={appConfig.disabledModules} />
        </TabsContent>

        <TabsContent value="system" className="space-y-6 max-w-2xl animate-in fade-in-50 duration-500">
          <DataSettings />
          <AboutSettings />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
