"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import type { Car } from "@/lib/data"
import { CarOverview } from "./car-overview"
import { CarFormDialog } from "./car-form-dialog"

export function GarageManager({ initialCars }: { initialCars: Car[] }) {
  const [cars, setCars] = useState(initialCars)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const t = useTranslations("Garage")

  if (cars.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold tracking-tight">{t("noCars")}</h3>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">{t("emptyState")}</p>
          <CarFormDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("addCar")}
              </Button>
            }
            onSuccess={() => {
              // Refresh cars list - in a real app this would refetch from server
              window.location.reload()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CarFormDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("addCar")}
            </Button>
          }
          onSuccess={() => {
            window.location.reload()
          }}
        />
      </div>

      <Tabs defaultValue={cars[0]?.id} className="space-y-6">
        <TabsList>
          {cars.map((car) => (
            <TabsTrigger key={car.id} value={car.id}>
              {car.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {cars.map((car) => (
          <TabsContent key={car.id} value={car.id}>
            <CarOverview car={car} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
