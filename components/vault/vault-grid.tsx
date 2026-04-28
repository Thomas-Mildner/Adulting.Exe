"use client"

import { QRCodeDialog } from "@/components/vault/qr-code-dialog"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Search, MapPin, Plus, Pencil, Trash2, Upload, Camera, X, FileText, Image as ImageIcon } from "lucide-react"
import {
  getDaysRemaining,
  getWarrantyPercent,
  formatCurrency,
  type Appliance,
} from "@/lib/data"
import { createAppliance, updateAppliance, deleteAppliance } from "@/lib/actions"
import { useMemo, useState, useTransition, useRef } from "react"

// Status config moved inside components for translation

const categories = [
  "Küche",
  "Waschraum",
  "Wohnzimmer",
  "Badezimmer",
  "Garten",
  "Werkstatt",
  "Büro",
  "Sonstiges",
]

type FormData = {
  name: string
  category: string
  purchaseDate: string
  warrantyEnd: string
  boxLocation: string
  status: Appliance["status"]
  brand: string
  price: number
  receiptPath?: string
}

const emptyForm: FormData = {
  name: "",
  category: "Sonstiges",
  purchaseDate: new Date().toISOString().split("T")[0],
  warrantyEnd: "",
  boxLocation: "",
  status: "protected",
  brand: "",
  price: 0,
  receiptPath: undefined,
}

function ReceiptUpload({
  value,
  onChange,
}: {
  value?: string
  onChange: (path: string | undefined) => void
}) {
  const t = useTranslations("Vault")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error ?? t("fields.receiptError"))
        return
      }
      const { path } = await res.json()
      onChange(path)
    } catch {
      setError(t("fields.receiptError"))
    } finally {
      setIsUploading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // reset so same file can be re-selected
    e.target.value = ""
  }

  const isPdf = value?.toLowerCase().endsWith(".pdf")
  const isImage = value && !isPdf
  // Only allow paths from our own uploads directory to prevent XSS
  const isSafePath = (v: string) => /^\/uploads\/vault\/[a-zA-Z0-9_-]+\.[a-zA-Z]{3,4}$/.test(v)
  const safeSrc = value && isSafePath(value) ? value : undefined

  return (
    <div className="grid gap-2">
      <Label>{t("fields.receipt")}</Label>

      {safeSrc ? (
        <div className="relative rounded-md border bg-muted/30 p-2">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={safeSrc}
              alt={t("fields.receiptPreview")}
              className="max-h-40 w-full rounded object-contain"
            />
          ) : (
            <div className="flex items-center gap-2 py-2 px-1 text-sm text-muted-foreground">
              <FileText className="h-5 w-5 shrink-0" />
              <span className="truncate">{safeSrc.split("/").pop()}</span>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-6 w-6 rounded-full bg-background/80 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onChange(undefined)}
            aria-label={t("fields.receiptRemove")}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-border bg-muted/20 px-4 py-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
        >
          {isUploading ? (
            <p className="text-xs text-muted-foreground">{t("fields.receiptUploading")}</p>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {t("fields.receiptDragDrop")}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  {t("fields.receiptFile")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click() }}
                >
                  <Camera className="h-3.5 w-3.5" />
                  {t("fields.receiptCamera")}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        className="hidden"
        onChange={handleInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}

function ApplianceFormFields({
  form,
  setForm,
}: {
  form: FormData
  setForm: (fn: (prev: FormData) => FormData) => void
}) {
  const t = useTranslations("Vault")
  const statusConfig = {
    protected: { label: t("status.protected"), style: "bg-success/10 text-success border-success/20" },
    solo: { label: t("status.solo"), style: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
    zombie: { label: t("status.zombie"), style: "bg-destructive/10 text-destructive border-destructive/20" },
  }
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">{t("fields.name")}</Label>
          <Input
            id="name"
            placeholder={t("fields.namePlaceholder")}
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="brand">{t("fields.brand")}</Label>
          <Input
            id="brand"
            placeholder={t("fields.brandPlaceholder")}
            value={form.brand}
            onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">{t("fields.category")}</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">{t("fields.price")}</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))
            }
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="purchaseDate">{t("fields.purchaseDate")}</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, purchaseDate: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="warrantyEnd">{t("fields.warrantyEnd")}</Label>
          <Input
            id="warrantyEnd"
            type="date"
            value={form.warrantyEnd}
            onChange={(e) =>
              setForm((p) => ({ ...p, warrantyEnd: e.target.value }))
            }
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="boxLocation">{t("fields.boxLocation")}</Label>
          <Input
            id="boxLocation"
            placeholder={t("fields.boxLocationPlaceholder")}
            value={form.boxLocation}
            onChange={(e) =>
              setForm((p) => ({ ...p, boxLocation: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("fields.status")}</Label>
          <div className="flex gap-2">
            {(["protected", "solo", "zombie"] as const).map((s) => {
              const cfg = statusConfig[s]
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, status: s }))}
                  className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${form.status === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                    }`}
                >
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <ReceiptUpload
        value={form.receiptPath}
        onChange={(path) => setForm((p) => ({ ...p, receiptPath: path }))}
      />
    </div>
  )
}

export function VaultGrid({ appliances }: { appliances: Appliance[] }) {
  const t = useTranslations("Vault")
  const statusConfig = {
    protected: { label: t("status.protected"), style: "bg-success/10 text-success border-success/20" },
    solo: { label: t("status.solo"), style: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
    zombie: { label: t("status.zombie"), style: "bg-destructive/10 text-destructive border-destructive/20" },
  }

  const [items, setItems] = useState(appliances)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [isPending, startTransition] = useTransition()

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<FormData>({ ...emptyForm })

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormData>({ ...emptyForm })

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items
      .filter(
        (a) =>
          (tab === "all" ||
            (tab === "active" && a.status !== "zombie") ||
            (tab === "zombie" && a.status === "zombie")) &&
          (a.name.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.brand.toLowerCase().includes(q) ||
            a.boxLocation.toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime()
      )
  }, [items, search, tab])

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.name || !createForm.warrantyEnd) return

    startTransition(async () => {
      await createAppliance(createForm)
      setItems((prev) => [...prev, { ...createForm, id: `temp-${Date.now()}` }])
      setCreateForm({ ...emptyForm })
      setCreateOpen(false)
    })
  }

  function openEdit(item: Appliance) {
    setEditId(item.id)
    setEditForm({
      name: item.name,
      category: item.category,
      purchaseDate: item.purchaseDate,
      warrantyEnd: item.warrantyEnd,
      boxLocation: item.boxLocation,
      status: item.status,
      brand: item.brand,
      price: item.price,
      receiptPath: item.receiptPath,
    })
    setEditOpen(true)
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editId || !editForm.name) return

    startTransition(async () => {
      await updateAppliance(editId!, editForm)
      setItems((prev) =>
        prev.map((a) => (a.id === editId ? { ...a, ...editForm } : a))
      )
      setEditOpen(false)
      setEditId(null)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteAppliance(id)
      setItems((prev) => prev.filter((a) => a.id !== id))
      setDeleteId(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs value={tab} onValueChange={setTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">
              {t("tabs.all", { count: items.length })}
            </TabsTrigger>
            <TabsTrigger value="active">
              {t("tabs.active", { count: items.filter((a) => a.status !== "zombie").length })}
            </TabsTrigger>
            <TabsTrigger value="zombie">
              {t("tabs.zombie", { count: items.filter((a) => a.status === "zombie").length })}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>

        {/* Create Dialog */}
        <Dialog
          open={createOpen}
          onOpenChange={(v) => {
            setCreateOpen(v)
            if (!v) setCreateForm({ ...emptyForm })
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              {t("create.button")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>{t("create.title")}</DialogTitle>
                <DialogDescription>
                  {t("create.description")}
                </DialogDescription>
              </DialogHeader>
              <ApplianceFormFields form={createForm} setForm={setCreateForm} />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreateForm({ ...emptyForm })
                    setCreateOpen(false)
                  }}
                >
                  {t("create.cancel")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("create.saving") : t("create.save")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {t("emptyState")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const days = getDaysRemaining(item.warrantyEnd)
            const pct = getWarrantyPercent(item.purchaseDate, item.warrantyEnd)
            const { label, style } = statusConfig[item.status]

            return (
              <Card
                key={item.id}
                className="group transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.brand} &middot; {item.category} &middot;{" "}
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${style}`}
                      >
                        {label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{t("card.warranty")}</span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {days > 0 ? t("card.daysRemaining", { days }) : t("card.expired")}
                      </span>
                    </div>
                    <Progress
                      value={Math.max(pct, 0)}
                      className="h-1.5"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>
                        {new Date(item.purchaseDate).toLocaleDateString(
                          "de-DE",
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                      <span>
                        {new Date(item.warrantyEnd).toLocaleDateString(
                          "de-DE",
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {item.boxLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.receiptPath && /^\/uploads\/vault\/[a-zA-Z0-9_-]+\.[a-zA-Z]{3,4}$/.test(item.receiptPath) && (
                        <a
                          href={item.receiptPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-6 w-6 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
                          title={t("fields.receiptPreview")}
                        >
                          <FileText className="h-3 w-3" />
                        </a>
                      )}
                      <QRCodeDialog id={item.id} name={item.name} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
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
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("edit.title")}</DialogTitle>
              <DialogDescription>
                {t("edit.description")}
              </DialogDescription>
            </DialogHeader>
            <ApplianceFormFields form={editForm} setForm={setEditForm} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditOpen(false)
                  setEditId(null)
                }}
              >
                {t("create.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("create.saving") : t("edit.save")}
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
            <DialogTitle>{t("delete.title")}</DialogTitle>
            <DialogDescription>
              {t("delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("create.cancel")}
            </Button>
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
