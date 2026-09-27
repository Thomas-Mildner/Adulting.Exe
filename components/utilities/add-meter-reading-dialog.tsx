"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Zap, Droplets, Flame } from "lucide-react";
import { createMeterReading } from "@/lib/actions";

interface AddMeterReadingDialogProps {
  heatingUnit: string;
}

export function AddMeterReadingDialog({ heatingUnit }: AddMeterReadingDialogProps) {
  const t = useTranslations("Utilities");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [dlgPower, setDlgPower] = useState("");
  const [dlgWater, setDlgWater] = useState("");
  const [dlgHeating, setDlgHeating] = useState("");
  const [dlgPowerCost, setDlgPowerCost] = useState("");
  const [dlgWaterCost, setDlgWaterCost] = useState("");
  const [dlgHeatingCost, setDlgHeatingCost] = useState("");
  const [dlgMonth, setDlgMonth] = useState(
    new Date().toLocaleDateString("de-DE", { month: "short", year: "numeric" })
  );

  const handleSave = async () => {
    if (!dlgPower && !dlgWater && !dlgHeating) {
      toast.error(t("noData"));
      return;
    }
    setSaving(true);
    try {
      await createMeterReading({
        month: dlgMonth,
        power: dlgPower ? parseFloat(dlgPower) : 0,
        water: dlgWater ? parseFloat(dlgWater) : 0,
        heating: dlgHeating ? parseFloat(dlgHeating) : 0,
        powerCost: dlgPowerCost ? parseFloat(dlgPowerCost) : 0,
        waterCost: dlgWaterCost ? parseFloat(dlgWaterCost) : 0,
        heatingCost: dlgHeatingCost ? parseFloat(dlgHeatingCost) : 0,
      });
      toast.success(t("saveSuccess", { defaultValue: "Zählerstand gespeichert!" }));
      setDlgPower("");
      setDlgWater("");
      setDlgHeating("");
      setDlgPowerCost("");
      setDlgWaterCost("");
      setDlgHeatingCost("");
      setOpen(false);
    } catch {
      toast.error(t("saveError", { defaultValue: "Fehler beim Speichern." }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          {t("addReading")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("addDialogTitle")}</DialogTitle>
          <DialogDescription>{t("addDialogDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="dlg-month">{t("month")}</Label>
            <Input
              id="dlg-month"
              placeholder={t("placeholders.month")}
              value={dlgMonth}
              onChange={(e) => setDlgMonth(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-chart-1" />
                <Label className="text-xs font-medium">{t("power")} (kWh)</Label>
              </div>
              <Input
                type="number"
                placeholder={t("placeholders.consumption", { unit: "kWh" })}
                value={dlgPower}
                onChange={(e) => setDlgPower(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-medium">
                {t("cost")} {t("power")} (€)
              </Label>
              <Input
                type="number"
                placeholder={t("placeholders.cost")}
                value={dlgPowerCost}
                onChange={(e) => setDlgPowerCost(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-primary" />
                <Label className="text-xs font-medium">{t("water")} (m³)</Label>
              </div>
              <Input
                type="number"
                placeholder={t("placeholders.consumption", { unit: "m³" })}
                value={dlgWater}
                onChange={(e) => setDlgWater(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-medium">
                {t("cost")} {t("water")} (€)
              </Label>
              <Input
                type="number"
                placeholder={t("placeholders.cost")}
                value={dlgWaterCost}
                onChange={(e) => setDlgWaterCost(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-chart-4" />
                <Label className="text-xs font-medium">Heizung ({heatingUnit})</Label>
              </div>
              <Input
                type="number"
                placeholder={`Verbrauch ${heatingUnit}`}
                value={dlgHeating}
                onChange={(e) => setDlgHeating(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-medium">
                {t("cost")} {t("heating")} (€)
              </Label>
              <Input
                type="number"
                placeholder={t("placeholders.cost")}
                value={dlgHeatingCost}
                onChange={(e) => setDlgHeatingCost(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? t("saving") : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

