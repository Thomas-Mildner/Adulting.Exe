"use client"

import { useState, useMemo, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Search, MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import {
  getDaysRemaining,
  getWarrantyPercent,
  formatCurrency,
  type Appliance,
} from "@/lib/data"
import { createAppliance, updateAppliance, deleteAppliance } from "@/lib/actions"

const statusConfig: Record<
  Appliance["status"],
  { label: string; style: string }
> = {
  protected: {
    label: "Unter Schutz",
    style: "bg-success/10 text-success border-success/20",
  },
  solo: {
    label: "Auf sich allein gestellt",
    style: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  zombie: {
    label: "Zombie-Modus",
    style: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

const categories = [
  "Kueche",
  "Waschraum",
  "Wohnzimmer",
  "Badezimmer",
  "Garten",
  "Werkstatt",
  "Buero",
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
}

function ApplianceFormFields({
  form,
  setForm,
}: {
  form: FormData
  setForm: (fn: (prev: FormData) => FormData) => void
}) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="z.B. Waschmaschine, Staubsauger..."
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="brand">Marke</Label>
          <Input
            id="brand"
            placeholder="z.B. Bosch, Dyson..."
            value={form.brand}
            onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">Kategorie</Label>
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
          <Label htmlFor="price">Preis (EUR)</Label>
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
          <Label htmlFor="purchaseDate">Kaufdatum</Label>
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
          <Label htmlFor="warrantyEnd">Garantie bis</Label>
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
          <Label htmlFor="boxLocation">Aufbewahrungsort</Label>
          <Input
            id="boxLocation"
            placeholder="z.B. Regal A3, Keller Box 2..."
            value={form.boxLocation}
            onChange={(e) =>
              setForm((p) => ({ ...p, boxLocation: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Status</Label>
          <div className="flex gap-2">
            {(["protected", "solo", "zombie"] as const).map((s) => {
              const cfg = statusConfig[s]
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, status: s }))}
                  className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                    form.status === s
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
    </div>
  )
}

export function VaultGrid({ appliances }: { appliances: Appliance[] }) {
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
              Alle ({items.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Aktiv ({items.filter((a) => a.status !== "zombie").length})
            </TabsTrigger>
            <TabsTrigger value="zombie">
              Zombie ({items.filter((a) => a.status === "zombie").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Tresor durchsuchen..."
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
              Neuer Eintrag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Neues Geraet erfassen</DialogTitle>
                <DialogDescription>
                  Quittung raus, Daten rein &mdash; dein Tresor wird staerker.
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
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Speichert..." : "Speichern"}
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
              {"Nichts gefunden. Entweder falsch gesucht oder du besitzt nichts. Beides besorgniserregend."}
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
                      <span className="text-muted-foreground">Garantie</span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {days > 0 ? `${days} Tage uebrig` : "Abgelaufen"}
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
        <DialogContent className="sm:max-w-[520px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Geraet bearbeiten</DialogTitle>
              <DialogDescription>
                Aenderungen werden sofort gespeichert.
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
                Abbrechen
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Speichert..." : "Aenderungen speichern"}
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
            <DialogTitle>Eintrag loeschen?</DialogTitle>
            <DialogDescription>
              Diese Aktion kann nicht rueckgaengig gemacht werden. Der Eintrag
              wird dauerhaft aus dem Tresor entfernt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {isPending ? "Loescht..." : "Endgueltig loeschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
