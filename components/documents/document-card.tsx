"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, AlertCircle, Pencil, Trash2, FileText } from "lucide-react"
import { type IdentityDocument, getDaysRemaining, getDocumentStatus } from "@/lib/data"
import { deleteIdentityDocument } from "@/lib/actions"
import { useState, useTransition } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LostFoundDialog } from "./lost-found-dialog"

type Props = {
  document: IdentityDocument
  onEdit: (document: IdentityDocument) => void
}

export function DocumentCard({ document, onEdit }: Props) {
  const t = useTranslations("Documents")
  const [isPending, startTransition] = useTransition()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLostFoundDialogOpen, setIsLostFoundDialogOpen] = useState(false)

  const daysRemaining = getDaysRemaining(document.expiryDate)
  const status = getDocumentStatus(document.expiryDate)

  const statusConfig = {
    valid: {
      label: t("statusBadge.modelCitizen"),
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    },
    "expiring-soon": {
      label: t("statusBadge.bureaucraticAnxiety"),
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    expired: {
      label: t("statusBadge.internationalFugitive"),
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    },
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteIdentityDocument(document.id)
      setIsDeleteDialogOpen(false)
    })
  }

  const getCountdownText = () => {
    if (daysRemaining < 0) {
      return t("countdown.expired", { days: Math.abs(daysRemaining) })
    } else if (daysRemaining < 30) {
      return t("countdown.expiresIn", { days: daysRemaining })
    } else if (daysRemaining < 365) {
      const months = Math.floor(daysRemaining / 30)
      return t("countdown.expiresInMonths", { months })
    } else {
      const years = Math.floor(daysRemaining / 365)
      return t("countdown.expiresInYears", { years })
    }
  }

  const documentType = document.customDocumentType || t(`documentType.${document.documentType}`)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg">{documentType}</CardTitle>
              <p className="text-sm text-muted-foreground">{document.personName}</p>
            </div>
            <Badge className={statusConfig[status].className}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("documentNumber")}</p>
            <p className="font-mono text-sm">{document.documentNumber}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">{t("expiryDate")}</p>
            <p className="text-sm">{new Date(document.expiryDate).toLocaleDateString()}</p>
            <p className={`text-xs ${status === "expired" ? "text-red-600 dark:text-red-400 font-semibold" : "text-muted-foreground"}`}>
              {getCountdownText()}
            </p>
          </div>

          {document.physicalLocation && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="text-muted-foreground">{document.physicalLocation}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {document.lostFoundGuide && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLostFoundDialogOpen(true)}
              className="flex-1"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {t("lostButton")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(document)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDocumentTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirm.document", { documentType })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LostFoundDialog
        open={isLostFoundDialogOpen}
        onOpenChange={setIsLostFoundDialogOpen}
        document={document}
      />
    </>
  )
}
