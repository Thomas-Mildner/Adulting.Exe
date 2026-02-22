"use client"

import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type IdentityDocument } from "@/lib/data"
import { AlertTriangle, Phone } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: IdentityDocument
}

export function LostFoundDialog({ open, onOpenChange, document }: Props) {
  const t = useTranslations("Documents")
  const documentType = document.customDocumentType || t(`documentType.${document.documentType}`)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t("lostFoundModal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("lostFoundModal.forDocument", { documentType })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {document.lostFoundGuide && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {t("lostFoundModal.emergencySteps")}
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{document.lostFoundGuide}</p>
              </div>
            </div>
          )}
          
          {document.emergencyContact && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t("lostFoundModal.contact")}
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-mono">{document.emergencyContact}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
