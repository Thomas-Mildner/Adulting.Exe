"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { WasteType, WastePickup } from "@/lib/data";
import type {
  WasteType as PrismaWasteType,
  WastePickup as PrismaWastePickup,
} from "@prisma/client";
import { dateToStr } from "./common";

export const wasteTypeInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1),
  icon: z.string().optional(),
});

export const wastePickupInputSchema = z.object({
  date: z.string(),
  wasteTypeId: z.string().min(1),
  recurring: z
    .enum(["none", "weekly", "bi-weekly", "monthly", "4-weekly"])
    .optional(),
});

export async function getWasteTypes(): Promise<WasteType[]> {
  const rows = await prisma.wasteType.findMany({ orderBy: { name: "asc" } });
  return rows.map((r: PrismaWasteType) => ({
    id: r.id,
    name: r.name,
    color: r.color,
    icon: r.icon,
  }));
}

export async function getWastePickups(): Promise<WastePickup[]> {
  const rows = await prisma.wastePickup.findMany({
    include: { wasteType: true },
    orderBy: { date: "asc" },
  });
  return rows.map((r: PrismaWastePickup & { wasteType: PrismaWasteType }) => ({
    id: r.id,
    date: dateToStr(r.date),
    wasteTypeId: r.wasteTypeId,
    wasteType: {
      id: r.wasteType.id,
      name: r.wasteType.name,
      color: r.wasteType.color,
      icon: r.wasteType.icon,
    },
  }));
}

export async function createWastePickup(data: {
  date: string;
  wasteTypeId: string;
  recurring?: "none" | "weekly" | "bi-weekly" | "monthly" | "4-weekly";
}) {
  const validated = wastePickupInputSchema.parse(data);
  const startDate = new Date(validated.date);
  const pickups = [];

  pickups.push({
    date: startDate,
    wasteTypeId: validated.wasteTypeId,
  });

  if (validated.recurring && validated.recurring !== "none") {
    let daysToAdd = 0;
    if (validated.recurring === "weekly") daysToAdd = 7;
    if (validated.recurring === "bi-weekly") daysToAdd = 14;
    if (validated.recurring === "4-weekly") daysToAdd = 28;

    let currentDate = new Date(startDate);
    for (let i = 0; i < 11; i++) {
      if (validated.recurring === "monthly") {
        currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      } else {
        currentDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      }
      pickups.push({
        date: new Date(currentDate),
        wasteTypeId: validated.wasteTypeId,
      });
    }
  }

  const result = await prisma.wastePickup.createMany({
    data: pickups,
    skipDuplicates: true,
  });

  revalidatePath("/");
  revalidatePath("/waste");
  return result;
}

export async function importIcsWastePickups(icsData: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ICAL = require("ical.js");

  const debugLogs: string[] = [];
  const log = (msg: string) => debugLogs.push(msg);

  log(`Starting ICS import. Data length: ${icsData.length}`);

  let jcalData;
  try {
    jcalData = ICAL.parse(icsData);
    log("Parsed jCal data successfully.");
  } catch (e) {
    console.error("Error parsing ICS data:", e);
    throw new Error("Invalid ICS file format.");
  }

  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");
  log(`Found ${vevents.length} events in ICS.`);

  const wasteTypes = await prisma.wasteType.findMany();
  log(`Loaded ${wasteTypes.length} waste types: ${wasteTypes.map((t) => t.name).join(", ")}`);

  const pickupsToCreate = [];

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);
    const summary = (event.summary || "").trim();
    const lowerSummary = summary.toLowerCase();

    const matchedType = wasteTypes.find(
      (t) =>
        lowerSummary.includes(t.name.toLowerCase()) ||
        (t.name === "Restmüll" && lowerSummary.includes("rest")) ||
        (t.name === "Bio" && (lowerSummary.includes("bio") || lowerSummary.includes("organisch"))) ||
        (t.name === "Papier" &&
          (lowerSummary.includes("papier") || lowerSummary.includes("pappe") || lowerSummary.includes("blau"))) ||
        (t.name === "Gelber Sack" &&
          (lowerSummary.includes("gelb") || lowerSummary.includes("wertstoff") || lowerSummary.includes("plastik")))
    );

    if (matchedType && event.startDate) {
      const startDate = event.startDate.toJSDate();
      log(`[MATCH] '${summary}' -> ${matchedType.name} (${startDate.toISOString().split("T")[0]})`);

      pickupsToCreate.push({
        date: startDate,
        wasteTypeId: matchedType.id,
      });
    } else {
      if (!event.startDate) log(`[SKIP] '${summary}' (No Date)`);
      else log(`[SKIP] '${summary}' (No Match)`);
    }
  }

  if (pickupsToCreate.length > 0) {
    log(`Creating ${pickupsToCreate.length} pickups.`);
    await prisma.wastePickup.createMany({
      data: pickupsToCreate,
      skipDuplicates: true,
    });
  }

  revalidatePath("/");
  revalidatePath("/waste");

  return {
    imported: pickupsToCreate.length,
    totalFound: vevents.length,
    logs: debugLogs,
  };
}

export async function deleteWastePickup(id: string) {
  await prisma.wastePickup.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/waste");
  return { success: true };
}

export async function getNextWastePickup(): Promise<WastePickup | null> {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const row = await prisma.wastePickup.findFirst({
    where: { date: { gte: now } },
    include: { wasteType: true },
    orderBy: { date: "asc" },
  });

  if (!row) return null;

  return {
    id: row.id,
    date: dateToStr(row.date),
    wasteTypeId: row.wasteTypeId,
    wasteType: {
      id: row.wasteType.id,
      name: row.wasteType.name,
      color: row.wasteType.color,
      icon: row.wasteType.icon,
    },
  };
}

export async function createWasteType(data: { name: string; color: string; icon?: string }) {
  const validated = wasteTypeInputSchema.parse(data);
  const created = await prisma.wasteType.create({
    data: {
      name: validated.name,
      color: validated.color,
      icon: validated.icon || "Trash2",
    },
  });
  revalidatePath("/");
  revalidatePath("/waste");
  revalidatePath("/settings");
  return created;
}

export async function deleteWasteType(id: string) {
  try {
    await prisma.wasteType.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/waste");
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete waste type:", error);
    throw new Error("Konnte Mülltyp nicht löschen (vielleicht wird er noch verwendet?)");
  }
}

