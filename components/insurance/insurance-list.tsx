"use client"

import { useState, useMemo, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Pencil, Trash2, Phone, Mail, Shield } from "lucide-react"
import { getDaysRemaining, formatCurrency, type Insurance } from "@/lib/data"
import { createInsurance, updateInsurance, deleteInsurance } from "@/lib/actions"

const policyTypes: Insurance["policyType"][] = [
  "Home Contents",
  "Residential Building",
  "Private Liability",
  "Legal Protection",
  "Life Insurance",
  "Disability",
  "Pet Insurance",
  "Car Insurance",
  "Custom",
]

const paymentFrequencies: Insurance["paymentFrequency"][] = [
  "Monthly",
  "Quarterly",
  "Annually",
]

type FormData = {
  providerName: string
  policyType: Insurance["policyType"]
  customPolicyType?: string
  policyNumber: string
  premiumAmount: number
  paymentFrequency: Insurance["paymentFrequency"]
  deductible: number
  startDate: string
  endDate?: string
  cancellationDeadline: string
  documentPath?: string
  claimsHotline: string
  agentEmail: string
  beneficiary?: string
  notes?: string
}

const emptyForm: FormData = {
  providerName: "",
  policyType: "Private Liability",
  policyNumber: "",
  premiumAmount: 0,
  paymentFrequency: "Monthly",
  deductible: 0,
  startDate: new Date().toISOString().split("T")[0],
  cancellationDeadline: "",
  claimsHotline: "",
  agentEmail: "",
}

function InsuranceFormFields({
  form,
  setForm,
}: {
  form: FormData
  setForm: (fn: (prev: FormData) => FormData) => void
}) {
  const t = useTranslations("Insurance")

  return (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="providerName">{t("form.providerName")}</Label>
          <Input
            id="providerName"
            placeholder={t("form.providerPlaceholder")}
            value={form.providerName}
            onChange={(e) => setForm((p) => ({ ...p, providerName: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="policyType">{t("form.policyType")}</Label>
          <Select
            value={form.policyType}
            onValueChange={(v) => setForm((p) => ({ ...p, policyType: v as Insurance["policyType"] }))}
          >
            <SelectTrigger id="policyType">
              <SelectValue placeholder={t("form.policyTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {policyTypes.map((pt) => (
                <SelectItem key={pt} value={pt}>
                  {t(`policyTypes.${pt}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {form.policyType === "Custom" && (
        <div className="grid gap-2">
          <Label htmlFor="customPolicyType">{t("form.customPolicyType")}</Label>
          <Input
            id="customPolicyType"
            placeholder={t("form.customPolicyTypePlaceholder")}
            value={form.customPolicyType || ""}
            onChange={(e) => setForm((p) => ({ ...p, customPolicyType: e.target.value }))}
            required
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="policyNumber">{t("form.policyNumber")}</Label>
          <Input
            id="policyNumber"
            placeholder={t("form.policyNumberPlaceholder")}
            value={form.policyNumber}
            onChange={(e) => setForm((p) => ({ ...p, policyNumber: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="premiumAmount">{t("form.premiumAmount")}</Label>
          <Input
            id="premiumAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.premiumAmount || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, premiumAmount: parseFloat(e.target.value) || 0 }))
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="paymentFrequency">{t("form.paymentFrequency")}</Label>
          <Select
            value={form.paymentFrequency}
            onValueChange={(v) => setForm((p) => ({ ...p, paymentFrequency: v as Insurance["paymentFrequency"] }))}
          >
            <SelectTrigger id="paymentFrequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentFrequencies.map((pf) => (
                <SelectItem key={pf} value={pf}>
                  {t(`paymentFrequency.${pf}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="deductible">{t("form.deductible")}</Label>
          <Input
            id="deductible"
            type="number"
            min="0"
            step="0.01"
            value={form.deductible || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, deductible: parseFloat(e.target.value) || 0 }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="startDate">{t("form.startDate")}</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endDate">{t("form.endDate")}</Label>
          <Input
            id="endDate"
            type="date"
            value={form.endDate || ""}
            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cancellationDeadline">{t("form.cancellationDeadline")}</Label>
          <Input
            id="cancellationDeadline"
            type="date"
            value={form.cancellationDeadline}
            onChange={(e) => setForm((p) => ({ ...p, cancellationDeadline: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="claimsHotline">{t("form.claimsHotline")}</Label>
          <Input
            id="claimsHotline"
            type="tel"
            placeholder={t("form.claimsHotlinePlaceholder")}
            value={form.claimsHotline}
            onChange={(e) => setForm((p) => ({ ...p, claimsHotline: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="agentEmail">{t("form.agentEmail")}</Label>
          <Input
            id="agentEmail"
            type="email"
            placeholder={t("form.agentEmailPlaceholder")}
            value={form.agentEmail}
            onChange={(e) => setForm((p) => ({ ...p, agentEmail: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="beneficiary">{t("form.beneficiary")}</Label>
          <Input
            id="beneficiary"
            placeholder={t("form.beneficiaryPlaceholder")}
            value={form.beneficiary || ""}
            onChange={(e) => setForm((p) => ({ ...p, beneficiary: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">{t("form.notes")}</Label>
        <Textarea
          id="notes"
          placeholder={t("form.notesPlaceholder")}
          value={form.notes || ""}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={3}
        />
      </div>
    </div>
  )
}

function getInsuranceStatus(insurance: Insurance): "active" | "expiringSoon" | "expired" {
  const daysToCancel = getDaysRemaining(insurance.cancellationDeadline)
  if (daysToCancel < 0) return "expired"
  if (daysToCancel <= 90) return "expiringSoon"
  return "active"
}

export function InsuranceList({ insurances }: { insurances: Insurance[] }) {
  const t = useTranslations("Insurance")

  const [items, setItems] = useState(insurances)
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
      .filter((ins) => {
        const status = getInsuranceStatus(ins)
        const matchesTab =
          tab === "all" ||
          (tab === "active" && status === "active") ||
          (tab === "expiring" && status === "expiringSoon")
        
        const matchesSearch =
          ins.providerName.toLowerCase().includes(q) ||
          ins.policyType.toLowerCase().includes(q) ||
          ins.policyNumber.toLowerCase().includes(q) ||
          (ins.customPolicyType?.toLowerCase().includes(q) || false)

        return matchesTab && matchesSearch
      })
      .sort(
        (a, b) =>
          new Date(a.cancellationDeadline).getTime() -
          new Date(b.cancellationDeadline).getTime()
      )
  }, [items, search, tab])

  const statusConfig = {
    active: { label: t("status.active"), style: "bg-success/10 text-success border-success/20" },
    expiringSoon: { label: t("status.expiringSoon"), style: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
    expired: { label: t("status.expired"), style: "bg-destructive/10 text-destructive border-destructive/20" },
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.providerName || !createForm.policyNumber || !createForm.cancellationDeadline) return

    startTransition(async () => {
      await createInsurance(createForm)
      setItems((prev) => [...prev, { ...createForm, id: `temp-${Date.now()}` }])
      setCreateForm({ ...emptyForm })
      setCreateOpen(false)
    })
  }

  function openEdit(item: Insurance) {
    setEditId(item.id)
    setEditForm({
      providerName: item.providerName,
      policyType: item.policyType,
      customPolicyType: item.customPolicyType,
      policyNumber: item.policyNumber,
      premiumAmount: item.premiumAmount,
      paymentFrequency: item.paymentFrequency,
      deductible: item.deductible,
      startDate: item.startDate,
      endDate: item.endDate,
      cancellationDeadline: item.cancellationDeadline,
      documentPath: item.documentPath,
      claimsHotline: item.claimsHotline,
      agentEmail: item.agentEmail,
      beneficiary: item.beneficiary,
      notes: item.notes,
    })
    setEditOpen(true)
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editId || !editForm.providerName) return

    startTransition(async () => {
      await updateInsurance(editId!, editForm)
      setItems((prev) =>
        prev.map((ins) => (ins.id === editId ? { ...ins, ...editForm } : ins))
      )
      setEditOpen(false)
      setEditId(null)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteInsurance(id)
      setItems((prev) => prev.filter((ins) => ins.id !== id))
      setDeleteId(null)
    })
  }

  const activeCount = items.filter((ins) => getInsuranceStatus(ins) === "active").length
  const expiringCount = items.filter((ins) => getInsuranceStatus(ins) === "expiringSoon").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs value={tab} onValueChange={setTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">
              {t("list.tabs.all", { count: items.length })}
            </TabsTrigger>
            <TabsTrigger value="active">
              {t("list.tabs.active", { count: activeCount })}
            </TabsTrigger>
            <TabsTrigger value="expiring">
              {t("list.tabs.expiring", { count: expiringCount })}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("list.searchPlaceholder")}
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
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>{t("create.title")}</DialogTitle>
                <DialogDescription>{t("create.description")}</DialogDescription>
              </DialogHeader>
              <InsuranceFormFields form={createForm} setForm={setCreateForm} />
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
            <Shield className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground max-w-md">
              {t("list.empty")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const daysToCancel = getDaysRemaining(item.cancellationDeadline)
            const status = getInsuranceStatus(item)
            const { label, style } = statusConfig[status]

            return (
              <Card key={item.id} className="group transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium text-foreground truncate">
                        {item.providerName}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.policyType === "Custom" && item.customPolicyType
                          ? item.customPolicyType
                          : t(`policyTypes.${item.policyType}`)}
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${style}`}>
                      {label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{t("card.premium")}</span>
                      <span className="font-mono font-medium tabular-nums">
                        {formatCurrency(item.premiumAmount)} / {t(`paymentFrequency.${item.paymentFrequency}`).substring(0, 3)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{t("card.policy")}</span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {item.policyNumber}
                      </span>
                    </div>
                    {item.deductible > 0 && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{t("card.deductible")}</span>
                        <span className="font-mono text-muted-foreground tabular-nums">
                          {formatCurrency(item.deductible)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t">
                      <span className="text-muted-foreground">{t("card.cancellationBy")}</span>
                      <span className={`font-mono tabular-nums ${daysToCancel <= 90 ? "text-chart-3 font-medium" : "text-muted-foreground"}`}>
                        {new Date(item.cancellationDeadline).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{item.claimsHotline}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{item.agentEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t">
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
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("edit.title")}</DialogTitle>
              <DialogDescription>{t("edit.description")}</DialogDescription>
            </DialogHeader>
            <InsuranceFormFields form={editForm} setForm={setEditForm} />
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
            <DialogDescription>{t("delete.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("delete.cancel")}
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
