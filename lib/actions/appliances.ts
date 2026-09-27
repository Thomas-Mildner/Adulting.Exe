"use server";



import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Appliance } from "@/lib/data";
import type { Appliance as PrismaAppliance } from "@prisma/client";
import { dateToStr } from "./common";

const applianceInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  purchaseDate: z.string(),
  warrantyEnd: z.string(),
  boxLocation: z.string().default(""),
  status: z.enum(["protected", "expiring", "expired", "claim_filed"]),
  brand: z.string().default(""),
  price: z.number().nonnegative(),
  receiptPath: z.string().optional().nullable(),
});

export async function getAppliances(): Promise<Appliance[]> {
  const rows = await prisma.appliance.findMany({ orderBy: { warrantyEnd: "asc" } });
  return rows.map((r: PrismaAppliance) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    purchaseDate: dateToStr(r.purchaseDate),
    warrantyEnd: dateToStr(r.warrantyEnd),
    boxLocation: r.boxLocation,
    status: r.status as Appliance["status"],
    brand: r.brand,
    price: r.price,
    receiptPath: r.receiptPath || undefined,
  }));
}

export async function getAppliance(id: string): Promise<Appliance | null> {
  const r = await prisma.appliance.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    purchaseDate: dateToStr(r.purchaseDate),
    warrantyEnd: dateToStr(r.warrantyEnd),
    boxLocation: r.boxLocation,
    status: r.status as Appliance["status"],
    brand: r.brand,
    price: r.price,
    receiptPath: r.receiptPath || undefined,
  };
}

export async function createAppliance(data: Omit<Appliance, "id">) {
  const validated = applianceInputSchema.parse(data);
  const created = await prisma.appliance.create({
    data: {
      name: validated.name,
      category: validated.category,
      purchaseDate: new Date(validated.purchaseDate),
      warrantyEnd: new Date(validated.warrantyEnd),
      boxLocation: validated.boxLocation,
      status: validated.status,
      brand: validated.brand,
      price: validated.price,
      receiptPath: validated.receiptPath ?? null,
    },
  });
  revalidatePath("/vault");
  revalidatePath("/");
  return created;
}

export async function updateAppliance(id: string, data: Partial<Omit<Appliance, "id">>) {
  const updated = await prisma.appliance.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.purchaseDate !== undefined && { purchaseDate: new Date(data.purchaseDate) }),
      ...(data.warrantyEnd !== undefined && { warrantyEnd: new Date(data.warrantyEnd) }),
      ...(data.boxLocation !== undefined && { boxLocation: data.boxLocation }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.brand !== undefined && { brand: data.brand }),
      ...(data.price !== undefined && { price: data.price }),
      ...("receiptPath" in data && { receiptPath: data.receiptPath ?? null }),
    },
  });
  revalidatePath("/vault");
  revalidatePath("/");
  return updated;
}

export async function deleteAppliance(id: string) {
  await prisma.appliance.delete({ where: { id } });
  revalidatePath("/vault");
  revalidatePath("/");
  return { success: true };
}

