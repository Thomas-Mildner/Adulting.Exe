

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Person, IdentityDocument } from "@/lib/data";
import { dateToStr } from "./common";

export const personInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
});

export const identityDocumentInputSchema = z.object({
  personId: z.string().min(1),
  documentType: z.string().min(1),
  customDocumentType: z.string().optional(),
  documentNumber: z.string().min(1),
  issueDate: z.string(),
  expiryDate: z.string(),
  photoFrontPath: z.string().optional(),
  photoBackPath: z.string().optional(),
  physicalLocation: z.string().optional(),
  lostFoundGuide: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

export async function getPersons(): Promise<(Person & { documentCount: number })[]> {
  const persons = await prisma.person.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { documents: true },
      },
    },
  });

  return persons.map((p) => ({
    id: p.id,
    name: p.name,
    relation: p.relation as Person["relation"],
    documentCount: p._count.documents,
  }));
}

export async function getPerson(id: string): Promise<Person | null> {
  const p = await prisma.person.findUnique({ where: { id } });
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    relation: p.relation as Person["relation"],
  };
}

export async function createPerson(data: Omit<Person, "id">) {
  const validated = personInputSchema.parse(data);
  const created = await prisma.person.create({
    data: {
      name: validated.name,
      relation: validated.relation,
    },
  });
  revalidatePath("/documents");
  revalidatePath("/illnesses");
  revalidatePath("/");
  return created;
}

export async function updatePerson(id: string, data: Partial<Omit<Person, "id">>) {
  const updated = await prisma.person.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.relation !== undefined && { relation: data.relation }),
    },
  });
  revalidatePath("/documents");
  revalidatePath("/illnesses");
  revalidatePath("/");
  return updated;
}

export async function deletePerson(id: string) {
  await prisma.person.delete({ where: { id } });
  revalidatePath("/documents");
  revalidatePath("/illnesses");
  revalidatePath("/");
  return { success: true };
}

export async function getIdentityDocuments(personId?: string): Promise<IdentityDocument[]> {
  const where = personId ? { personId } : {};
  const docs = await prisma.identityDocument.findMany({
    where,
    include: { person: true },
    orderBy: { expiryDate: "asc" },
  });

  return docs.map((d) => ({
    id: d.id,
    personId: d.personId,
    personName: d.person.name,
    documentType: d.documentType as IdentityDocument["documentType"],
    customDocumentType: d.customDocumentType || undefined,
    documentNumber: d.documentNumber,
    issueDate: dateToStr(d.issueDate),
    expiryDate: dateToStr(d.expiryDate),
    photoFrontPath: d.photoFrontPath || undefined,
    photoBackPath: d.photoBackPath || undefined,
    physicalLocation: d.physicalLocation || undefined,
    lostFoundGuide: d.lostFoundGuide || undefined,
    emergencyContact: d.emergencyContact || undefined,
    notes: d.notes || undefined,
  }));
}

export async function getIdentityDocument(id: string): Promise<IdentityDocument | null> {
  const d = await prisma.identityDocument.findUnique({
    where: { id },
    include: { person: true },
  });
  if (!d) return null;

  return {
    id: d.id,
    personId: d.personId,
    personName: d.person.name,
    documentType: d.documentType as IdentityDocument["documentType"],
    customDocumentType: d.customDocumentType || undefined,
    documentNumber: d.documentNumber,
    issueDate: dateToStr(d.issueDate),
    expiryDate: dateToStr(d.expiryDate),
    photoFrontPath: d.photoFrontPath || undefined,
    photoBackPath: d.photoBackPath || undefined,
    physicalLocation: d.physicalLocation || undefined,
    lostFoundGuide: d.lostFoundGuide || undefined,
    emergencyContact: d.emergencyContact || undefined,
    notes: d.notes || undefined,
  };
}

export async function createIdentityDocument(data: Omit<IdentityDocument, "id" | "personName">) {
  const validated = identityDocumentInputSchema.parse(data);
  const created = await prisma.identityDocument.create({
    data: {
      personId: validated.personId,
      documentType: validated.documentType,
      customDocumentType: validated.customDocumentType,
      documentNumber: validated.documentNumber,
      issueDate: new Date(validated.issueDate),
      expiryDate: new Date(validated.expiryDate),
      photoFrontPath: validated.photoFrontPath,
      photoBackPath: validated.photoBackPath,
      physicalLocation: validated.physicalLocation,
      lostFoundGuide: validated.lostFoundGuide,
      emergencyContact: validated.emergencyContact,
      notes: validated.notes,
    },
  });
  revalidatePath("/documents");
  revalidatePath("/");
  return created;
}

export async function updateIdentityDocument(
  id: string,
  data: Partial<Omit<IdentityDocument, "id" | "personName">>
) {
  const updated = await prisma.identityDocument.update({
    where: { id },
    data: {
      ...(data.personId !== undefined && { personId: data.personId }),
      ...(data.documentType !== undefined && { documentType: data.documentType }),
      ...(data.customDocumentType !== undefined && {
        customDocumentType: data.customDocumentType,
      }),
      ...(data.documentNumber !== undefined && { documentNumber: data.documentNumber }),
      ...(data.issueDate !== undefined && { issueDate: new Date(data.issueDate) }),
      ...(data.expiryDate !== undefined && { expiryDate: new Date(data.expiryDate) }),
      ...(data.photoFrontPath !== undefined && { photoFrontPath: data.photoFrontPath }),
      ...(data.photoBackPath !== undefined && { photoBackPath: data.photoBackPath }),
      ...(data.physicalLocation !== undefined && {
        physicalLocation: data.physicalLocation,
      }),
      ...(data.lostFoundGuide !== undefined && { lostFoundGuide: data.lostFoundGuide }),
      ...(data.emergencyContact !== undefined && {
        emergencyContact: data.emergencyContact,
      }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
  revalidatePath("/documents");
  revalidatePath("/");
  return updated;
}

export async function deleteIdentityDocument(id: string) {
  await prisma.identityDocument.delete({ where: { id } });
  revalidatePath("/documents");
  revalidatePath("/");
  return { success: true };
}

export async function getExpiringDocuments(daysThreshold: number = 180): Promise<IdentityDocument[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  const docs = await prisma.identityDocument.findMany({
    where: {
      expiryDate: { lte: thresholdDate },
    },
    include: { person: true },
    orderBy: { expiryDate: "asc" },
  });

  return docs.map((d) => ({
    id: d.id,
    personId: d.personId,
    personName: d.person.name,
    documentType: d.documentType as IdentityDocument["documentType"],
    customDocumentType: d.customDocumentType || undefined,
    documentNumber: d.documentNumber,
    issueDate: dateToStr(d.issueDate),
    expiryDate: dateToStr(d.expiryDate),
    photoFrontPath: d.photoFrontPath || undefined,
    photoBackPath: d.photoBackPath || undefined,
    physicalLocation: d.physicalLocation || undefined,
    lostFoundGuide: d.lostFoundGuide || undefined,
    emergencyContact: d.emergencyContact || undefined,
    notes: d.notes || undefined,
  }));
}

