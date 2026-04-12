"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createAppliance,
  updateHeatingType,
  createWasteType,
  completeOnboarding,
} from "@/lib/actions"
import {
  Home,
  ShieldCheck,
  Wrench,
  Zap,
  Trash2,
  Flame,
  Plus,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Leaf,
  FileText,
  Package,
  Recycle,
  GlassWater,
  Armchair,
  AlertTriangle,
  Apple,
  Monitor,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const TOTAL_STEPS = 5

const heatingTypes = [
  { value: "Gas", label: "Gas (m³)" },
  { value: "Oil", label: "Öl (Liter)" },
  { value: "Fernwärme", label: "Fernwärme (kWh)" },
  { value: "Wärmepumpe", label: "Wärmepumpe (kWh)" },
  { value: "Pellets", label: "Pellets (kg)" },
]

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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trash2,
  Leaf,
  Apple,
  FileText,
  Package,
  Recycle,
  GlassWater,
  Zap,
  Monitor,
  Armchair,
  AlertTriangle,
}

const colorMap: Record<string, string> = {
  "green-500": "#22c55e",
  "blue-500": "#3b82f6",
  "yellow-500": "#eab308",
  "gray-500": "#6b7280",
  "orange-500": "#f97316",
  "purple-500": "#a855f7",
  "red-500": "#ef4444",
  "amber-800": "#92400e",
  "black": "#000000",
}

const colorLabels: Record<string, string> = {
  "green-500": "Green",
  "blue-500": "Blue",
  "yellow-500": "Yellow",
  "gray-500": "Gray",
  "orange-500": "Orange",
  "purple-500": "Purple",
  "red-500": "Red",
  "amber-800": "Brown",
  "black": "Black",
}

type ApplianceForm = {
  name: string
  brand: string
  category: string
  purchaseDate: string
  warrantyEnd: string
  boxLocation: string
  price: number
}

type WasteTypeForm = {
  name: string
  color: string
  icon: string
}

type AddedWasteType = WasteTypeForm & { id: string }

export function OnboardingWizard({
  initialHeatingType,
}: {
  initialHeatingType: string
}) {
  const t = useTranslations("Onboarding")
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [visible, setVisible] = useState(true)

  // Step 2 - Appliance
  const [applianceForm, setApplianceForm] = useState<ApplianceForm>({
    name: "",
    brand: "",
    category: "Küche",
    purchaseDate: new Date().toISOString().split("T")[0],
    warrantyEnd: "",
    boxLocation: "",
    price: 0,
  })
  const [applianceAdded, setApplianceAdded] = useState(false)

  // Step 3 - Heating
  const [heatingType, setHeatingType] = useState(initialHeatingType)
  const [heatingSaved, setHeatingSaved] = useState(false)

  // Step 4 - Waste Types
  const [wasteForm, setWasteForm] = useState<WasteTypeForm>({
    name: "",
    color: "gray-500",
    icon: "Trash2",
  })
  const [addedWasteTypes, setAddedWasteTypes] = useState<AddedWasteType[]>([])

  const stepLabels = [
    t("steps.welcome"),
    t("steps.appliance"),
    t("steps.heating"),
    t("steps.waste"),
    t("steps.done"),
  ]

  function handleNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1))
  }

  function handleAddAppliance(e: React.FormEvent) {
    e.preventDefault()
    if (!applianceForm.name || !applianceForm.warrantyEnd) return

    startTransition(async () => {
      try {
        await createAppliance({
          ...applianceForm,
          status: "protected",
        })
        setApplianceAdded(true)
        toast.success("Appliance added!")
        handleNext()
      } catch {
        toast.error("Failed to add appliance")
      }
    })
  }

  function handleSaveHeating() {
    startTransition(async () => {
      try {
        await updateHeatingType(heatingType)
        setHeatingSaved(true)
        handleNext()
      } catch {
        toast.error("Failed to save heating type")
      }
    })
  }

  function handleAddWasteType(e: React.FormEvent) {
    e.preventDefault()
    if (!wasteForm.name) return

    startTransition(async () => {
      try {
        await createWasteType(wasteForm)
        setAddedWasteTypes((prev) => [
          ...prev,
          { ...wasteForm, id: `wt-${Date.now()}` },
        ])
        setWasteForm({ name: "", color: "gray-500", icon: "Trash2" })
        toast.success("Waste type added!")
      } catch {
        toast.error("Failed to add waste type")
      }
    })
  }

  function handleFinish() {
    startTransition(async () => {
      try {
        await completeOnboarding()
        setVisible(false)
      } catch {
        toast.error("Failed to complete setup")
      }
    })
  }

  if (!visible) return null

  const progressValue = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-[560px] mx-4 rounded-xl border bg-background shadow-2xl overflow-hidden">
        {/* Progress header */}
        <div className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground font-medium">
              {t("stepOf", { current: step, total: TOTAL_STEPS })}
            </p>
            <div className="flex gap-1.5">
              {stepLabels.map((label, idx) => (
                <div
                  key={label}
                  className={`h-1.5 rounded-full transition-all ${
                    idx + 1 <= step
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/20 w-4"
                  }`}
                />
              ))}
            </div>
          </div>
          <Progress value={progressValue} className="h-1" />
        </div>

        {/* Step content */}
        <div className="px-6 py-6 min-h-[380px]">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {t("step1.title")}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  {t("step1.description")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, key: "vault" },
                  { icon: Wrench, key: "maintenance" },
                  { icon: Zap, key: "utilities" },
                  { icon: Trash2, key: "waste" },
                ].map(({ icon: Icon, key }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="rounded-md bg-primary/10 p-2 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium">
                      {t(`step1.features.${key}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Add First Appliance */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t("step2.title")}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t("step2.description")}
                </p>
              </div>
              {applianceAdded ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <p className="text-sm font-medium text-green-600">
                    Appliance added successfully!
                  </p>
                </div>
              ) : (
                <form
                  id="appliance-form"
                  onSubmit={handleAddAppliance}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="onb-name" className="text-xs">
                        Name
                      </Label>
                      <Input
                        id="onb-name"
                        placeholder="e.g. Washing Machine"
                        value={applianceForm.name}
                        onChange={(e) =>
                          setApplianceForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="onb-brand" className="text-xs">
                        Brand
                      </Label>
                      <Input
                        id="onb-brand"
                        placeholder="e.g. Bosch"
                        value={applianceForm.brand}
                        onChange={(e) =>
                          setApplianceForm((p) => ({
                            ...p,
                            brand: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="onb-category" className="text-xs">
                        Category
                      </Label>
                      <Select
                        value={applianceForm.category}
                        onValueChange={(v) =>
                          setApplianceForm((p) => ({ ...p, category: v }))
                        }
                      >
                        <SelectTrigger id="onb-category" className="h-8 text-sm">
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
                    <div className="space-y-1">
                      <Label htmlFor="onb-price" className="text-xs">
                        Price (EUR)
                      </Label>
                      <Input
                        id="onb-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={applianceForm.price || ""}
                        onChange={(e) =>
                          setApplianceForm((p) => ({
                            ...p,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="onb-purchase" className="text-xs">
                        Purchase Date
                      </Label>
                      <Input
                        id="onb-purchase"
                        type="date"
                        value={applianceForm.purchaseDate}
                        onChange={(e) =>
                          setApplianceForm((p) => ({
                            ...p,
                            purchaseDate: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="onb-warranty" className="text-xs">
                        Warranty Until
                      </Label>
                      <Input
                        id="onb-warranty"
                        type="date"
                        value={applianceForm.warrantyEnd}
                        onChange={(e) =>
                          setApplianceForm((p) => ({
                            ...p,
                            warrantyEnd: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="onb-location" className="text-xs">
                      Box Location
                    </Label>
                    <Input
                      id="onb-location"
                      placeholder="e.g. Shelf A3, Basement Box 2..."
                      value={applianceForm.boxLocation}
                      onChange={(e) =>
                        setApplianceForm((p) => ({
                          ...p,
                          boxLocation: e.target.value,
                        }))
                      }
                      className="h-8 text-sm"
                      required
                    />
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 3: Heating Type */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t("step3.title")}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t("step3.description")}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500 shrink-0" />
                  <Label className="text-sm font-medium">
                    {t("step3.select")}
                  </Label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {heatingTypes.map((ht) => (
                    <button
                      key={ht.value}
                      type="button"
                      onClick={() => setHeatingType(ht.value)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-colors text-left ${
                        heatingType === ht.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span>{ht.label}</span>
                      {heatingType === ht.value && (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Waste Types */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t("step4.title")}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t("step4.description")}
                </p>
              </div>

              {addedWasteTypes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {addedWasteTypes.map((wt) => {
                    const Icon = iconMap[wt.icon] || Trash2
                    return (
                      <Badge
                        key={wt.id}
                        variant="outline"
                        className="gap-1.5 text-xs"
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: colorMap[wt.color] || wt.color }}
                        />
                        <Icon className="h-3 w-3" />
                        {wt.name}
                      </Badge>
                    )
                  })}
                </div>
              )}

              <form
                id="waste-form"
                onSubmit={handleAddWasteType}
                className="space-y-3 p-3 border rounded-md bg-muted/40"
              >
                <div className="space-y-1">
                  <Label htmlFor="onb-waste-name" className="text-xs">
                    {t("step4.namePlaceholder")}
                  </Label>
                  <Input
                    id="onb-waste-name"
                    placeholder={t("step4.namePlaceholder")}
                    value={wasteForm.name}
                    onChange={(e) =>
                      setWasteForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="h-8 text-sm"
                    disabled={isPending}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={wasteForm.color}
                    onValueChange={(v) =>
                      setWasteForm((p) => ({ ...p, color: v }))
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-8 flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(colorMap).map(([value, hex]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: hex }}
                            />
                            {colorLabels[value]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={wasteForm.icon}
                    onValueChange={(v) =>
                      setWasteForm((p) => ({ ...p, icon: v }))
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-8 w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(iconMap).map((iconKey) => {
                        const Icon = iconMap[iconKey]
                        return (
                          <SelectItem key={iconKey} value={iconKey}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-3 w-3" />
                              <span className="text-xs">{iconKey}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="w-full h-8"
                  disabled={isPending || !wasteForm.name}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {t("step4.addButton")}
                </Button>
              </form>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                <Home className="h-10 w-10 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {t("step5.title")}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm max-w-sm">
                  {t("step5.description")}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 w-full max-w-xs text-left">
                {[
                  applianceAdded && "First appliance tracked ✓",
                  heatingSaved && "Heating type configured ✓",
                  addedWasteTypes.length > 0 &&
                    `${addedWasteTypes.length} waste type(s) added ✓`,
                ]
                  .filter(Boolean)
                  .map((item) => (
                    <p
                      key={String(item)}
                      className="text-xs text-green-600 dark:text-green-400 flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      {item}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 pb-6 flex items-center justify-between border-t pt-4 bg-muted/30">
          <div>
            {step > 1 && step < 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={isPending}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("back")}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Skip button for optional steps */}
            {step === 2 && !applianceAdded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={isPending}
              >
                {t("step2.skip")}
              </Button>
            )}
            {step === 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={isPending}
              >
                {t("step4.skip")}
              </Button>
            )}

            {/* Main action button */}
            {step === 1 && (
              <Button size="sm" onClick={handleNext}>
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 2 && !applianceAdded && (
              <Button
                size="sm"
                type="submit"
                form="appliance-form"
                disabled={
                  isPending ||
                  !applianceForm.name ||
                  !applianceForm.warrantyEnd
                }
              >
                {isPending ? "Saving..." : t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 2 && applianceAdded && (
              <Button size="sm" onClick={handleNext}>
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 3 && (
              <Button
                size="sm"
                onClick={handleSaveHeating}
                disabled={isPending}
              >
                {isPending ? "Saving..." : t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 4 && (
              <Button size="sm" onClick={handleNext} disabled={isPending}>
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
            {step === 5 && (
              <Button size="sm" onClick={handleFinish} disabled={isPending}>
                {isPending ? "Saving..." : t("step5.goToDashboard")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
