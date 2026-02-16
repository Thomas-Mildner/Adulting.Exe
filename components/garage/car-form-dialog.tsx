"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { createCar } from "@/lib/actions"

export function CarFormDialog({
  trigger,
  onSuccess,
}: {
  trigger: React.ReactNode
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Garage.form")

  // Form state
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [nextInspection, setNextInspection] = useState("")
  const [currentTireType, setCurrentTireType] = useState("summer")
  const [tireStorageLocation, setTireStorageLocation] = useState("")
  const [firstAidKitExpiry, setFirstAidKitExpiry] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await createCar({
        name,
        brand,
        model,
        licensePlate,
        purchaseDate,
        purchasePrice: parseFloat(purchasePrice),
        nextInspection: nextInspection || undefined,
        currentTireType,
        tireStorageLocation: tireStorageLocation || undefined,
        firstAidKitExpiry: firstAidKitExpiry || undefined,
      })
      setOpen(false)
      onSuccess()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("carName")}</DialogTitle>
            <DialogDescription>Register your money pit.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("carName")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("carNamePlaceholder")}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">{t("brand")}</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={t("brandPlaceholder")}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">{t("model")}</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={t("modelPlaceholder")}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="licensePlate">{t("licensePlate")}</Label>
              <Input
                id="licensePlate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder={t("licensePlatePlaceholder")}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchaseDate">{t("purchaseDate")}</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purchasePrice">{t("purchasePrice")}</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nextInspection">{t("nextInspection")}</Label>
              <Input
                id="nextInspection"
                type="date"
                value={nextInspection}
                onChange={(e) => setNextInspection(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tireType">{t("tireType")}</Label>
              <Select value={currentTireType} onValueChange={setCurrentTireType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tireStorage">{t("tireStorage")}</Label>
              <Input
                id="tireStorage"
                value={tireStorageLocation}
                onChange={(e) => setTireStorageLocation(e.target.value)}
                placeholder={t("tireStoragePlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstAidExpiry">{t("firstAidExpiry")}</Label>
              <Input
                id="firstAidExpiry"
                type="date"
                value={firstAidKitExpiry}
                onChange={(e) => setFirstAidKitExpiry(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
