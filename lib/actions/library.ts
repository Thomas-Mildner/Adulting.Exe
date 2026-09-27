"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Document } from "@/lib/data";
import type { Document as PrismaDocument } from "@prisma/client";
import { dateToStr } from "./common";

export const documentInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1),
  type: z.string().min(1),
  description: z.string().default(""),
  content: z.string().optional().nullable(),
});

export async function getDocuments(): Promise<Document[]> {
  const rows = await prisma.document.findMany({ orderBy: { updatedAt: "desc" } });
  return rows.map((r: PrismaDocument) => ({
    id: r.id,
    title: r.title,
    category: r.category as Document["category"],
    type: r.type as Document["type"],
    updatedAt: dateToStr(r.updatedAt),
    description: r.description,
    ...(r.content ? { content: r.content } : {}),
  }));
}

export async function createDocument(data: Omit<Document, "id">) {
  const validated = documentInputSchema.parse(data);
  const created = await prisma.document.create({
    data: {
      title: validated.title,
      category: validated.category,
      type: validated.type,
      description: validated.description,
      content: validated.content || null,
    },
  });
  revalidatePath("/library");
  return created;
}

export async function updateDocument(id: string, data: Partial<Omit<Document, "id">>) {
  const updated = await prisma.document.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.content !== undefined && { content: data.content }),
    },
  });
  revalidatePath("/library");
  return updated;
}

export async function deleteDocument(id: string) {
  await prisma.document.delete({ where: { id } });
  revalidatePath("/library");
  return { success: true };
}

