"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Pet, VetRecord, Vaccination } from "@/lib/data";
import type {
  Pet as PrismaPet,
  VetRecord as PrismaVetRecord,
  Vaccination as PrismaVaccination,
} from "@prisma/client";
import { dateToStr } from "./common";

export const petInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  microchipNumber: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  photoPath: z.string().optional().nullable(),
  dietaryNeeds: z.string().optional().nullable(),
  medications: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

function mapPet(r: PrismaPet): Pet {
  return {
    id: r.id,
    name: r.name,
    species: r.species as Pet["species"],
    breed: r.breed || undefined,
    dateOfBirth: r.dateOfBirth ? dateToStr(r.dateOfBirth) : undefined,
    microchipNumber: r.microchipNumber || undefined,
    color: r.color || undefined,
    photoPath: r.photoPath || undefined,
    dietaryNeeds: r.dietaryNeeds || undefined,
    medications: r.medications || undefined,
    notes: r.notes || undefined,
  };
}

function mapVetRecord(r: PrismaVetRecord, petName?: string): VetRecord {
  return {
    id: r.id,
    petId: r.petId,
    petName,
    date: dateToStr(r.date),
    vetName: r.vetName,
    description: r.description,
    cost: r.cost ?? undefined,
    nextVisit: r.nextVisit ? dateToStr(r.nextVisit) : undefined,
    notes: r.notes || undefined,
  };
}

function mapVaccination(r: PrismaVaccination, petName?: string): Vaccination {
  return {
    id: r.id,
    petId: r.petId,
    petName,
    name: r.name,
    date: dateToStr(r.date),
    nextDueDate: r.nextDueDate ? dateToStr(r.nextDueDate) : undefined,
    vetName: r.vetName || undefined,
    batchNumber: r.batchNumber || undefined,
    notes: r.notes || undefined,
  };
}

export async function getPets(): Promise<Pet[]> {
  const rows = await prisma.pet.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapPet);
}

export async function getPet(id: string): Promise<Pet | null> {
  const r = await prisma.pet.findUnique({ where: { id } });
  if (!r) return null;
  return mapPet(r);
}

export async function createPet(data: Omit<Pet, "id">) {
  const validated = petInputSchema.parse(data);
  const created = await prisma.pet.create({
    data: {
      name: validated.name,
      species: validated.species,
      breed: validated.breed || null,
      dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
      microchipNumber: validated.microchipNumber || null,
      color: validated.color || null,
      photoPath: validated.photoPath || null,
      dietaryNeeds: validated.dietaryNeeds || null,
      medications: validated.medications || null,
      notes: validated.notes || null,
    },
  });
  revalidatePath("/pets");
  revalidatePath("/");
  return created;
}

export async function updatePet(id: string, data: Partial<Omit<Pet, "id">>) {
  const updated = await prisma.pet.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.species !== undefined && { species: data.species }),
      ...(data.breed !== undefined && { breed: data.breed || null }),
      ...(data.dateOfBirth !== undefined && {
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      }),
      ...(data.microchipNumber !== undefined && {
        microchipNumber: data.microchipNumber || null,
      }),
      ...(data.color !== undefined && { color: data.color || null }),
      ...(data.photoPath !== undefined && { photoPath: data.photoPath || null }),
      ...(data.dietaryNeeds !== undefined && {
        dietaryNeeds: data.dietaryNeeds || null,
      }),
      ...(data.medications !== undefined && { medications: data.medications || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
  revalidatePath("/pets");
  revalidatePath("/");
  return updated;
}

export async function deletePet(id: string) {
  await prisma.pet.delete({ where: { id } });
  revalidatePath("/pets");
  revalidatePath("/");
  return { success: true };
}

export async function getVetRecords(petId?: string): Promise<VetRecord[]> {
  const where = petId ? { petId } : {};
  const rows = await prisma.vetRecord.findMany({
    where,
    include: { pet: true },
    orderBy: { date: "desc" },
  });
  return rows.map((r) => mapVetRecord(r, r.pet.name));
}

export async function createVetRecord(data: Omit<VetRecord, "id" | "petName">) {
  const created = await prisma.vetRecord.create({
    data: {
      petId: data.petId,
      date: new Date(data.date),
      vetName: data.vetName,
      description: data.description,
      cost: data.cost ?? null,
      nextVisit: data.nextVisit ? new Date(data.nextVisit) : null,
      notes: data.notes || null,
    },
  });
  revalidatePath("/pets");
  revalidatePath("/");
  return created;
}

export async function updateVetRecord(
  id: string,
  data: Partial<Omit<VetRecord, "id" | "petName">>
) {
  const updated = await prisma.vetRecord.update({
    where: { id },
    data: {
      ...(data.petId !== undefined && { petId: data.petId }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.vetName !== undefined && { vetName: data.vetName }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.cost !== undefined && { cost: data.cost ?? null }),
      ...(data.nextVisit !== undefined && {
        nextVisit: data.nextVisit ? new Date(data.nextVisit) : null,
      }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
  revalidatePath("/pets");
  revalidatePath("/");
  return updated;
}

export async function deleteVetRecord(id: string) {
  await prisma.vetRecord.delete({ where: { id } });
  revalidatePath("/pets");
  revalidatePath("/");
  return { success: true };
}

export async function getVaccinations(petId?: string): Promise<Vaccination[]> {
  const where = petId ? { petId } : {};
  const rows = await prisma.vaccination.findMany({
    where,
    include: { pet: true },
    orderBy: { date: "desc" },
  });
  return rows.map((r) => mapVaccination(r, r.pet.name));
}

export async function createVaccination(data: Omit<Vaccination, "id" | "petName">) {
  const created = await prisma.vaccination.create({
    data: {
      petId: data.petId,
      name: data.name,
      date: new Date(data.date),
      nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
      vetName: data.vetName || null,
      batchNumber: data.batchNumber || null,
      notes: data.notes || null,
    },
  });
  revalidatePath("/pets");
  revalidatePath("/");
  return created;
}

export async function updateVaccination(
  id: string,
  data: Partial<Omit<Vaccination, "id" | "petName">>
) {
  const updated = await prisma.vaccination.update({
    where: { id },
    data: {
      ...(data.petId !== undefined && { petId: data.petId }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.nextDueDate !== undefined && {
        nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
      }),
      ...(data.vetName !== undefined && { vetName: data.vetName || null }),
      ...(data.batchNumber !== undefined && { batchNumber: data.batchNumber || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
  revalidatePath("/pets");
  revalidatePath("/");
  return updated;
}

export async function deleteVaccination(id: string) {
  await prisma.vaccination.delete({ where: { id } });
  revalidatePath("/pets");
  revalidatePath("/");
  return { success: true };
}

