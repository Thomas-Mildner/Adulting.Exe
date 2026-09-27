"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ServiceProvider, Invoice } from "@/lib/data";
import type {
  ServiceProvider as PrismaSP,
  ServiceHistory as PrismaServiceHistory,
  Invoice as PrismaInvoice,
} from "@prisma/client";
import { dateToStr } from "./common";

type PrismaServiceProvider = PrismaSP & { history: PrismaServiceHistory[] };

export const serviceProviderInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  phone: z.string().default(""),
  email: z.string().default(""),
  website: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
});

export const invoiceInputSchema = z.object({
  providerId: z.string().min(1),
  providerName: z.string().min(1),
  date: z.string(),
  description: z.string().min(1),
  amount: z.number().nonnegative(),
  taxRelevant: z.boolean().default(false),
  fileName: z.string().min(1),
});

export async function getServiceProviders(): Promise<ServiceProvider[]> {
  const rows = await prisma.serviceProvider.findMany({
    include: { history: { orderBy: { date: "desc" } } },
    orderBy: { name: "asc" },
  });
  return rows.map((r: PrismaServiceProvider) => ({
    id: r.id,
    name: r.name,
    specialty: r.specialty,
    phone: r.phone,
    email: r.email,
    ...(r.website ? { website: r.website } : {}),
    rating: r.rating,
    history: r.history.map((h: PrismaServiceHistory) => ({
      date: dateToStr(h.date),
      description: h.description,
      cost: h.cost,
      taxRelevant: h.taxRelevant,
      ...(h.invoiceId ? { invoiceId: h.invoiceId } : {}),
    })),
  }));
}

export async function createServiceProvider(data: Omit<ServiceProvider, "id" | "history">) {
  const validated = serviceProviderInputSchema.parse(data);
  const created = await prisma.serviceProvider.create({
    data: {
      name: validated.name,
      specialty: validated.specialty,
      phone: validated.phone,
      email: validated.email,
      website: validated.website || null,
      rating: validated.rating,
    },
  });
  revalidatePath("/services");
  return created;
}

export async function updateServiceProvider(
  id: string,
  data: Partial<Omit<ServiceProvider, "id" | "history">>
) {
  const updated = await prisma.serviceProvider.update({ where: { id }, data });
  revalidatePath("/services");
  return updated;
}

export async function deleteServiceProvider(id: string) {
  await prisma.serviceProvider.delete({ where: { id } });
  revalidatePath("/services");
  return { success: true };
}

export async function getInvoices(): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({ orderBy: { date: "desc" } });
  return rows.map((r: PrismaInvoice) => ({
    id: r.id,
    providerId: r.providerId,
    providerName: r.providerName,
    date: dateToStr(r.date),
    description: r.description,
    amount: r.amount,
    taxRelevant: r.taxRelevant,
    fileName: r.fileName,
  }));
}

export async function createInvoice(data: Omit<Invoice, "id">) {
  const validated = invoiceInputSchema.parse(data);
  const created = await prisma.invoice.create({
    data: {
      providerId: validated.providerId,
      providerName: validated.providerName,
      date: new Date(validated.date),
      description: validated.description,
      amount: validated.amount,
      taxRelevant: validated.taxRelevant,
      fileName: validated.fileName,
    },
  });
  revalidatePath("/services");
  return created;
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/services");
  return { success: true };
}

export async function updateInvoice(
  id: string,
  data: Partial<Omit<Invoice, "id">>
) {
  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      ...(data.providerId !== undefined && { providerId: data.providerId }),
      ...(data.providerName !== undefined && { providerName: data.providerName }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.taxRelevant !== undefined && { taxRelevant: data.taxRelevant }),
      ...(data.fileName !== undefined && { fileName: data.fileName }),
    },
  });
  revalidatePath("/services");
  return updated;
}

export async function getTotalTaxDeductible(): Promise<number> {
  const result = await prisma.invoice.aggregate({
    where: { taxRelevant: true },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

