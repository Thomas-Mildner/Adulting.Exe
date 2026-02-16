"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFuelEntry, updateFuelEntry } from "@/lib/actions";
import type { FuelEntry } from "@/lib/data";

export function FuelFormDialog({
  carId,
  fuelEntry,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: {
  carId: string;
  fuelEntry?: FuelEntry;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Garage");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [date, setDate] = useState(
    fuelEntry?.date || new Date().toISOString().split("T")[0],
  );
  const [liters, setLiters] = useState(fuelEntry?.liters.toString() || "");
  const [pricePerLiter, setPricePerLiter] = useState(
    fuelEntry?.pricePerLiter.toString() || "",
  );
  const [totalCost, setTotalCost] = useState(
    fuelEntry?.totalCost.toString() || "",
  );
  const [mileage, setMileage] = useState(fuelEntry?.mileage?.toString() || "");
  const [fuelType, setFuelType] = useState(fuelEntry?.fuelType || "diesel");

  // Auto-calculate total cost if liters and pricePerLiter are present
  useEffect(() => {
    const l = parseFloat(liters);
    const p = parseFloat(pricePerLiter);
    if (!isNaN(l) && !isNaN(p)) {
      setTotalCost((l * p).toFixed(2));
    }
  }, [liters, pricePerLiter]);

  useEffect(() => {
    if (open) {
      setDate(fuelEntry?.date || new Date().toISOString().split("T")[0]);
      setLiters(fuelEntry?.liters.toString() || "");
      setPricePerLiter(fuelEntry?.pricePerLiter.toString() || "");
      setTotalCost(fuelEntry?.totalCost.toString() || "");
      setMileage(fuelEntry?.mileage?.toString() || "");
      setFuelType(fuelEntry?.fuelType || "diesel");
    }
  }, [open, fuelEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const mileageValue = mileage ? parseInt(mileage) : null;

      if (fuelEntry) {
        await updateFuelEntry(fuelEntry.id, {
          date,
          liters: parseFloat(liters),
          pricePerLiter: parseFloat(pricePerLiter),
          totalCost: parseFloat(totalCost),
          mileage: mileageValue, // Allow null
          fuelType,
        });
      } else {
        await createFuelEntry({
          carId,
          date,
          liters: parseFloat(liters),
          pricePerLiter: parseFloat(pricePerLiter),
          totalCost: parseFloat(totalCost),
          mileage: mileageValue, // Allow null
          fuelType,
        });
      }
      setOpen(false);
      if (!fuelEntry) {
        // Reset
        setLiters("");
        setPricePerLiter("");
        setTotalCost("");
        setMileage("");
        // keep fuelType
      }
      onSuccess();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {fuelEntry ? t("fuel.editEntry") : t("fuel.addFuel")}
            </DialogTitle>
            <DialogDescription>{t("fuel.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">{t("fuel.date")}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="liters">{t("fuel.liters")}</Label>
                <Input
                  id="liters"
                  type="number"
                  step="0.01"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <Label htmlFor="pricePerLiter">{t("fuel.pricePerLiter")}</Label>
                <Input
                  id="pricePerLiter"
                  type="number"
                  step="0.001"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalCost">{t("fuel.totalCost")}</Label>
                <Input 
                  id="totalCost"
                  type="number"
                  step="0.01"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  required
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mileage">
                  {t("fuel.mileage")}{" "}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({t("optional") || "Optional"})
                  </span>
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fuelType">{t("fuel.fuelType")}</Label>
              <Select
                value={fuelType}
                onValueChange={(val) => setFuelType(val as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">
                    {t("fuel.fuelTypes.diesel")}
                  </SelectItem>
                  <SelectItem value="petrol">
                    {t("fuel.fuelTypes.petrol")}
                  </SelectItem>
                  <SelectItem value="e10">{t("fuel.fuelTypes.e10")}</SelectItem>
                  <SelectItem value="electric">
                    {t("fuel.fuelTypes.electric")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
  );
}
