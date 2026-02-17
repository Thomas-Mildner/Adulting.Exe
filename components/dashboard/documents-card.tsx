"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCheck, AlertTriangle, ArrowRight } from "lucide-react"
import { type IdentityDocument, getDaysRemaining, getDocumentStatus } from "@/lib/data"
import { Link } from "@/lib/navigation"

type Props = {
  documents: IdentityDocument[]
}

export function DocumentsCard({ documents }: Props) {
  const t = useTranslations("Documents")
  
  // Get documents that are expired or expiring within 6 months
  const criticalDocuments = documents
    .filter(doc => {
      const status = getDocumentStatus(doc.expiryDate)
      return status === "expired" || status === "expiring-soon"
    })
    .sort((a, b) => getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate))
    .slice(0, 3)

  const hasExpired = criticalDocuments.some(doc => getDocumentStatus(doc.expiryDate) === "expired")
  const hasExpiringSoon = criticalDocuments.some(doc => getDocumentStatus(doc.expiryDate) === "expiring-soon")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{t("title")}</CardTitle>
          </div>
          {hasExpired && (
            <Badge variant="destructive">Expired!</Badge>
          )}
          {!hasExpired && hasExpiringSoon && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
              Expiring Soon
            </Badge>
          )}
        </div>
        <CardDescription>Identity documents status</CardDescription>
      </CardHeader>
      <CardContent>
        {criticalDocuments.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            All documents are valid
          </div>
        ) : (
          <div className="space-y-3">
            {criticalDocuments.map((doc) => {
              const daysRemaining = getDaysRemaining(doc.expiryDate)
              const status = getDocumentStatus(doc.expiryDate)
              const documentType = doc.customDocumentType || t(`documentType.${doc.documentType}`)
              
              return (
                <div key={doc.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {status === "expired" ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{documentType}</p>
                      <p className="text-xs text-muted-foreground">{doc.personName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {status === "expired" ? (
                      <p className="text-xs font-semibold text-red-600">
                        Expired {Math.abs(daysRemaining)}d ago
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {daysRemaining}d remaining
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t">
          <Link href="/documents">
            <Button variant="ghost" size="sm" className="w-full">
              View All Documents
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
