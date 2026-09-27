"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { WishlistProject } from "@/lib/data";
import type { WishlistProject as PrismaWishlistProject } from "@prisma/client";

export const wishlistProjectInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  estimatedCost: z.number().nonnegative(),
  currentSavings: z.number().nonnegative().default(0),
  urgency: z.enum(["low", "medium", "high"]),
  category: z.string().min(1),
});

export async function getWishlistProjects(): Promise<WishlistProject[]> {
  const rows = await prisma.wishlistProject.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((r: PrismaWishlistProject) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    estimatedCost: r.estimatedCost,
    currentSavings: r.currentSavings,
    urgency: r.urgency as WishlistProject["urgency"],
    category: r.category,
  }));
}

export async function createWishlistProject(data: Omit<WishlistProject, "id">) {
  const validated = wishlistProjectInputSchema.parse(data);
  const created = await prisma.wishlistProject.create({
    data: {
      title: validated.title,
      description: validated.description,
      estimatedCost: validated.estimatedCost,
      currentSavings: validated.currentSavings,
      urgency: validated.urgency,
      category: validated.category,
    },
  });
  revalidatePath("/wishlist");
  return created;
}

export async function updateWishlistProject(
  id: string,
  data: Partial<Omit<WishlistProject, "id">>
) {
  const updated = await prisma.wishlistProject.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.estimatedCost !== undefined && { estimatedCost: data.estimatedCost }),
      ...(data.currentSavings !== undefined && { currentSavings: data.currentSavings }),
      ...(data.urgency !== undefined && { urgency: data.urgency }),
      ...(data.category !== undefined && { category: data.category }),
    },
  });
  revalidatePath("/wishlist");
  return updated;
}

export async function deleteWishlistProject(id: string) {
  await prisma.wishlistProject.delete({ where: { id } });
  revalidatePath("/wishlist");
  return { success: true };
}

