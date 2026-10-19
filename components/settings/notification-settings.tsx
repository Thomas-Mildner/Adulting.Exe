"use client"

import * as React from "react"
import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  Bell,
  Clock,
  FileText,
  Handshake,
  Loader2,
  ShieldAlert,
  Trash2,
  Wrench,
  Car,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { updateNotificationSettings } from "@/lib/actions"

interface NotificationSettingsProps {
  initialConfig?: {
    notifyWarranty?: boolean
    warrantyAlertDays?: number
    notifyMaintenance?: boolean
    maintenanceAlertDays?: number
    notifyDocuments?: boolean
    documentAlertDays?: number
    notifyInspection?: boolean
    inspectionAlertDays?: number
    notifyLending?: boolean
    notifyWaste?: boolean
  }
}

export function NotificationSettings({ initialConfig }: NotificationSettingsProps) {
  const t = useTranslations("Settings.notifications")
  const [isPending, startTransition] = useTransition()

  const [notifyWarranty, setNotifyWarranty] = useState(initialConfig?.notifyWarranty ?? true)
  const [warrantyDays, setWarrantyDays] = useState(initialConfig?.warrantyAlertDays ?? 30)

  const [notifyMaintenance, setNotifyMaintenance] = useState(initialConfig?.notifyMaintenance ?? true)
  const [maintenanceDays, setMaintenanceDays] = useState(initialConfig?.maintenanceAlertDays ?? 7)

  const [notifyDocuments, setNotifyDocuments] = useState(initialConfig?.notifyDocuments ?? true)
  const [documentDays, setDocumentDays] = useState(initialConfig?.documentAlertDays ?? 90)

  const [notifyInspection, setNotifyInspection] = useState(initialConfig?.notifyInspection ?? true)
  const [inspectionDays, setInspectionDays] = useState(initialConfig?.inspectionAlertDays ?? 30)

  const [notifyLending, setNotifyLending] = useState(initialConfig?.notifyLending ?? true)
  const [notifyWaste, setNotifyWaste] = useState(initialConfig?.notifyWaste ?? true)

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await updateNotificationSettings({
          notifyWarranty,
          warrantyAlertDays: Math.max(1, warrantyDays || 30),
          notifyMaintenance,
          maintenanceAlertDays: Math.max(1, maintenanceDays || 7),
          notifyDocuments,
          documentAlertDays: Math.max(1, documentDays || 90),
          notifyInspection,
          inspectionAlertDays: Math.max(1, inspectionDays || 30),
          notifyLending,
          notifyWaste,
        })
        if (res.success) {
          toast.success(t("saveSuccess"))
        }
      } catch {
        toast.error("Failed to save notification settings")
      }
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warranty alerts */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-medium text-foreground">{t("warranty")}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("warrantyDesc")}
              </p>
            </div>
            <Switch
              checked={notifyWarranty}
              onCheckedChange={setNotifyWarranty}
            />
          </div>
          {notifyWarranty && (
            <div className="mt-2.5 ml-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-md">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{t("leadTime")}:</span>
              <Input
                type="number"
                min={1}
                max={365}
                value={warrantyDays}
                onChange={(e) => setWarrantyDays(parseInt(e.target.value) || 0)}
                className="h-7 w-20 text-xs bg-background"
              />
              <span>{t("days")}</span>
            </div>
          )}
          <Separator className="mt-4" />
        </div>

        {/* Maintenance alerts */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium text-foreground">{t("maintenance")}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("maintenanceDesc")}
              </p>
            </div>
            <Switch
              checked={notifyMaintenance}
              onCheckedChange={setNotifyMaintenance}
            />
          </div>
          {notifyMaintenance && (
            <div className="mt-2.5 ml-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-md">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{t("leadTime")}:</span>
              <Input
                type="number"
                min={1}
                max={365}
                value={maintenanceDays}
                onChange={(e) => setMaintenanceDays(parseInt(e.target.value) || 0)}
                className="h-7 w-20 text-xs bg-background"
              />
              <span>{t("days")}</span>
            </div>
          )}
          <Separator className="mt-4" />
        </div>

        {/* Identity Document alerts */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-500" />
                <p className="text-sm font-medium text-foreground">{t("documents")}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("documentsDesc")}
              </p>
            </div>
            <Switch
              checked={notifyDocuments}
              onCheckedChange={setNotifyDocuments}
            />
          </div>
          {notifyDocuments && (
            <div className="mt-2.5 ml-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-md">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{t("leadTime")}:</span>
              <Input
                type="number"
                min={1}
                max={365}
                value={documentDays}
                onChange={(e) => setDocumentDays(parseInt(e.target.value) || 0)}
                className="h-7 w-20 text-xs bg-background"
              />
              <span>{t("days")}</span>
            </div>
          )}
          <Separator className="mt-4" />
        </div>

        {/* Vehicle Inspection alerts */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-medium text-foreground">{t("inspection")}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("inspectionDesc")}
              </p>
            </div>
            <Switch
              checked={notifyInspection}
              onCheckedChange={setNotifyInspection}
            />
          </div>
          {notifyInspection && (
            <div className="mt-2.5 ml-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-md">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{t("leadTime")}:</span>
              <Input
                type="number"
                min={1}
                max={365}
                value={inspectionDays}
                onChange={(e) => setInspectionDays(parseInt(e.target.value) || 0)}
                className="h-7 w-20 text-xs bg-background"
              />
              <span>{t("days")}</span>
            </div>
          )}
          <Separator className="mt-4" />
        </div>

        {/* Waste Collection alerts */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-rose-500" />
                <p className="text-sm font-medium text-foreground">{t("waste")}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("wasteDesc")}
              </p>
            </div>
            <Switch
              checked={notifyWaste}
              onCheckedChange={setNotifyWaste}
            />
          </div>
          <Separator className="mt-4" />
        </div>

        {/* Lending alerts */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Handshake className="h-4 w-4 text-teal-500" />
                <p className="text-sm font-medium text-foreground">{t("lending")}</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("lendingDesc")}
              </p>
            </div>
            <Switch
              checked={notifyLending}
              onCheckedChange={setNotifyLending}
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button onClick={handleSave} disabled={isPending} size="sm">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
