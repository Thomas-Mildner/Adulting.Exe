"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, User, Users } from "lucide-react"
import { type Person, type IdentityDocument, getDaysRemaining, getDocumentStatus, getDocumentStatusLabel } from "@/lib/data"
import { useMemo, useState } from "react"
import { DocumentCard } from "./document-card"
import { PersonDialog } from "./person-dialog"
import { DocumentDialog } from "./document-dialog"
import { StatusBanner } from "./status-banner"

type Props = {
  persons: (Person & { documentCount: number })[]
  documents: IdentityDocument[]
}

export function DocumentsView({ persons: initialPersons, documents: initialDocuments }: Props) {
  const t = useTranslations("Documents")
  const [selectedPersonId, setSelectedPersonId] = useState<string | "all">("all")
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState(false)
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)

  const filteredDocuments = useMemo(() => {
    if (selectedPersonId === "all") return initialDocuments
    return initialDocuments.filter(doc => doc.personId === selectedPersonId)
  }, [initialDocuments, selectedPersonId])

  // Calculate overall status
  const overallStatus = useMemo(() => {
    const hasExpired = initialDocuments.some(doc => getDocumentStatus(doc.expiryDate) === "expired")
    const hasExpiringSoon = initialDocuments.some(doc => getDocumentStatus(doc.expiryDate) === "expiring-soon")
    
    if (hasExpired) return "stateless"
    if (hasExpiringSoon) return "approachingStatelessness"
    return "legalEntity"
  }, [initialDocuments])

  return (
    <div className="space-y-6">
      <StatusBanner status={overallStatus} />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={() => setIsPersonDialogOpen(true)}>
            <User className="h-4 w-4 mr-2" />
            {t("addPerson")}
          </Button>
          <Button 
            onClick={() => setIsDocumentDialogOpen(true)}
            disabled={initialPersons.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addDocument")}
          </Button>
        </div>
      </div>

      {initialPersons.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("noPeople")}</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={selectedPersonId} onValueChange={setSelectedPersonId}>
          <TabsList>
            <TabsTrigger value="all">
              {t("persons")} ({initialPersons.length})
            </TabsTrigger>
            {initialPersons.map((person) => (
              <TabsTrigger key={person.id} value={person.id}>
                {person.name} ({person.documentCount})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {initialDocuments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>{t("noDocuments")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {initialDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            )}
          </TabsContent>

          {initialPersons.map((person) => (
            <TabsContent key={person.id} value={person.id} className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>{t("noDocuments")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <PersonDialog 
        open={isPersonDialogOpen} 
        onOpenChange={setIsPersonDialogOpen}
      />
      
      <DocumentDialog 
        open={isDocumentDialogOpen} 
        onOpenChange={setIsDocumentDialogOpen}
        persons={initialPersons}
      />
    </div>
  )
}
