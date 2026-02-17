"use client"

import { useTranslations } from "next-intl"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, AlertOctagon } from "lucide-react"

type Props = {
  status: "legalEntity" | "approachingStatelessness" | "stateless"
}

export function StatusBanner({ status }: Props) {
  const t = useTranslations("Documents.status")
  
  const config = {
    legalEntity: {
      icon: Shield,
      variant: "default" as const,
      className: "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100",
    },
    approachingStatelessness: {
      icon: AlertTriangle,
      variant: "default" as const,
      className: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-900 dark:text-yellow-100",
    },
    stateless: {
      icon: AlertOctagon,
      variant: "destructive" as const,
      className: "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100",
    },
  }
  
  const { icon: Icon, className } = config[status]
  
  return (
    <Alert className={className}>
      <Icon className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold">
        {t("banner", { status: t(status) })}
      </AlertTitle>
      <AlertDescription>
        {status === "legalEntity" && "All documents are valid. You may travel freely."}
        {status === "approachingStatelessness" && "Some documents are expiring soon. Schedule renewals now!"}
        {status === "stateless" && "URGENT: Expired documents detected. Renew immediately!"}
      </AlertDescription>
    </Alert>
  )
}
