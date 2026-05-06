"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Pet, VetRecord, Vaccination } from "@/lib/data"
import {
  createPet,
  updatePet,
  deletePet,
  createVetRecord,
  updateVetRecord,
  deleteVetRecord,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} from "@/lib/actions"
import {
  Plus,
  Pencil,
  Trash2,
  PawPrint,
  Stethoscope,
  Syringe,
  ChevronRight,
  ArrowLeft,
  UtensilsCrossed,
  Pill,
  StickyNote,
  Cpu,
  Calendar,
} from "lucide-react"

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Other"] as const

// ─── Species emoji helper ────────────────────────────────────────────────
function speciesEmoji(species: string) {
  switch (species) {
    case "Dog": return "🐶"
    case "Cat": return "🐱"
    case "Bird": return "🐦"
    case "Rabbit": return "🐰"
    case "Fish": return "🐟"
    default: return "🐾"
  }
}

// ─── Pet Form ────────────────────────────────────────────────────────────

type PetFormData = {
  name: string
  species: Pet["species"]
  breed: string
  dateOfBirth: string
  microchipNumber: string
  color: string
  dietaryNeeds: string
  medications: string
  notes: string
}

const emptyPetForm: PetFormData = {
  name: "",
  species: "Dog",
  breed: "",
  dateOfBirth: "",
  microchipNumber: "",
  color: "",
  dietaryNeeds: "",
  medications: "",
  notes: "",
}

function PetFormFields({
  form,
  setForm,
}: {
  form: PetFormData
  setForm: (fn: (prev: PetFormData) => PetFormData) => void
}) {
  const t = useTranslations("Pets.form")

  return (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pet-name">{t("name")}</Label>
          <Input
            id="pet-name"
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pet-species">{t("species")}</Label>
          <Select
            value={form.species}
            onValueChange={(v) => setForm((p) => ({ ...p, species: v as Pet["species"] }))}
          >
            <SelectTrigger id="pet-species">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPECIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {speciesEmoji(s)} {t(`species.${s.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pet-breed">{t("breed")}</Label>
          <Input
            id="pet-breed"
            placeholder={t("breedPlaceholder")}
            value={form.breed}
            onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pet-color">{t("color")}</Label>
          <Input
            id="pet-color"
            placeholder={t("colorPlaceholder")}
            value={form.color}
            onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pet-dob">{t("dateOfBirth")}</Label>
          <Input
            id="pet-dob"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pet-chip">{t("microchipNumber")}</Label>
          <Input
            id="pet-chip"
            placeholder={t("microchipPlaceholder")}
            value={form.microchipNumber}
            onChange={(e) => setForm((p) => ({ ...p, microchipNumber: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pet-diet">{t("dietaryNeeds")}</Label>
        <Textarea
          id="pet-diet"
          placeholder={t("dietaryNeedsPlaceholder")}
          value={form.dietaryNeeds}
          onChange={(e) => setForm((p) => ({ ...p, dietaryNeeds: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pet-meds">{t("medications")}</Label>
        <Textarea
          id="pet-meds"
          placeholder={t("medicationsPlaceholder")}
          value={form.medications}
          onChange={(e) => setForm((p) => ({ ...p, medications: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pet-notes">{t("notes")}</Label>
        <Textarea
          id="pet-notes"
          placeholder={t("notesPlaceholder")}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={2}
        />
      </div>
    </div>
  )
}

// ─── Vet Record Form ──────────────────────────────────────────────────────

type VetFormData = {
  petId: string
  date: string
  vetName: string
  description: string
  cost: string
  nextVisit: string
  notes: string
}

function emptyVetForm(petId: string): VetFormData {
  return {
    petId,
    date: new Date().toISOString().split("T")[0],
    vetName: "",
    description: "",
    cost: "",
    nextVisit: "",
    notes: "",
  }
}

function VetFormFields({
  form,
  setForm,
  pets,
}: {
  form: VetFormData
  setForm: (fn: (prev: VetFormData) => VetFormData) => void
  pets: Pet[]
}) {
  const t = useTranslations("Pets.vetForm")

  return (
    <div className="grid gap-4 py-4">
      {pets.length > 1 && (
        <div className="grid gap-2">
          <Label>{t("pet")}</Label>
          <Select
            value={form.petId}
            onValueChange={(v) => setForm((p) => ({ ...p, petId: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {speciesEmoji(pet.species)} {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="vet-date">{t("date")}</Label>
          <Input
            id="vet-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vet-name">{t("vetName")}</Label>
          <Input
            id="vet-name"
            placeholder={t("vetNamePlaceholder")}
            value={form.vetName}
            onChange={(e) => setForm((p) => ({ ...p, vetName: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vet-desc">{t("description")}</Label>
        <Textarea
          id="vet-desc"
          placeholder={t("descriptionPlaceholder")}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={2}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="vet-cost">{t("cost")}</Label>
          <Input
            id="vet-cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.cost}
            onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vet-next">{t("nextVisit")}</Label>
          <Input
            id="vet-next"
            type="date"
            value={form.nextVisit}
            onChange={(e) => setForm((p) => ({ ...p, nextVisit: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vet-notes">{t("notes")}</Label>
        <Textarea
          id="vet-notes"
          placeholder={t("notesPlaceholder")}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={2}
        />
      </div>
    </div>
  )
}

// ─── Vaccination Form ─────────────────────────────────────────────────────

type VaccFormData = {
  petId: string
  name: string
  date: string
  nextDueDate: string
  vetName: string
  batchNumber: string
  notes: string
}

function emptyVaccForm(petId: string): VaccFormData {
  return {
    petId,
    name: "",
    date: new Date().toISOString().split("T")[0],
    nextDueDate: "",
    vetName: "",
    batchNumber: "",
    notes: "",
  }
}

function VaccFormFields({
  form,
  setForm,
  pets,
}: {
  form: VaccFormData
  setForm: (fn: (prev: VaccFormData) => VaccFormData) => void
  pets: Pet[]
}) {
  const t = useTranslations("Pets.vaccForm")

  return (
    <div className="grid gap-4 py-4">
      {pets.length > 1 && (
        <div className="grid gap-2">
          <Label>{t("pet")}</Label>
          <Select
            value={form.petId}
            onValueChange={(v) => setForm((p) => ({ ...p, petId: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {speciesEmoji(pet.species)} {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="vacc-name">{t("name")}</Label>
          <Input
            id="vacc-name"
            placeholder={t("namePlaceholder")}
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vacc-date">{t("date")}</Label>
          <Input
            id="vacc-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="vacc-next">{t("nextDueDate")}</Label>
          <Input
            id="vacc-next"
            type="date"
            value={form.nextDueDate}
            onChange={(e) => setForm((p) => ({ ...p, nextDueDate: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vacc-vet">{t("vetName")}</Label>
          <Input
            id="vacc-vet"
            placeholder={t("vetNamePlaceholder")}
            value={form.vetName}
            onChange={(e) => setForm((p) => ({ ...p, vetName: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vacc-batch">{t("batchNumber")}</Label>
        <Input
          id="vacc-batch"
          placeholder={t("batchPlaceholder")}
          value={form.batchNumber}
          onChange={(e) => setForm((p) => ({ ...p, batchNumber: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vacc-notes">{t("notes")}</Label>
        <Textarea
          id="vacc-notes"
          placeholder={t("notesPlaceholder")}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={2}
        />
      </div>
    </div>
  )
}

// ─── Pet Detail View ──────────────────────────────────────────────────────

function PetDetail({
  pet,
  vetRecords,
  vaccinations,
  allPets,
  onBack,
  onVetRecordsChange,
  onVaccinationsChange,
}: {
  pet: Pet
  vetRecords: VetRecord[]
  vaccinations: Vaccination[]
  allPets: Pet[]
  onBack: () => void
  onVetRecordsChange: (records: VetRecord[]) => void
  onVaccinationsChange: (records: Vaccination[]) => void
}) {
  const t = useTranslations("Pets")
  const [isPending, startTransition] = useTransition()

  // Vet Record dialogs
  const [vetCreateOpen, setVetCreateOpen] = useState(false)
  const [vetForm, setVetForm] = useState<VetFormData>(emptyVetForm(pet.id))
  const [vetEditOpen, setVetEditOpen] = useState(false)
  const [vetEditId, setVetEditId] = useState<string | null>(null)
  const [vetDeleteId, setVetDeleteId] = useState<string | null>(null)

  // Vaccination dialogs
  const [vaccCreateOpen, setVaccCreateOpen] = useState(false)
  const [vaccForm, setVaccForm] = useState<VaccFormData>(emptyVaccForm(pet.id))
  const [vaccEditOpen, setVaccEditOpen] = useState(false)
  const [vaccEditId, setVaccEditId] = useState<string | null>(null)
  const [vaccDeleteId, setVaccDeleteId] = useState<string | null>(null)

  const petVetRecords = vetRecords.filter((r) => r.petId === pet.id)
  const petVaccinations = vaccinations.filter((v) => v.petId === pet.id)

  const nextVaccination = petVaccinations
    .filter((v) => v.nextDueDate)
    .sort((a, b) => new Date(a.nextDueDate!).getTime() - new Date(b.nextDueDate!).getTime())[0]

  const upcomingVetVisit = petVetRecords
    .filter((r) => r.nextVisit)
    .sort((a, b) => new Date(a.nextVisit!).getTime() - new Date(b.nextVisit!).getTime())[0]

  function handleVetCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!vetForm.date || !vetForm.vetName || !vetForm.description) return
    startTransition(async () => {
      await createVetRecord({
        petId: pet.id,
        date: vetForm.date,
        vetName: vetForm.vetName,
        description: vetForm.description,
        cost: vetForm.cost ? parseFloat(vetForm.cost) : undefined,
        nextVisit: vetForm.nextVisit || undefined,
        notes: vetForm.notes || undefined,
      })
      onVetRecordsChange([
        ...vetRecords,
        {
          id: `temp-${Date.now()}`,
          petId: pet.id,
          petName: pet.name,
          date: vetForm.date,
          vetName: vetForm.vetName,
          description: vetForm.description,
          cost: vetForm.cost ? parseFloat(vetForm.cost) : undefined,
          nextVisit: vetForm.nextVisit || undefined,
          notes: vetForm.notes || undefined,
        },
      ])
      setVetForm(emptyVetForm(pet.id))
      setVetCreateOpen(false)
    })
  }

  function openVetEdit(record: VetRecord) {
    setVetEditId(record.id)
    setVetForm({
      petId: record.petId,
      date: record.date,
      vetName: record.vetName,
      description: record.description,
      cost: record.cost?.toString() ?? "",
      nextVisit: record.nextVisit ?? "",
      notes: record.notes ?? "",
    })
    setVetEditOpen(true)
  }

  function handleVetEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!vetEditId) return
    startTransition(async () => {
      await updateVetRecord(vetEditId, {
        date: vetForm.date,
        vetName: vetForm.vetName,
        description: vetForm.description,
        cost: vetForm.cost ? parseFloat(vetForm.cost) : undefined,
        nextVisit: vetForm.nextVisit || undefined,
        notes: vetForm.notes || undefined,
      })
      onVetRecordsChange(
        vetRecords.map((r) =>
          r.id === vetEditId
            ? {
                ...r,
                date: vetForm.date,
                vetName: vetForm.vetName,
                description: vetForm.description,
                cost: vetForm.cost ? parseFloat(vetForm.cost) : undefined,
                nextVisit: vetForm.nextVisit || undefined,
                notes: vetForm.notes || undefined,
              }
            : r
        )
      )
      setVetEditOpen(false)
      setVetEditId(null)
    })
  }

  function handleVetDelete(id: string) {
    startTransition(async () => {
      await deleteVetRecord(id)
      onVetRecordsChange(vetRecords.filter((r) => r.id !== id))
      setVetDeleteId(null)
    })
  }

  function handleVaccCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!vaccForm.name || !vaccForm.date) return
    startTransition(async () => {
      await createVaccination({
        petId: pet.id,
        name: vaccForm.name,
        date: vaccForm.date,
        nextDueDate: vaccForm.nextDueDate || undefined,
        vetName: vaccForm.vetName || undefined,
        batchNumber: vaccForm.batchNumber || undefined,
        notes: vaccForm.notes || undefined,
      })
      onVaccinationsChange([
        ...vaccinations,
        {
          id: `temp-${Date.now()}`,
          petId: pet.id,
          petName: pet.name,
          name: vaccForm.name,
          date: vaccForm.date,
          nextDueDate: vaccForm.nextDueDate || undefined,
          vetName: vaccForm.vetName || undefined,
          batchNumber: vaccForm.batchNumber || undefined,
          notes: vaccForm.notes || undefined,
        },
      ])
      setVaccForm(emptyVaccForm(pet.id))
      setVaccCreateOpen(false)
    })
  }

  function openVaccEdit(record: Vaccination) {
    setVaccEditId(record.id)
    setVaccForm({
      petId: record.petId,
      name: record.name,
      date: record.date,
      nextDueDate: record.nextDueDate ?? "",
      vetName: record.vetName ?? "",
      batchNumber: record.batchNumber ?? "",
      notes: record.notes ?? "",
    })
    setVaccEditOpen(true)
  }

  function handleVaccEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!vaccEditId) return
    startTransition(async () => {
      await updateVaccination(vaccEditId, {
        name: vaccForm.name,
        date: vaccForm.date,
        nextDueDate: vaccForm.nextDueDate || undefined,
        vetName: vaccForm.vetName || undefined,
        batchNumber: vaccForm.batchNumber || undefined,
        notes: vaccForm.notes || undefined,
      })
      onVaccinationsChange(
        vaccinations.map((v) =>
          v.id === vaccEditId
            ? {
                ...v,
                name: vaccForm.name,
                date: vaccForm.date,
                nextDueDate: vaccForm.nextDueDate || undefined,
                vetName: vaccForm.vetName || undefined,
                batchNumber: vaccForm.batchNumber || undefined,
                notes: vaccForm.notes || undefined,
              }
            : v
        )
      )
      setVaccEditOpen(false)
      setVaccEditId(null)
    })
  }

  function handleVaccDelete(id: string) {
    startTransition(async () => {
      await deleteVaccination(id)
      onVaccinationsChange(vaccinations.filter((v) => v.id !== id))
      setVaccDeleteId(null)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{speciesEmoji(pet.species)}</span>
          <div>
            <h2 className="text-lg font-semibold">{pet.name}</h2>
            <p className="text-xs text-muted-foreground">
              {pet.breed ? `${pet.breed} · ` : ""}
              {t(`species.${pet.species.toLowerCase()}`)}
              {pet.dateOfBirth ? ` · ${t("detail.bornOn")} ${new Date(pet.dateOfBirth).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pet.microchipNumber && (
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Cpu className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("detail.microchip")}</p>
                <p className="text-sm font-mono font-medium mt-0.5">{pet.microchipNumber}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {nextVaccination && (
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Syringe className="h-4 w-4 text-chart-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("detail.nextVaccination")}</p>
                <p className="text-sm font-medium mt-0.5">{nextVaccination.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(nextVaccination.nextDueDate!).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {upcomingVetVisit && (
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Calendar className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("detail.nextVetVisit")}</p>
                <p className="text-sm font-medium mt-0.5">{upcomingVetVisit.vetName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(upcomingVetVisit.nextVisit!).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pet-sitter instructions */}
      {(pet.dietaryNeeds || pet.medications || pet.notes) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("detail.sitterInstructions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pet.dietaryNeeds && (
              <div className="flex items-start gap-2">
                <UtensilsCrossed className="h-4 w-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("form.dietaryNeeds")}</p>
                  <p className="text-sm whitespace-pre-wrap">{pet.dietaryNeeds}</p>
                </div>
              </div>
            )}
            {pet.medications && (
              <div className="flex items-start gap-2">
                <Pill className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("form.medications")}</p>
                  <p className="text-sm whitespace-pre-wrap">{pet.medications}</p>
                </div>
              </div>
            )}
            {pet.notes && (
              <div className="flex items-start gap-2">
                <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("form.notes")}</p>
                  <p className="text-sm whitespace-pre-wrap">{pet.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vet Records & Vaccinations Tabs */}
      <Tabs defaultValue="vet">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="vet" className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5" />
            {t("tabs.vet")} ({petVetRecords.length})
          </TabsTrigger>
          <TabsTrigger value="vacc" className="flex items-center gap-1.5">
            <Syringe className="h-3.5 w-3.5" />
            {t("tabs.vaccinations")} ({petVaccinations.length})
          </TabsTrigger>
        </TabsList>

        {/* Vet Records Tab */}
        <TabsContent value="vet" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t("vet.title")}</CardTitle>
                <Dialog
                  open={vetCreateOpen}
                  onOpenChange={(v) => {
                    setVetCreateOpen(v)
                    if (!v) setVetForm(emptyVetForm(pet.id))
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      {t("vet.add")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <form onSubmit={handleVetCreate}>
                      <DialogHeader>
                        <DialogTitle>{t("vet.createTitle")}</DialogTitle>
                        <DialogDescription>{t("vet.createDesc")}</DialogDescription>
                      </DialogHeader>
                      <VetFormFields form={vetForm} setForm={setVetForm} pets={[pet]} />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setVetCreateOpen(false)}>
                          {t("form.cancel")}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                          {isPending ? t("form.saving") : t("form.save")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{t("vet.table.date")}</TableHead>
                    <TableHead className="text-xs">{t("vet.table.vet")}</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">{t("vet.table.description")}</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">{t("vet.table.cost")}</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">{t("vet.table.nextVisit")}</TableHead>
                    <TableHead className="text-xs text-right">{t("vet.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {petVetRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                        {t("vet.empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    petVetRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-sm tabular-nums">
                          {new Date(record.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{record.vetName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">
                          {record.description}
                        </TableCell>
                        <TableCell className="text-sm hidden sm:table-cell">
                          {record.cost != null ? `€${record.cost.toFixed(2)}` : "—"}
                        </TableCell>
                        <TableCell className="text-sm hidden sm:table-cell">
                          {record.nextVisit
                            ? new Date(record.nextVisit).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openVetEdit(record)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setVetDeleteId(record.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vaccinations Tab */}
        <TabsContent value="vacc" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t("vacc.title")}</CardTitle>
                <Dialog
                  open={vaccCreateOpen}
                  onOpenChange={(v) => {
                    setVaccCreateOpen(v)
                    if (!v) setVaccForm(emptyVaccForm(pet.id))
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      {t("vacc.add")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <form onSubmit={handleVaccCreate}>
                      <DialogHeader>
                        <DialogTitle>{t("vacc.createTitle")}</DialogTitle>
                        <DialogDescription>{t("vacc.createDesc")}</DialogDescription>
                      </DialogHeader>
                      <VaccFormFields form={vaccForm} setForm={setVaccForm} pets={[pet]} />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setVaccCreateOpen(false)}>
                          {t("form.cancel")}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                          {isPending ? t("form.saving") : t("form.save")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{t("vacc.table.name")}</TableHead>
                    <TableHead className="text-xs">{t("vacc.table.date")}</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">{t("vacc.table.nextDue")}</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">{t("vacc.table.vet")}</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">{t("vacc.table.batch")}</TableHead>
                    <TableHead className="text-xs text-right">{t("vacc.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {petVaccinations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                        {t("vacc.empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    petVaccinations.map((vacc) => {
                      const isDue = vacc.nextDueDate && new Date(vacc.nextDueDate) <= new Date()
                      return (
                        <TableRow key={vacc.id}>
                          <TableCell className="text-sm font-medium">{vacc.name}</TableCell>
                          <TableCell className="text-sm tabular-nums">
                            {new Date(vacc.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {vacc.nextDueDate ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm tabular-nums">
                                  {new Date(vacc.nextDueDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                                </span>
                                {isDue && (
                                  <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">
                                    {t("vacc.overdue")}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {vacc.vetName ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground font-mono hidden sm:table-cell">
                            {vacc.batchNumber ?? "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openVaccEdit(vacc)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => setVaccDeleteId(vacc.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Vet Record Dialog */}
      <Dialog open={vetEditOpen} onOpenChange={(v) => { setVetEditOpen(v); if (!v) setVetEditId(null) }}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleVetEdit}>
            <DialogHeader>
              <DialogTitle>{t("vet.editTitle")}</DialogTitle>
              <DialogDescription>{t("vet.editDesc")}</DialogDescription>
            </DialogHeader>
            <VetFormFields form={vetForm} setForm={setVetForm} pets={[pet]} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVetEditOpen(false)}>{t("form.cancel")}</Button>
              <Button type="submit" disabled={isPending}>{isPending ? t("form.saving") : t("form.editSave")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Vet Record Dialog */}
      <Dialog open={vetDeleteId !== null} onOpenChange={(v) => { if (!v) setVetDeleteId(null) }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("vet.deleteTitle")}</DialogTitle>
            <DialogDescription>{t("vet.deleteDesc")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVetDeleteId(null)}>{t("delete.cancel")}</Button>
            <Button variant="destructive" disabled={isPending} onClick={() => vetDeleteId && handleVetDelete(vetDeleteId)}>
              {isPending ? t("delete.deleting") : t("delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vaccination Dialog */}
      <Dialog open={vaccEditOpen} onOpenChange={(v) => { setVaccEditOpen(v); if (!v) setVaccEditId(null) }}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleVaccEdit}>
            <DialogHeader>
              <DialogTitle>{t("vacc.editTitle")}</DialogTitle>
              <DialogDescription>{t("vacc.editDesc")}</DialogDescription>
            </DialogHeader>
            <VaccFormFields form={vaccForm} setForm={setVaccForm} pets={[pet]} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVaccEditOpen(false)}>{t("form.cancel")}</Button>
              <Button type="submit" disabled={isPending}>{isPending ? t("form.saving") : t("form.editSave")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Vaccination Dialog */}
      <Dialog open={vaccDeleteId !== null} onOpenChange={(v) => { if (!v) setVaccDeleteId(null) }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("vacc.deleteTitle")}</DialogTitle>
            <DialogDescription>{t("vacc.deleteDesc")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVaccDeleteId(null)}>{t("delete.cancel")}</Button>
            <Button variant="destructive" disabled={isPending} onClick={() => vaccDeleteId && handleVaccDelete(vaccDeleteId)}>
              {isPending ? t("delete.deleting") : t("delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Main Pet Manager ─────────────────────────────────────────────────────

export function PetManager({
  initialPets,
  initialVetRecords,
  initialVaccinations,
}: {
  initialPets: Pet[]
  initialVetRecords: VetRecord[]
  initialVaccinations: Vaccination[]
}) {
  const t = useTranslations("Pets")
  const [pets, setPets] = useState(initialPets)
  const [vetRecords, setVetRecords] = useState(initialVetRecords)
  const [vaccinations, setVaccinations] = useState(initialVaccinations)
  const [isPending, startTransition] = useTransition()
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<PetFormData>({ ...emptyPetForm })

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<PetFormData>({ ...emptyPetForm })

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const selectedPet = pets.find((p) => p.id === selectedPetId) ?? null

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.name) return
    startTransition(async () => {
      await createPet({
        name: createForm.name,
        species: createForm.species,
        breed: createForm.breed || undefined,
        dateOfBirth: createForm.dateOfBirth || undefined,
        microchipNumber: createForm.microchipNumber || undefined,
        color: createForm.color || undefined,
        dietaryNeeds: createForm.dietaryNeeds || undefined,
        medications: createForm.medications || undefined,
        notes: createForm.notes || undefined,
      })
      setPets((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          name: createForm.name,
          species: createForm.species,
          breed: createForm.breed || undefined,
          dateOfBirth: createForm.dateOfBirth || undefined,
          microchipNumber: createForm.microchipNumber || undefined,
          color: createForm.color || undefined,
          dietaryNeeds: createForm.dietaryNeeds || undefined,
          medications: createForm.medications || undefined,
          notes: createForm.notes || undefined,
        },
      ])
      setCreateForm({ ...emptyPetForm })
      setCreateOpen(false)
    })
  }

  function openEdit(pet: Pet) {
    setEditId(pet.id)
    setEditForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed ?? "",
      dateOfBirth: pet.dateOfBirth ?? "",
      microchipNumber: pet.microchipNumber ?? "",
      color: pet.color ?? "",
      dietaryNeeds: pet.dietaryNeeds ?? "",
      medications: pet.medications ?? "",
      notes: pet.notes ?? "",
    })
    setEditOpen(true)
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editId) return
    startTransition(async () => {
      await updatePet(editId, {
        name: editForm.name,
        species: editForm.species,
        breed: editForm.breed || undefined,
        dateOfBirth: editForm.dateOfBirth || undefined,
        microchipNumber: editForm.microchipNumber || undefined,
        color: editForm.color || undefined,
        dietaryNeeds: editForm.dietaryNeeds || undefined,
        medications: editForm.medications || undefined,
        notes: editForm.notes || undefined,
      })
      setPets((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                name: editForm.name,
                species: editForm.species,
                breed: editForm.breed || undefined,
                dateOfBirth: editForm.dateOfBirth || undefined,
                microchipNumber: editForm.microchipNumber || undefined,
                color: editForm.color || undefined,
                dietaryNeeds: editForm.dietaryNeeds || undefined,
                medications: editForm.medications || undefined,
                notes: editForm.notes || undefined,
              }
            : p
        )
      )
      setEditOpen(false)
      setEditId(null)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePet(id)
      setPets((prev) => prev.filter((p) => p.id !== id))
      setDeleteId(null)
      if (selectedPetId === id) setSelectedPetId(null)
    })
  }

  // If a pet is selected, show detail view
  if (selectedPet) {
    return (
      <PetDetail
        pet={selectedPet}
        vetRecords={vetRecords}
        vaccinations={vaccinations}
        allPets={pets}
        onBack={() => setSelectedPetId(null)}
        onVetRecordsChange={setVetRecords}
        onVaccinationsChange={setVaccinations}
      />
    )
  }

  // Stats
  const totalVetRecords = vetRecords.length
  const totalVaccinations = vaccinations.length
  const overdueVaccinations = vaccinations.filter(
    (v) => v.nextDueDate && new Date(v.nextDueDate) <= new Date()
  ).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("stats.pets")}</p>
            <p className="text-2xl font-semibold tabular-nums mt-1">{pets.length}</p>
            <p className="text-xs text-muted-foreground">{t("stats.registered")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("stats.vetVisits")}</p>
            <p className="text-2xl font-semibold tabular-nums text-chart-3 mt-1">{totalVetRecords}</p>
            <p className="text-xs text-muted-foreground">{t("stats.recorded")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("stats.vaccinations")}</p>
            <p className="text-2xl font-semibold tabular-nums text-success mt-1">{totalVaccinations}</p>
            <p className="text-xs text-muted-foreground">{t("stats.administered")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("stats.overdueVacc")}</p>
            <p className={`text-2xl font-semibold tabular-nums mt-1 ${overdueVaccinations > 0 ? "text-destructive" : "text-foreground"}`}>
              {overdueVaccinations}
            </p>
            <p className="text-xs text-muted-foreground">
              {overdueVaccinations > 0 ? t("stats.needsAttention") : t("stats.allUpToDate")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pet list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">{t("list.title")}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{t("list.description")}</p>
            </div>
            <Dialog
              open={createOpen}
              onOpenChange={(v) => {
                setCreateOpen(v)
                if (!v) setCreateForm({ ...emptyPetForm })
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  {t("create.button")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>{t("create.title")}</DialogTitle>
                    <DialogDescription>{t("create.description")}</DialogDescription>
                  </DialogHeader>
                  <PetFormFields form={createForm} setForm={setCreateForm} />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                      {t("form.cancel")}
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? t("form.saving") : t("form.save")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <PawPrint className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("list.empty")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pets.map((pet) => {
                const petVetCount = vetRecords.filter((r) => r.petId === pet.id).length
                const petVaccCount = vaccinations.filter((v) => v.petId === pet.id).length
                const overdueVacc = vaccinations.filter(
                  (v) => v.petId === pet.id && v.nextDueDate && new Date(v.nextDueDate) <= new Date()
                ).length

                return (
                  <div
                    key={pet.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    <span className="text-3xl">{speciesEmoji(pet.species)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{pet.name}</p>
                        {overdueVacc > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">
                            {t("vacc.overdue")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pet.breed ? `${pet.breed} · ` : ""}
                        {t(`species.${pet.species.toLowerCase()}`)}
                        {pet.microchipNumber ? ` · 🔬 ${pet.microchipNumber}` : ""}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          {petVetCount} {t("stats.vetVisits")}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Syringe className="h-3 w-3" />
                          {petVaccCount} {t("stats.vaccinations")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); openEdit(pet) }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(pet.id) }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditId(null) }}>
        <DialogContent className="sm:max-w-[520px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("edit.title")}</DialogTitle>
              <DialogDescription>{t("edit.description")}</DialogDescription>
            </DialogHeader>
            <PetFormFields form={editForm} setForm={setEditForm} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                {t("form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.saving") : t("form.editSave")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null) }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("delete.title")}</DialogTitle>
            <DialogDescription>{t("delete.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>{t("delete.cancel")}</Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {isPending ? t("delete.deleting") : t("delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
