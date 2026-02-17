"use client"

import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Person, type IdentityDocument } from "@/lib/data"
import { createIdentityDocument } from "@/lib/actions"
import { useState, useTransition } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  persons: Person[]
  document?: IdentityDocument
}

type FormData = {
  personId: string
  documentType: IdentityDocument["documentType"]
  customDocumentType: string
  documentNumber: string
  issueDate: string
  expiryDate: string
  physicalLocation: string
  lostFoundGuide: string
  emergencyContact: string
  notes: string
}

const emptyForm: FormData = {
  personId: "",
  documentType: "ID",
  customDocumentType: "",
  documentNumber: "",
  issueDate: "",
  expiryDate: "",
  physicalLocation: "",
  lostFoundGuide: "",
  emergencyContact: "",
  notes: "",
}

export function DocumentDialog({ open, onOpenChange, persons, document }: Props) {
  const t = useTranslations("Documents")
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<FormData>(emptyForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate dates
    const issueDate = new Date(form.issueDate)
    const expiryDate = new Date(form.expiryDate)
    const today = new Date()
    
    if (issueDate > today) {
      alert(t("form.validation.issueDateFuture"))
      return
    }
    
    if (expiryDate <= issueDate) {
      alert(t("form.validation.expiryBeforeIssue"))
      return
    }
    
    startTransition(async () => {
      await createIdentityDocument({
        personId: form.personId,
        documentType: form.documentType,
        customDocumentType: form.documentType === "Other" ? form.customDocumentType : undefined,
        documentNumber: form.documentNumber,
        issueDate: form.issueDate,
        expiryDate: form.expiryDate,
        physicalLocation: form.physicalLocation || undefined,
        lostFoundGuide: form.lostFoundGuide || undefined,
        emergencyContact: form.emergencyContact || undefined,
        notes: form.notes || undefined,
      })
      setForm(emptyForm)
      onOpenChange(false)
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setForm(emptyForm)
    }
    onOpenChange(newOpen)
  }

  const documentTypes: IdentityDocument["documentType"][] = ["ID", "Passport", "Driver's License", "Visa", "Other"]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {document ? t("editDocument") : t("addDocument")}
            </DialogTitle>
            <DialogDescription>
              Track an identity document with expiry dates and emergency information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="personId">{t("person")}</Label>
              <Select
                value={form.personId}
                onValueChange={(value) => setForm({ ...form, personId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select person..." />
                </SelectTrigger>
                <SelectContent>
                  {persons.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="documentType">{t("form.documentType")}</Label>
                <Select
                  value={form.documentType}
                  onValueChange={(value) => setForm({ ...form, documentType: value as IdentityDocument["documentType"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`documentType.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.documentType === "Other" && (
                <div className="grid gap-2">
                  <Label htmlFor="customDocumentType">{t("form.customDocumentType")}</Label>
                  <Input
                    id="customDocumentType"
                    value={form.customDocumentType}
                    onChange={(e) => setForm({ ...form, customDocumentType: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="documentNumber">{t("form.documentNumber")}</Label>
              <Input
                id="documentNumber"
                value={form.documentNumber}
                onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issueDate">{t("form.issueDate")}</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiryDate">{t("form.expiryDate")}</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="physicalLocation">{t("form.physicalLocation")}</Label>
              <Input
                id="physicalLocation"
                placeholder={t("form.physicalLocationPlaceholder")}
                value={form.physicalLocation}
                onChange={(e) => setForm({ ...form, physicalLocation: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lostFoundGuide">{t("form.lostFoundGuide")}</Label>
              <Textarea
                id="lostFoundGuide"
                placeholder={t("form.lostFoundGuidePlaceholder")}
                value={form.lostFoundGuide}
                onChange={(e) => setForm({ ...form, lostFoundGuide: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emergencyContact">{t("form.emergencyContact")}</Label>
              <Input
                id="emergencyContact"
                placeholder={t("form.emergencyContactPlaceholder")}
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">{t("form.notes")}</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !form.personId}>
              {document ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
