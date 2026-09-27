"use server";



import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { MeterReading } from "@/lib/data";
import type { MeterReading as PrismaMeterReading } from "@prisma/client";

const meterReadingInputSchema = z.object({
  month: z.string().min(1),
  power: z.number().nonnegative(),
  water: z.number().nonnegative(),
  heating: z.number().nonnegative(),
  powerCost: z.number().nonnegative().default(0),
  waterCost: z.number().nonnegative().default(0),
  heatingCost: z.number().nonnegative().default(0),
});

export async function getMeterReadings(): Promise<MeterReading[]> {
  const rows = await prisma.meterReading.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((r: PrismaMeterReading) => ({
    month: r.month,
    power: r.power,
    water: r.water,
    heating: r.heating,
    powerCost: r.powerCost,
    waterCost: r.waterCost,
    heatingCost: r.heatingCost,
  }));
}

export async function createMeterReading(data: MeterReading) {
  const validated = meterReadingInputSchema.parse(data);
  const result = await prisma.meterReading.upsert({
    where: { month: validated.month },
    update: {
      power: validated.power,
      water: validated.water,
      heating: validated.heating,
      powerCost: validated.powerCost,
      waterCost: validated.waterCost,
      heatingCost: validated.heatingCost,
    },
    create: {
      month: validated.month,
      power: validated.power,
      water: validated.water,
      heating: validated.heating,
      powerCost: validated.powerCost,
      waterCost: validated.waterCost,
      heatingCost: validated.heatingCost,
    },
  });
  revalidatePath("/utilities");
  revalidatePath("/");
  return result;
}

