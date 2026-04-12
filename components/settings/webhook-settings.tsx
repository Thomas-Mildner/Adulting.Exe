"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Webhook, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateWebhookConfig, testWebhook } from "@/lib/actions"
import { toast } from "sonner"

interface WebhookSettingsProps {
  initialUrl: string | null
  initialEnabled: boolean
}

export function WebhookSettings({ initialUrl, initialEnabled }: WebhookSettingsProps) {
  const t = useTranslations("Settings.webhook")
  const [isPending, startTransition] = useTransition()
  const [isTesting, startTestTransition] = useTransition()
  const [url, setUrl] = useState(initialUrl ?? "")
  const [enabled, setEnabled] = useState(initialEnabled)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)

  function handleSave() {
    startTransition(async () => {
      try {
        await updateWebhookConfig(url.trim() || null, enabled)
        toast.success(t("success"))
      } catch {
        toast.error(t("error"))
      }
    })
  }

  function handleTest() {
    setTestResult(null)
    startTestTransition(async () => {
      try {
        const result = await testWebhook()
        if (result.success) {
          setTestResult("success")
          toast.success(t("testSuccess"))
        } else {
          setTestResult("error")
          toast.error(result.error ?? t("testError"))
        }
      } catch {
        setTestResult("error")
        toast.error(t("testError"))
      }
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Webhook className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
        </div>
        <CardDescription className="text-xs">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url" className="text-xs font-medium">
            {t("urlLabel")}
          </Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder={t("urlPlaceholder")}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-8 text-sm"
            disabled={isPending}
          />
          <p className="text-[11px] text-muted-foreground">{t("urlDesc")}</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">{t("enabledLabel")}</p>
            <p className="text-[11px] text-muted-foreground">{t("enabledDesc")}</p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            disabled={isPending}
          />
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
            {t("saveBtn")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={handleTest}
            disabled={isTesting || !url.trim()}
          >
            {isTesting ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : testResult === "success" ? (
              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
            ) : testResult === "error" ? (
              <XCircle className="h-3 w-3 mr-1 text-destructive" />
            ) : null}
            {t("testBtn")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
