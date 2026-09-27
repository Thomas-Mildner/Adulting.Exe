"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Illness } from "@/lib/data";
import type { Illness as PrismaIllness, Person as PrismaPerson } from "@prisma/client";
import { dateToStr } from "./common";

export const illnessInputSchema = z.object({
  personId: z.string().min(1),
  name: z.string().min(1, "Illness name is required"),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

function mapIllness(illness: PrismaIllness & { person: PrismaPerson }): Illness {
  return {
    id: illness.id,
    personId: illness.personId,
    personName: illness.person.name,
    name: illness.name,
    startDate: dateToStr(illness.startDate),
    endDate: illness.endDate ? dateToStr(illness.endDate) : undefined,
    notes: illness.notes || undefined,
  };
}

function validateIllnessDates(startDate: string, endDate?: string | null) {
  if (!endDate) return;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    throw new Error("Illness end date must be on or after the start date.");
  }
}

export async function getIllnesses(personId?: string): Promise<Illness[]> {
  const where = personId ? { personId } : {};
  const illnesses = await prisma.illness.findMany({
    where,
    include: { person: true },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });

  return illnesses.map(mapIllness);
}

export async function getIllness(id: string): Promise<Illness | null> {
  const illness = await prisma.illness.findUnique({
    where: { id },
    include: { person: true },
  });

  return illness ? mapIllness(illness) : null;
}

export async function createIllness(data: Omit<Illness, "id" | "personName">) {
  validateIllnessDates(data.startDate, data.endDate);

  const created = await prisma.illness.create({
    data: {
      personId: data.personId,
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      notes: data.notes ?? null,
    },
  });

  revalidatePath("/illnesses");
  return created;
}

export async function updateIllness(
  id: string,
  data: Partial<Omit<Illness, "id" | "personName">>
) {
  if (data.startDate !== undefined || data.endDate !== undefined) {
    const existingIllness = await prisma.illness.findUnique({ where: { id } });
    if (!existingIllness) {
      throw new Error("Illness not found.");
    }

    validateIllnessDates(
      data.startDate ?? dateToStr(existingIllness.startDate),
      data.endDate ?? (existingIllness.endDate ? dateToStr(existingIllness.endDate) : undefined)
    );
  }

  const updated = await prisma.illness.update({
    where: { id },
    data: {
      ...(data.personId !== undefined && { personId: data.personId }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && {
        endDate: data.endDate ? new Date(data.endDate) : null,
      }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });

  revalidatePath("/illnesses");
  return updated;
}

export async function deleteIllness(id: string) {
  await prisma.illness.delete({ where: { id } });
  revalidatePath("/illnesses");
  return { success: true };
}

