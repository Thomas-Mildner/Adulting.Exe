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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Person } from "@/lib/data"
import { createPerson } from "@/lib/actions"
import { useState, useTransition } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  person?: Person
  descriptionOverride?: string
}

type FormData = {
  name: string
  relation: Person["relation"]
}

const emptyForm: FormData = {
  name: "",
  relation: "Self",
}

export function PersonDialog({ open, onOpenChange, person, descriptionOverride }: Props) {
  const t = useTranslations("Documents")
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<FormData>(person || emptyForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await createPerson(form)
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

  const relationTypes: Person["relation"][] = ["Self", "Spouse", "Child", "Other"]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {person ? t("editPerson") : t("addPerson")}
            </DialogTitle>
            <DialogDescription>
              {descriptionOverride ?? t("personDialogDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("form.name")}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="relation">{t("form.relation")}</Label>
              <Select
                value={form.relation}
                onValueChange={(value) => setForm({ ...form, relation: value as Person["relation"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {relationTypes.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {t(`relationTypes.${rel}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {person ? t("save") : t("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
