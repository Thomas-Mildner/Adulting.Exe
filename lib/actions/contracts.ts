"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Contract } from "@/lib/data";
import type { Contract as PrismaContract } from "@prisma/client";
import { dateToStr } from "./common";

export const contractInputSchema = z.object({
  providerName: z.string().min(1, "Provider name is required"),
  accountId: z.string().optional(),
  monthlyCost: z.number().nonnegative(),
  yearlyCost: z.number().nonnegative().optional(),
  category: z.string().min(1),
  lastUsedDate: z.string().optional(),
  isTrial: z.boolean().default(false),
  trialEndDate: z.string().optional(),
  nextBillingDate: z.string(),
  notes: z.string().optional(),
});

export async function getContracts(): Promise<Contract[]> {
  const rows = await prisma.contract.findMany({ orderBy: { nextBillingDate: "asc" } });
  return rows.map((r: PrismaContract) => ({
    id: r.id,
    providerName: r.providerName,
    accountId: r.accountId || undefined,
    monthlyCost: r.monthlyCost,
    yearlyCost: r.yearlyCost || undefined,
    category: r.category as Contract["category"],
    lastUsedDate: r.lastUsedDate ? dateToStr(r.lastUsedDate) : undefined,
    isTrial: r.isTrial,
    trialEndDate: r.trialEndDate ? dateToStr(r.trialEndDate) : undefined,
    nextBillingDate: dateToStr(r.nextBillingDate),
    notes: r.notes || undefined,
  }));
}

export async function getContract(id: string): Promise<Contract | null> {
  const r = await prisma.contract.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    providerName: r.providerName,
    accountId: r.accountId || undefined,
    monthlyCost: r.monthlyCost,
    yearlyCost: r.yearlyCost || undefined,
    category: r.category as Contract["category"],
    lastUsedDate: r.lastUsedDate ? dateToStr(r.lastUsedDate) : undefined,
    isTrial: r.isTrial,
    trialEndDate: r.trialEndDate ? dateToStr(r.trialEndDate) : undefined,
    nextBillingDate: dateToStr(r.nextBillingDate),
    notes: r.notes || undefined,
  };
}

export async function createContract(data: Omit<Contract, "id">): Promise<Contract> {
  const validated = contractInputSchema.parse(data);
  const r = await prisma.contract.create({
    data: {
      providerName: validated.providerName,
      accountId: validated.accountId || null,
      monthlyCost: validated.monthlyCost,
      yearlyCost: validated.yearlyCost || null,
      category: validated.category,
      lastUsedDate: validated.lastUsedDate ? new Date(validated.lastUsedDate) : null,
      isTrial: validated.isTrial,
      trialEndDate: validated.trialEndDate ? new Date(validated.trialEndDate) : null,
      nextBillingDate: new Date(validated.nextBillingDate),
      notes: validated.notes || null,
    },
  });
  revalidatePath("/contracts");
  revalidatePath("/");
  return {
    id: r.id,
    providerName: r.providerName,
    accountId: r.accountId || undefined,
    monthlyCost: r.monthlyCost,
    yearlyCost: r.yearlyCost || undefined,
    category: r.category as Contract["category"],
    lastUsedDate: r.lastUsedDate ? dateToStr(r.lastUsedDate) : undefined,
    isTrial: r.isTrial,
    trialEndDate: r.trialEndDate ? dateToStr(r.trialEndDate) : undefined,
    nextBillingDate: dateToStr(r.nextBillingDate),
    notes: r.notes || undefined,
  };
}

export async function updateContract(id: string, data: Partial<Omit<Contract, "id">>) {
  const updated = await prisma.contract.update({
    where: { id },
    data: {
      ...(data.providerName !== undefined && { providerName: data.providerName }),
      ...(data.accountId !== undefined && { accountId: data.accountId || null }),
      ...(data.monthlyCost !== undefined && { monthlyCost: data.monthlyCost }),
      ...(data.yearlyCost !== undefined && { yearlyCost: data.yearlyCost || null }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.lastUsedDate !== undefined && {
        lastUsedDate: data.lastUsedDate ? new Date(data.lastUsedDate) : null,
      }),
      ...(data.isTrial !== undefined && { isTrial: data.isTrial }),
      ...(data.trialEndDate !== undefined && {
        trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null,
      }),
      ...(data.nextBillingDate !== undefined && {
        nextBillingDate: new Date(data.nextBillingDate),
      }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
  revalidatePath("/contracts");
  revalidatePath("/");
  return updated;
}

export async function deleteContract(id: string) {
  await prisma.contract.delete({ where: { id } });
  revalidatePath("/contracts");
  revalidatePath("/");
  return { success: true };
}

async function getSenderName(): Promise<string> {
  const selfPerson = await prisma.person.findFirst({
    where: { relation: { in: ["Self", "Ich", "Selbst"] } },
  });
  return selfPerson?.name || "Max Mustermann";
}

export async function generateCancellationLetter(id: string): Promise<string> {
  const insurance = await prisma.insurance.findUnique({ where: { id } });
  if (!insurance) throw new Error("Insurance not found");

  const sender = await getSenderName();
  const today = new Date().toLocaleDateString("de-DE");
  const endDate = insurance.cancellationDeadline
    ? new Date(insurance.cancellationDeadline).toLocaleDateString("de-DE")
    : "nächstmöglichen Termin";

  return `${sender}
Musterstraße 1
12345 Musterstadt

${insurance.providerName}
${insurance.agentEmail || ""}

${today}

**Betreff: Kündigung der Versicherung Nr. ${insurance.policyNumber}**

Sehr geehrte Damen und Herren,

hiermit kündige ich meine ${insurance.policyType} (Versicherungsschein-Nr.: ${insurance.policyNumber}) fristgerecht zum ${endDate} oder hilfsweise zum nächstmöglichen Termin.

Bitte senden Sie mir eine schriftliche Bestätigung der Kündigung unter Angabe des Beendigungszeitpunktes zu.

Mit freundlichen Grüßen

${sender}`;
}

export async function generateContractCancellationLetter(id: string): Promise<string> {
  const contract = await getContract(id);
  if (!contract) throw new Error("Contract not found");

  const sender = await getSenderName();
  const today = new Date();
  const todayStr = today.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);
  const endDateStr = endDate.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${sender}
Musterstraße 1
12345 Musterstadt

${contract.providerName}
${contract.accountId ? `Kundennummer: ${contract.accountId}` : ""}

${todayStr}

**Betreff: Kündigung des Vertrags${contract.accountId ? ` (Kundennummer: ${contract.accountId})` : ""}**

Sehr geehrte Damen und Herren,

hiermit kündige ich meinen Vertrag bei ${contract.providerName}${
    contract.accountId ? ` (Kundennummer: ${contract.accountId})` : ""
  } fristgerecht zum ${endDateStr} oder hilfsweise zum nächstmöglichen Termin.

Bitte senden Sie mir eine schriftliche Bestätigung der Kündigung unter Angabe des Beendigungszeitpunktes zu.

Mit freundlichen Grüßen

${sender}`;
}

