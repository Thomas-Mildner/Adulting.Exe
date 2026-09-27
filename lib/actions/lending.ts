"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { LentItem } from "@/lib/data";
import type { LentItem as PrismaLentItem } from "@prisma/client";
import { dateToStr } from "./common";

export const lentItemInputSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  borrower: z.string().min(1, "Borrower is required"),
  lentDate: z.string(),
  expectedReturn: z.string(),
  trustLevel: z.number().int().min(1).max(5).default(3),
});

export async function getLentItems(): Promise<LentItem[]> {
  const rows = await prisma.lentItem.findMany({ orderBy: { expectedReturn: "asc" } });
  return rows.map((r: PrismaLentItem) => ({
    id: r.id,
    item: r.item,
    borrower: r.borrower,
    lentDate: dateToStr(r.lentDate),
    expectedReturn: dateToStr(r.expectedReturn),
    trustLevel: r.trustLevel as LentItem["trustLevel"],
  }));
}

export async function createLentItem(data: Omit<LentItem, "id">) {
  const validated = lentItemInputSchema.parse(data);
  const created = await prisma.lentItem.create({
    data: {
      item: validated.item,
      borrower: validated.borrower,
      lentDate: new Date(validated.lentDate),
      expectedReturn: new Date(validated.expectedReturn),
      trustLevel: validated.trustLevel,
    },
  });
  revalidatePath("/lending");
  revalidatePath("/");
  return created;
}

export async function updateLentItem(id: string, data: Partial<Omit<LentItem, "id">>) {
  const updated = await prisma.lentItem.update({
    where: { id },
    data: {
      ...(data.item !== undefined && { item: data.item }),
      ...(data.borrower !== undefined && { borrower: data.borrower }),
      ...(data.lentDate !== undefined && { lentDate: new Date(data.lentDate) }),
      ...(data.expectedReturn !== undefined && { expectedReturn: new Date(data.expectedReturn) }),
      ...(data.trustLevel !== undefined && { trustLevel: data.trustLevel }),
    },
  });
  revalidatePath("/lending");
  revalidatePath("/");
  return updated;
}

export async function deleteLentItem(id: string) {
  await prisma.lentItem.delete({ where: { id } });
  revalidatePath("/lending");
  revalidatePath("/");
  return { success: true };
}

