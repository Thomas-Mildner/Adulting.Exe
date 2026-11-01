"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Users, Plus, Pencil, Trash2, FileText, User } from "lucide-react"
import { type Person } from "@/lib/data"
import { createPerson, updatePerson, deletePerson } from "@/lib/actions"
import { toast } from "sonner"

type PersonWithCount = Person & { documentCount?: number }

interface HouseholdMembersSettingsProps {
  initialPersons: PersonWithCount[]
}

const RELATION_BADGES: Record<Person["relation"], string> = {
  Self: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Spouse: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Child: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Other: "bg-muted text-muted-foreground border-border",
}

export function HouseholdMembersSettings({ initialPersons }: HouseholdMembersSettingsProps) {
  const t = useTranslations("Settings.householdMembers")
  const [persons, setPersons] = useState<PersonWithCount[]>(initialPersons)
  const [isPending, startTransition] = useTransition()

  // Form dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<PersonWithCount | null>(null)
  const [name, setName] = useState("")
  const [relation, setRelation] = useState<Person["relation"]>("Self")

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<PersonWithCount | null>(null)

  const handleOpenAdd = () => {
    setEditingPerson(null)
    setName("")
    setRelation("Self")
    setDialogOpen(true)
  }

  const handleOpenEdit = (person: PersonWithCount) => {
    setEditingPerson(person)
    setName(person.name)
    setRelation(person.relation)
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      try {
        if (editingPerson) {
          await updatePerson(editingPerson.id, { name: name.trim(), relation })
          setPersons((prev) =>
            prev.map((p) =>
              p.id === editingPerson.id
                ? { ...p, name: name.trim(), relation }
                : p
            )
          )
        } else {
          await createPerson({ name: name.trim(), relation })
          // Optimistically update list or refresh will sync
          setPersons((prev) => [
            ...prev,
            { id: `temp-${Date.now()}`, name: name.trim(), relation, documentCount: 0 },
          ])
        }
        setDialogOpen(false)
        setName("")
      } catch {
        toast.error("Error saving member")
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    startTransition(async () => {
      try {
        await deletePerson(deleteTarget.id)
        setPersons((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        setDeleteTarget(null)
      } catch {
        toast.error("Error deleting member")
      }
    })
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              {t("title")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("description")}
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 h-8 text-xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("add")}
          </Button>
        </CardHeader>

        <CardContent className="flex-1">
          {persons.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center space-y-2">
              <Users className="h-8 w-8 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground">{t("empty")}</p>
            </div>
          ) : (
            <div className="divide-y rounded-lg border bg-card/50 overflow-hidden">
              {persons.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-3 gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                      {person.name.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {person.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${
                            RELATION_BADGES[person.relation] || RELATION_BADGES.Other
                          }`}
                        >
                          {t(`relations.${person.relation}`)}
                        </Badge>
                        {typeof person.documentCount === "number" && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <FileText className="h-2.5 w-2.5" />
                            {t("documentCount", { count: person.documentCount })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(person)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(person)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingPerson ? t("edit") : t("add")}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {t("description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">{t("name")}</Label>
                <Input
                  id="member-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-relation">{t("relation")}</Label>
                <Select
                  value={relation}
                  onValueChange={(val) => setRelation(val as Person["relation"])}
                >
                  <SelectTrigger id="member-relation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self">{t("relations.Self")}</SelectItem>
                    <SelectItem value="Spouse">{t("relations.Spouse")}</SelectItem>
                    <SelectItem value="Child">{t("relations.Child")}</SelectItem>
                    <SelectItem value="Other">{t("relations.Other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" size="sm" disabled={isPending || !name.trim()}>
                {isPending ? "..." : t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete")} {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
