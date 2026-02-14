"use client"

import {
  ChevronsUpDown,
  FileText,
  Globe,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  ChevronUp,
  ChevronDown,
  Receipt,
} from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  createInvoice,
  createServiceProvider,
  deleteInvoice,
  deleteServiceProvider,
  updateInvoice,
  updateServiceProvider,
} from "@/lib/actions"
import { Invoice, ServiceProvider } from "@/lib/data"
import { cn, formatCurrency } from "@/lib/utils"

const specialties = [
  "Sanitär",
  "Elektrik",
  "Heizung",
  "Dachdecker",
  "Maler",
  "Schreiner",
  "Gartenbau",
  "Schlüssel",
  "Allgemein",
] as const

type ProviderForm = {
  name: string
  specialty: string
  phone: string
  email: string
  website: string
  rating: number
}

const emptyForm: ProviderForm = {
  name: "",
  specialty: "Allgemein",
  phone: "",
  email: "",
  website: "",
  rating: 3,
}

function RatingSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className="p-0.5 transition-colors"
        >
          <Star
            className={`h-5 w-5 ${level <= value
              ? "fill-chart-3 text-chart-3"
              : "text-border hover:text-chart-3/50"
              }`}
          />
        </button>
      ))}
    </div>
  )
}

function ProviderFormFields({
  form,
  setForm,
}: {
  form: ProviderForm
  setForm: (fn: (prev: ProviderForm) => ProviderForm) => void
}) {
  const t = useTranslations("Services")

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sp-name">{t("form.name")}</Label>
          <Input
            id="sp-name"
            placeholder="z.B. Müller Sanitär"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sp-specialty">{t("form.specialty")}</Label>
          <Select
            value={form.specialty}
            onValueChange={(v) => setForm((p) => ({ ...p, specialty: v }))}
          >
            <SelectTrigger id="sp-specialty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`specialties.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sp-phone">{t("form.phone")}</Label>
          <Input
            id="sp-phone"
            type="tel"
            placeholder="z.B. 0151 12345678"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sp-email">{t("form.email")}</Label>
          <Input
            id="sp-email"
            type="email"
            placeholder="z.B. info@müller-sanitär.de"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sp-website">{t("form.website")}</Label>
        <Input
          id="sp-website"
          type="url"
          placeholder="z.B. https://müller-sanitär.de"
          value={form.website}
          onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label>{t("form.rating")}</Label>
        <RatingSelector
          value={form.rating}
          onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
        />
      </div>
    </div>
  )
}

function DirectoryTab({ serviceProviders }: { serviceProviders: ServiceProvider[] }) {
  const t = useTranslations("Services")
  const [providers, setProviders] = useState(serviceProviders)
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<ProviderForm>({ ...emptyForm })

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<ProviderForm>({ ...emptyForm })

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return providers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.specialty.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    )
  }, [providers, search])

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.name || !createForm.phone || !createForm.email) return

    startTransition(async () => {
      await createServiceProvider(createForm)
      setProviders((prev) => [
        ...prev,
        { ...createForm, id: `temp-${Date.now()}`, history: [] },
      ])
      setCreateForm({ ...emptyForm })
      setCreateOpen(false)
    })
  }

  function openEdit(provider: ServiceProvider) {
    setEditId(provider.id)
    setEditForm({
      name: provider.name,
      specialty: provider.specialty,
      phone: provider.phone,
      email: provider.email,
      website: provider.website || "",
      rating: provider.rating,
    })
    setEditOpen(true)
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editId || !editForm.name) return

    startTransition(async () => {
      await updateServiceProvider(editId!, editForm)
      setProviders((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...editForm } : p))
      )
      setEditOpen(false)
      setEditId(null)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteServiceProvider(id)
      setProviders((prev) => prev.filter((p) => p.id !== id))
      setDeleteId(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("directory.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <div className="sm:ml-auto">
          <Dialog
            open={createOpen}
            onOpenChange={(v) => {
              setCreateOpen(v)
              if (!v) setCreateForm({ ...emptyForm })
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                {t("directory.newProvider")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>{t("createProvider.title")}</DialogTitle>
                  <DialogDescription>
                    {t("createProvider.description")}
                  </DialogDescription>
                </DialogHeader>
                <ProviderFormFields form={createForm} setForm={setCreateForm} />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCreateForm({ ...emptyForm })
                      setCreateOpen(false)
                    }}
                  >
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
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {t("directory.empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((provider) => {
            const isExpanded = expandedId === provider.id
            const totalCost = provider.history.reduce((s, h) => s + h.cost, 0)

            return (
              <Card key={provider.id} className="transition-all">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex-1 text-left"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : provider.id)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                          {provider.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {provider.name}
                            </p>
                            <Badge variant="secondary" className="text-[10px]">
                              {t(`specialties.${provider.specialty}`)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Phone className="h-3 w-3" /> {provider.phone}
                            </span>
                            <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Mail className="h-3 w-3" /> {provider.email}
                            </span>
                            {provider.website && (
                              <a
                                href={provider.website.startsWith("http") ? provider.website : `https://${provider.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:flex items-center gap-1 text-[11px] text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Globe className="h-3 w-3" /> {t("form.website")}
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="hidden sm:flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < provider.rating
                                  ? "fill-chart-3 text-chart-3"
                                  : "text-border"
                                  }`}
                              />
                            ))}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </button>
                  <div className="flex items-center gap-0.5 pr-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEdit(provider)
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(provider.id)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {t("directory.history")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("directory.total")}: {formatCurrency(totalCost)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {provider.history.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              {entry.description}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {new Date(entry.date).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-medium tabular-nums text-foreground">
                              {formatCurrency(entry.cost)}
                            </span>
                            {entry.taxRelevant && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-success/10 text-success border-success/20"
                              >
                                {t("directory.tax")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {provider.history.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        {t("directory.noHistory")}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v)
          if (!v) setEditId(null)
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("editProvider.title")}</DialogTitle>
              <DialogDescription>
                {t("editProvider.description")}
              </DialogDescription>
            </DialogHeader>
            <ProviderFormFields form={editForm} setForm={setEditForm} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditOpen(false)
                  setEditId(null)
                }}
              >
                {t("form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.saving") : t("form.editSave")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null)
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("deleteProvider.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteProvider.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("form.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {isPending ? t("form.deleting") : t("form.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Invoice Form ───────────────────────────────────────────────────────

type InvoiceForm = {
  providerId: string
  providerName: string
  date: string
  description: string
  amount: number
  taxRelevant: boolean
  fileName: string
}

const emptyInvoiceForm: InvoiceForm = {
  providerId: "",
  providerName: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  amount: 0,
  taxRelevant: false,
  fileName: "",
}

function InvoiceFormFields({
  form,
  setForm,
  serviceProviders,
  onProviderSelect,
}: {
  form: InvoiceForm
  setForm: (fn: (prev: InvoiceForm) => InvoiceForm) => void
  serviceProviders: ServiceProvider[]
  onProviderSelect: (providerId: string) => void
}) {
  const t = useTranslations("Services")

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="inv-provider">{t("form.provider")}</Label>
          <Select
            value={form.providerId}
            onValueChange={(v) => onProviderSelect(v)}
          >
            <SelectTrigger id="inv-provider">
              <SelectValue placeholder={t("form.providerPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {serviceProviders.map((sp) => (
                <SelectItem key={sp.id} value={sp.id}>
                  {sp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="inv-date">{t("form.date")}</Label>
          <Input
            id="inv-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="inv-description">{t("form.description")}</Label>
        <Input
          id="inv-description"
          placeholder={t("form.descriptionPlaceholder")}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="inv-amount">{t("form.amount")}</Label>
          <Input
            id="inv-amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="inv-fileName">{t("form.fileName")}</Label>
          <Input
            id="inv-fileName"
            placeholder={t("form.fileNamePlaceholder")}
            value={form.fileName}
            onChange={(e) => setForm((p) => ({ ...p, fileName: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="inv-taxRelevant"
          checked={form.taxRelevant}
          onCheckedChange={(checked) =>
            setForm((p) => ({ ...p, taxRelevant: checked === true }))
          }
        />
        <Label htmlFor="inv-taxRelevant" className="text-sm font-normal cursor-pointer">
          {t("form.taxRelevant")}
        </Label>
      </div>
    </div>
  )
}

function InvoicesTab({ invoices, serviceProviders }: { invoices: Invoice[]; serviceProviders: ServiceProvider[] }) {
  const t = useTranslations("Services")
  const [items, setItems] = useState(invoices)
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<InvoiceForm>({ ...emptyInvoiceForm })

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<InvoiceForm>({ ...emptyInvoiceForm })

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter(
      (i) =>
        i.providerName.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.fileName.toLowerCase().includes(q)
    )
  }, [items, search])

  const taxTotal = filtered
    .filter((i) => i.taxRelevant)
    .reduce((s, i) => s + i.amount, 0)

  function handleProviderSelect(providerId: string, setter: (fn: (prev: InvoiceForm) => InvoiceForm) => void) {
    const provider = serviceProviders.find((p) => p.id === providerId)
    if (provider) {
      setter((prev) => ({ ...prev, providerId: provider.id, providerName: provider.name }))
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.providerName || !createForm.description || !createForm.date) return

    startTransition(async () => {
      await createInvoice(createForm)
      setItems((prev) => [{ ...createForm, id: `temp-${Date.now()}` }, ...prev])
      setCreateForm({ ...emptyInvoiceForm })
      setCreateOpen(false)
    })
  }

  function openEdit(inv: Invoice) {
    setEditId(inv.id)
    setEditForm({
      providerId: inv.providerId,
      providerName: inv.providerName,
      date: inv.date,
      description: inv.description,
      amount: inv.amount,
      taxRelevant: inv.taxRelevant,
      fileName: inv.fileName,
    })
    setEditOpen(true)
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editId || !editForm.description) return

    startTransition(async () => {
      await updateInvoice(editId!, editForm)
      setItems((prev) =>
        prev.map((i) => (i.id === editId ? { ...i, ...editForm } : i))
      )
      setEditOpen(false)
      setEditId(null)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteInvoice(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      setDeleteId(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("invoices.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Receipt className="h-3 w-3 mr-1" />
            {t("invoices.taxDeductible", { amount: formatCurrency(taxTotal) })}
          </Badge>
          <Dialog
            open={createOpen}
            onOpenChange={(v) => {
              setCreateOpen(v)
              if (!v) setCreateForm({ ...emptyInvoiceForm })
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                {t("invoices.newInvoice")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>{t("invoices.createTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("invoices.createDesc")}
                  </DialogDescription>
                </DialogHeader>
                <InvoiceFormFields
                  form={createForm}
                  setForm={setCreateForm}
                  serviceProviders={serviceProviders}
                  onProviderSelect={(id) => handleProviderSelect(id, setCreateForm)}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCreateForm({ ...emptyInvoiceForm })
                      setCreateOpen(false)
                    }}
                  >
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
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{t("form.date")}</TableHead>
                <TableHead className="text-xs">{t("form.provider")}</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">{t("form.description")}</TableHead>
                <TableHead className="text-xs text-right">{t("form.amount")}</TableHead>
                <TableHead className="text-xs text-center">{t("directory.tax")}</TableHead>
                <TableHead className="text-xs text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                    {t("invoices.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm tabular-nums">
                      {new Date(inv.date).toLocaleDateString("de-DE", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {inv.providerName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                      {inv.description}
                    </TableCell>
                    <TableCell className="text-sm font-medium tabular-nums text-right text-foreground">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      {inv.taxRelevant ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-success/10 text-success border-success/20"
                        >
                          {t("directory.tax")}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openEdit(inv)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(inv.id)}
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

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v)
          if (!v) setEditId(null)
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("invoices.editTitle")}</DialogTitle>
              <DialogDescription>
                {t("invoices.editDesc")}
              </DialogDescription>
            </DialogHeader>
            <InvoiceFormFields
              form={editForm}
              setForm={setEditForm}
              serviceProviders={serviceProviders}
              onProviderSelect={(id) => handleProviderSelect(id, setEditForm)}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditOpen(false)
                  setEditId(null)
                }}
              >
                {t("form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.saving") : t("form.editSave")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null)
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("invoices.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("invoices.deleteDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("form.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {isPending ? t("form.deleting") : t("form.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function ServiceHub({ serviceProviders, invoices }: { serviceProviders: ServiceProvider[]; invoices: Invoice[] }) {
  const t = useTranslations("Services")
  return (
    <Tabs defaultValue="directory" className="space-y-4">
      <TabsList>
        <TabsTrigger value="directory" className="gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          {t("tabs.directory")}
        </TabsTrigger>
        <TabsTrigger value="invoices" className="gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {t("tabs.invoices")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="directory">
        <DirectoryTab serviceProviders={serviceProviders} />
      </TabsContent>
      <TabsContent value="invoices">
        <InvoicesTab invoices={invoices} serviceProviders={serviceProviders} />
      </TabsContent>
    </Tabs>
  )
}
