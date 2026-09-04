"use server"

import { writeFile } from "fs/promises"
import { join } from "path"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type {
  Appliance,
  ServiceProvider,
  Invoice,
  Document,
  MaintenanceTask,
  LentItem,
  MeterReading,
  WishlistProject,
  WasteType,
  WastePickup,
  Car,
  CarMaintenance,
  FuelEntry,
  TollEntry,
  CarDocument,
  Contract,
  Notification,
  Insurance,
  Person,
  IdentityDocument,
  Illness,
  Pet,
  VetRecord,
  Vaccination,
} from "@/lib/data"
import type {
  Appliance as PrismaAppliance,
  ServiceProvider as PrismaSP,
  ServiceHistory as PrismaServiceHistory,
  Invoice as PrismaInvoice,
  Document as PrismaDocument,
  MaintenanceTask as PrismaMaintenanceTask,
  LentItem as PrismaLentItem,
  MeterReading as PrismaMeterReading,
  WishlistProject as PrismaWishlistProject,
  WasteType as PrismaWasteType,
  WastePickup as PrismaWastePickup,
  Car as PrismaCar,
  CarMaintenance as PrismaCarMaintenance,
  FuelEntry as PrismaFuelEntry,
  TollEntry as PrismaTollEntry,
  CarDocument as PrismaCarDocument,
  Insurance as PrismaInsurance,
  Contract as PrismaContract,
  Person as PrismaPerson,
  IdentityDocument as PrismaIdentityDocument,
  Illness as PrismaIllness,
  Pet as PrismaPet,
  VetRecord as PrismaVetRecord,
  Vaccination as PrismaVaccination,
} from "@prisma/client"

type PrismaServiceProvider = PrismaSP & { history: PrismaServiceHistory[] }

// ─── Serialization helpers ──────────────────────────────────────────────

function dateToStr(d: Date): string {
  return d.toISOString().split("T")[0]
}

// ─── Appliances ─────────────────────────────────────────────────────────

export async function getAppliances(): Promise<Appliance[]> {
  const rows = await prisma.appliance.findMany({ orderBy: { warrantyEnd: "asc" } })
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
  }))
}

export async function getAppliance(id: string): Promise<Appliance | null> {
  const r = await prisma.appliance.findUnique({ where: { id } })
  if (!r) return null
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
  }
}

export async function createAppliance(data: Omit<Appliance, "id">) {
  await prisma.appliance.create({
    data: {
      name: data.name,
      category: data.category,
      purchaseDate: new Date(data.purchaseDate),
      warrantyEnd: new Date(data.warrantyEnd),
      boxLocation: data.boxLocation,
      status: data.status,
      brand: data.brand,
      price: data.price,
      receiptPath: data.receiptPath ?? null,
    },
  })
  revalidatePath("/vault")
  revalidatePath("/")
}

export async function updateAppliance(id: string, data: Partial<Omit<Appliance, "id">>) {
  await prisma.appliance.update({
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
  })
  revalidatePath("/vault")
  revalidatePath("/")
}

export async function deleteAppliance(id: string) {
  await prisma.appliance.delete({ where: { id } })
  revalidatePath("/vault")
  revalidatePath("/")
}

// ─── Service Providers ──────────────────────────────────────────────────

export async function getServiceProviders(): Promise<ServiceProvider[]> {
  const rows = await prisma.serviceProvider.findMany({
    include: { history: { orderBy: { date: "desc" } } },
    orderBy: { name: "asc" },
  })
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
  }))
}

export async function createServiceProvider(data: Omit<ServiceProvider, "id" | "history">) {
  await prisma.serviceProvider.create({
    data: {
      name: data.name,
      specialty: data.specialty,
      phone: data.phone,
      email: data.email,
      website: data.website || null,
      rating: data.rating,
    },
  })
  revalidatePath("/services")
}

export async function updateServiceProvider(id: string, data: Partial<Omit<ServiceProvider, "id" | "history">>) {
  await prisma.serviceProvider.update({ where: { id }, data })
  revalidatePath("/services")
}

export async function deleteServiceProvider(id: string) {
  await prisma.serviceProvider.delete({ where: { id } })
  revalidatePath("/services")
}

// ─── Invoices ───────────────────────────────────────────────────────────

export async function getInvoices(): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({ orderBy: { date: "desc" } })
  return rows.map((r: PrismaInvoice) => ({
    id: r.id,
    providerId: r.providerId,
    providerName: r.providerName,
    date: dateToStr(r.date),
    description: r.description,
    amount: r.amount,
    taxRelevant: r.taxRelevant,
    fileName: r.fileName,
  }))
}

export async function createInvoice(data: Omit<Invoice, "id">) {
  await prisma.invoice.create({
    data: {
      providerId: data.providerId,
      providerName: data.providerName,
      date: new Date(data.date),
      description: data.description,
      amount: data.amount,
      taxRelevant: data.taxRelevant,
      fileName: data.fileName,
    },
  })
  revalidatePath("/services")
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } })
  revalidatePath("/services")
}

export async function updateInvoice(id: string, data: Partial<Omit<Invoice, "id">>) {
  await prisma.invoice.update({
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
  })
  revalidatePath("/services")
}

// ─── Documents ──────────────────────────────────────────────────────────

export async function getDocuments(): Promise<Document[]> {
  const rows = await prisma.document.findMany({ orderBy: { updatedAt: "desc" } })
  return rows.map((r: PrismaDocument) => ({
    id: r.id,
    title: r.title,
    category: r.category as Document["category"],
    type: r.type as Document["type"],
    updatedAt: dateToStr(r.updatedAt),
    description: r.description,
    ...(r.content ? { content: r.content } : {}),
  }))
}

export async function createDocument(data: Omit<Document, "id">) {
  await prisma.document.create({
    data: {
      title: data.title,
      category: data.category,
      type: data.type,
      description: data.description,
      content: data.content,
    },
  })
  revalidatePath("/library")
}

export async function updateDocument(id: string, data: Partial<Omit<Document, "id">>) {
  await prisma.document.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.content !== undefined && { content: data.content }),
    },
  })
  revalidatePath("/library")
}

export async function deleteDocument(id: string) {
  await prisma.document.delete({ where: { id } })
  revalidatePath("/library")
}

// ─── Maintenance Tasks ──────────────────────────────────────────────────

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  const rows = await prisma.maintenanceTask.findMany({ orderBy: { dueDate: "asc" } })
  return rows.map((r: PrismaMaintenanceTask) => ({
    id: r.id,
    title: r.title,
    dueDate: dateToStr(r.dueDate),
    recurring: r.recurring,
    priority: r.priority as MaintenanceTask["priority"],
    completed: r.completed,
  }))
}

export async function createMaintenanceTask(data: Omit<MaintenanceTask, "id">) {
  await prisma.maintenanceTask.create({
    data: {
      title: data.title,
      dueDate: new Date(data.dueDate),
      recurring: data.recurring,
      priority: data.priority,
      completed: data.completed,
    },
  })
  revalidatePath("/")
  revalidatePath("/maintenance")
}

export async function updateMaintenanceTask(id: string, data: Partial<Omit<MaintenanceTask, "id">>) {
  await prisma.maintenanceTask.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.dueDate !== undefined && { dueDate: new Date(data.dueDate) }),
      ...(data.recurring !== undefined && { recurring: data.recurring }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.completed !== undefined && { completed: data.completed }),
    },
  })
  revalidatePath("/")
  revalidatePath("/maintenance")
}

export async function toggleMaintenanceTask(id: string) {
  const task = await prisma.maintenanceTask.findUnique({ where: { id } })
  if (!task) return
  await prisma.maintenanceTask.update({
    where: { id },
    data: { completed: !task.completed },
  })
  revalidatePath("/")
  revalidatePath("/maintenance")
}

export async function deleteMaintenanceTask(id: string) {
  await prisma.maintenanceTask.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/maintenance")
}

// ─── Lent Items ─────────────────────────────────────────────────────────

export async function getLentItems(): Promise<LentItem[]> {
  const rows = await prisma.lentItem.findMany({ orderBy: { expectedReturn: "asc" } })
  return rows.map((r: PrismaLentItem) => ({
    id: r.id,
    item: r.item,
    borrower: r.borrower,
    lentDate: dateToStr(r.lentDate),
    expectedReturn: dateToStr(r.expectedReturn),
    trustLevel: r.trustLevel as LentItem["trustLevel"],
  }))
}

export async function createLentItem(data: Omit<LentItem, "id">) {
  await prisma.lentItem.create({
    data: {
      item: data.item,
      borrower: data.borrower,
      lentDate: new Date(data.lentDate),
      expectedReturn: new Date(data.expectedReturn),
      trustLevel: data.trustLevel,
    },
  })
  revalidatePath("/lending")
  revalidatePath("/")
}

export async function updateLentItem(id: string, data: Partial<Omit<LentItem, "id">>) {
  await prisma.lentItem.update({
    where: { id },
    data: {
      ...(data.item !== undefined && { item: data.item }),
      ...(data.borrower !== undefined && { borrower: data.borrower }),
      ...(data.lentDate !== undefined && { lentDate: new Date(data.lentDate) }),
      ...(data.expectedReturn !== undefined && { expectedReturn: new Date(data.expectedReturn) }),
      ...(data.trustLevel !== undefined && { trustLevel: data.trustLevel }),
    },
  })
  revalidatePath("/lending")
  revalidatePath("/")
}

export async function deleteLentItem(id: string) {
  await prisma.lentItem.delete({ where: { id } })
  revalidatePath("/lending")
  revalidatePath("/")
}

// ─── Meter Readings ─────────────────────────────────────────────────────

export async function getMeterReadings(): Promise<MeterReading[]> {
  const rows = await prisma.meterReading.findMany({ orderBy: { createdAt: "asc" } })
  return rows.map((r: PrismaMeterReading) => ({
    month: r.month,
    power: r.power,
    water: r.water,
    heating: r.heating,
    powerCost: r.powerCost,
    waterCost: r.waterCost,
    heatingCost: r.heatingCost,
  }))
}

export async function createMeterReading(data: MeterReading) {
  await prisma.meterReading.upsert({
    where: { month: data.month },
    update: {
      power: data.power, water: data.water, heating: data.heating,
      powerCost: data.powerCost, waterCost: data.waterCost, heatingCost: data.heatingCost,
    },
    create: {
      month: data.month, power: data.power, water: data.water, heating: data.heating,
      powerCost: data.powerCost, waterCost: data.waterCost, heatingCost: data.heatingCost,
    },
  })
  revalidatePath("/utilities")
  revalidatePath("/")
}

// ─── Wishlist Projects ──────────────────────────────────────────────────

export async function getWishlistProjects(): Promise<WishlistProject[]> {
  const rows = await prisma.wishlistProject.findMany({ orderBy: { createdAt: "asc" } })
  return rows.map((r: PrismaWishlistProject) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    estimatedCost: r.estimatedCost,
    currentSavings: r.currentSavings,
    urgency: r.urgency as WishlistProject["urgency"],
    category: r.category,
  }))
}

export async function createWishlistProject(data: Omit<WishlistProject, "id">) {
  await prisma.wishlistProject.create({
    data: {
      title: data.title,
      description: data.description,
      estimatedCost: data.estimatedCost,
      currentSavings: data.currentSavings,
      urgency: data.urgency,
      category: data.category,
    },
  })
  revalidatePath("/wishlist")
}

export async function updateWishlistProject(id: string, data: Partial<Omit<WishlistProject, "id">>) {
  await prisma.wishlistProject.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.estimatedCost !== undefined && { estimatedCost: data.estimatedCost }),
      ...(data.currentSavings !== undefined && { currentSavings: data.currentSavings }),
      ...(data.urgency !== undefined && { urgency: data.urgency }),
      ...(data.category !== undefined && { category: data.category }),
    },
  })
  revalidatePath("/wishlist")
}

export async function deleteWishlistProject(id: string) {
  await prisma.wishlistProject.delete({ where: { id } })
  revalidatePath("/wishlist")
}

// ─── Aggregations (for dashboard) ───────────────────────────────────────

export async function getTotalTaxDeductible(): Promise<number> {
  const result = await prisma.invoice.aggregate({
    where: { taxRelevant: true },
    _sum: { amount: true },
  })
  return result._sum.amount ?? 0
}

// ─── Waste Calendar ───────────────────────────────────────────────────

export async function getWasteTypes(): Promise<WasteType[]> {
  const rows = await prisma.wasteType.findMany({ orderBy: { name: "asc" } })
  return rows.map((r: PrismaWasteType) => ({
    id: r.id,
    name: r.name,
    color: r.color,
    icon: r.icon,
  }))
}

export async function getWastePickups(): Promise<WastePickup[]> {
  const rows = await prisma.wastePickup.findMany({
    include: { wasteType: true },
    orderBy: { date: "asc" },
  })
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
  }))
}

export async function createWastePickup(data: {
  date: string;
  wasteTypeId: string;
  recurring?: "none" | "weekly" | "bi-weekly" | "monthly" | "4-weekly"
}) {
  const startDate = new Date(data.date)
  const pickups = []

  pickups.push({
    date: startDate,
    wasteTypeId: data.wasteTypeId,
  })

  if (data.recurring && data.recurring !== "none") {
    let daysToAdd = 0
    if (data.recurring === "weekly") daysToAdd = 7
    if (data.recurring === "bi-weekly") daysToAdd = 14
    if (data.recurring === "4-weekly") daysToAdd = 28
    if (data.recurring === "monthly") {
      // Simple monthly logic: same day next month
    }

    // Create pickups for the next 12 occurrences (approx. 3-12 months)
    let currentDate = new Date(startDate)
    for (let i = 0; i < 11; i++) {
      if (data.recurring === "monthly") {
        currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
      } else {
        currentDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
      }
      pickups.push({
        date: new Date(currentDate),
        wasteTypeId: data.wasteTypeId,
      })
    }
  }

  await prisma.wastePickup.createMany({
    data: pickups
  })

  revalidatePath("/")
  revalidatePath("/waste")
}

export async function importIcsWastePickups(icsData: string) {
  // Use require for robust CJS import in server action
  // @ts-ignore
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
  log(`Loaded ${wasteTypes.length} waste types: ${wasteTypes.map(t => t.name).join(", ")}`);

  const pickupsToCreate = [];

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);
    const summary = (event.summary || "").trim();
    const lowerSummary = summary.toLowerCase();

    // Find matching waste type by keyword
    const matchedType = wasteTypes.find(t =>
      lowerSummary.includes(t.name.toLowerCase()) ||
      (t.name === "Restmüll" && lowerSummary.includes("rest")) ||
      (t.name === "Bio" && (lowerSummary.includes("bio") || lowerSummary.includes("organisch"))) ||
      (t.name === "Papier" && (lowerSummary.includes("papier") || lowerSummary.includes("pappe") || lowerSummary.includes("blau"))) ||
      (t.name === "Gelber Sack" && (lowerSummary.includes("gelb") || lowerSummary.includes("wertstoff") || lowerSummary.includes("plastik")))
    );

    if (matchedType && event.startDate) {
      const startDate = event.startDate.toJSDate();
      log(`[MATCH] '${summary}' -> ${matchedType.name} (${startDate.toISOString().split('T')[0]})`);

      pickupsToCreate.push({
        date: startDate,
        wasteTypeId: matchedType.id
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
      skipDuplicates: true
    });
  }

  revalidatePath("/");
  revalidatePath("/waste");

  return {
    imported: pickupsToCreate.length,
    totalFound: vevents.length,
    logs: debugLogs
  };
}

export async function deleteWastePickup(id: string) {
  await prisma.wastePickup.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/waste")
}

export async function getNextWastePickup(): Promise<WastePickup | null> {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const row = await prisma.wastePickup.findFirst({
    where: { date: { gte: now } },
    include: { wasteType: true },
    orderBy: { date: "asc" },
  })

  if (!row) return null

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
  }
}

export async function createWasteType(data: { name: string; color: string; icon?: string }) {
  await prisma.wasteType.create({
    data: {
      name: data.name,
      color: data.color,
      icon: data.icon || "Trash2",
    },
  })
  revalidatePath("/")
  revalidatePath("/waste")
  revalidatePath("/settings")
}

export async function deleteWasteType(id: string) {
  try {
    await prisma.wasteType.delete({
      where: { id },
    })
    revalidatePath("/")
    revalidatePath("/waste")
    revalidatePath("/settings")
  } catch (error) {
    console.error("Failed to delete waste type:", error)
    throw new Error("Konnte Mülltyp nicht löschen (vielleicht wird er noch verwendet?)")
  }
}

// ─── App Config ───────────────────────────────────────────────────────

export async function getAppConfig() {
  let config = await prisma.appConfig.findUnique({ where: { id: "default" } })
  if (!config) {
    config = await prisma.appConfig.create({ data: { id: "default", heatingType: "Gas" } })
  }
  return config
}

export async function updateHeatingType(type: string) {
  await prisma.appConfig.update({
    where: { id: "default" },
    data: { heatingType: type },
  })
  revalidatePath("/settings")
  revalidatePath("/utilities")
}

// ─── Insurance ──────────────────────────────────────────────────────────

export async function getInsurances(): Promise<Insurance[]> {
  // @ts-ignore
  const rows = await prisma.insurance.findMany({ orderBy: { startDate: "desc" } })
  return rows.map((r: PrismaInsurance) => ({
    id: r.id,
    providerName: r.providerName,
    policyType: r.policyType as Insurance["policyType"],
    customPolicyType: r.customPolicyType || undefined,
    policyNumber: r.policyNumber,
    premiumAmount: r.premiumAmount,
    paymentFrequency: r.paymentFrequency as Insurance["paymentFrequency"],
    deductible: r.deductible,
    startDate: dateToStr(r.startDate),
    endDate: r.endDate ? dateToStr(r.endDate) : undefined,
    cancellationDeadline: dateToStr(r.cancellationDeadline),
    documentPath: r.documentPath || undefined,
    claimsHotline: r.claimsHotline,
    agentEmail: r.agentEmail,
    beneficiary: r.beneficiary || undefined,
    notes: r.notes || undefined,
  }))
}

export async function createInsurance(data: Omit<Insurance, "id">) {
  // @ts-ignore
  await prisma.insurance.create({
    data: {
      providerName: data.providerName,
      policyType: data.policyType,
      customPolicyType: data.customPolicyType || null,
      policyNumber: data.policyNumber,
      premiumAmount: data.premiumAmount,
      paymentFrequency: data.paymentFrequency,
      deductible: data.deductible,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      cancellationDeadline: new Date(data.cancellationDeadline),
      documentPath: data.documentPath || null,
      claimsHotline: data.claimsHotline,
      agentEmail: data.agentEmail,
      beneficiary: data.beneficiary || null,
      notes: data.notes || null,
    },
  })
  revalidatePath("/insurance")
  revalidatePath("/")
}

export async function updateInsurance(id: string, data: Partial<Omit<Insurance, "id">>) {
  // @ts-ignore
  await prisma.insurance.update({
    where: { id },
    data: {
      ...(data.providerName !== undefined && { providerName: data.providerName }),
      ...(data.policyType !== undefined && { policyType: data.policyType }),
      ...(data.customPolicyType !== undefined && { customPolicyType: data.customPolicyType || null }),
      ...(data.policyNumber !== undefined && { policyNumber: data.policyNumber }),
      ...(data.premiumAmount !== undefined && { premiumAmount: data.premiumAmount }),
      ...(data.paymentFrequency !== undefined && { paymentFrequency: data.paymentFrequency }),
      ...(data.deductible !== undefined && { deductible: data.deductible }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.cancellationDeadline !== undefined && { cancellationDeadline: new Date(data.cancellationDeadline) }),
      ...(data.documentPath !== undefined && { documentPath: data.documentPath || null }),
      ...(data.claimsHotline !== undefined && { claimsHotline: data.claimsHotline }),
      ...(data.agentEmail !== undefined && { agentEmail: data.agentEmail }),
      ...(data.beneficiary !== undefined && { beneficiary: data.beneficiary || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  })
  revalidatePath("/insurance")
  revalidatePath("/")
}

export async function deleteInsurance(id: string) {
  // @ts-ignore
  await prisma.insurance.delete({ where: { id } })
  revalidatePath("/insurance")
  revalidatePath("/")
}

export async function completeOnboarding() {
  await prisma.appConfig.upsert({
    where: { id: "default" },
    update: { onboardingCompleted: true },
    create: { id: "default", heatingType: "Gas", onboardingCompleted: true },
  })
  revalidatePath("/")
}

export async function updateDisabledModules(modules: string[]) {
  await prisma.appConfig.upsert({
    where: { id: "default" },
    create: { id: "default", heatingType: "Gas", disabledModules: modules },
    update: { disabledModules: modules },
  })
  revalidatePath("/settings")
  revalidatePath("/")
}

export async function completeTutorial(moduleKey: string) {
  const config = await getAppConfig()
  const updated = Array.from(new Set([...config.tutorialCompletedModules, moduleKey]))
  await prisma.appConfig.update({
    where: { id: "default" },
    data: { tutorialCompletedModules: updated },
  })
}

// ─── Cars ───────────────────────────────────────────────────────────────

export async function getCars(): Promise<Car[]> {
  const rows = await prisma.car.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map((r: PrismaCar) => ({
    id: r.id,
    name: r.name,
    brand: r.brand,
    model: r.model,
    licensePlate: r.licensePlate,
    purchaseDate: dateToStr(r.purchaseDate),
    purchasePrice: r.purchasePrice,
    nextInspection: r.nextInspection ? dateToStr(r.nextInspection) : undefined,
    currentTireType: r.currentTireType as "summer" | "winter",
    tireStorageLocation: r.tireStorageLocation ?? undefined,
    firstAidKitExpiry: r.firstAidKitExpiry ? dateToStr(r.firstAidKitExpiry) : undefined,
  }))
}

export async function createCar(data: {
  name: string
  brand: string
  model: string
  licensePlate: string
  purchaseDate: string
  purchasePrice: number
  nextInspection?: string
  currentTireType?: string
  tireStorageLocation?: string
  firstAidKitExpiry?: string
}) {
  await prisma.car.create({
    data: {
      name: data.name,
      brand: data.brand,
      model: data.model,
      licensePlate: data.licensePlate,
      purchaseDate: new Date(data.purchaseDate),
      purchasePrice: data.purchasePrice,
      nextInspection: data.nextInspection ? new Date(data.nextInspection) : null,
      currentTireType: data.currentTireType || "summer",
      tireStorageLocation: data.tireStorageLocation || null,
      firstAidKitExpiry: data.firstAidKitExpiry ? new Date(data.firstAidKitExpiry) : null,
    },
  })
  revalidatePath("/garage")
}

export async function updateCar(
  id: string,
  data: {
    name: string
    brand: string
    model: string
    licensePlate: string
    purchaseDate: string
    purchasePrice: number
    nextInspection?: string
    currentTireType?: string
    tireStorageLocation?: string
    firstAidKitExpiry?: string
  }
) {
  await prisma.car.update({
    where: { id },
    data: {
      name: data.name,
      brand: data.brand,
      model: data.model,
      licensePlate: data.licensePlate,
      purchaseDate: new Date(data.purchaseDate),
      purchasePrice: data.purchasePrice,
      nextInspection: data.nextInspection ? new Date(data.nextInspection) : null,
      currentTireType: data.currentTireType || "summer",
      tireStorageLocation: data.tireStorageLocation || null,
      firstAidKitExpiry: data.firstAidKitExpiry ? new Date(data.firstAidKitExpiry) : null,
    },
  })
  revalidatePath("/garage")
}

export async function deleteCar(id: string) {
  await prisma.car.delete({ where: { id } })
  revalidatePath("/garage")
}

// ─── Car Maintenance ────────────────────────────────────────────────────

export async function getCarMaintenance(carId: string): Promise<CarMaintenance[]> {
  const rows = await prisma.carMaintenance.findMany({
    where: { carId },
    orderBy: { date: "desc" },
  })
  return rows.map((r: PrismaCarMaintenance) => ({
    id: r.id,
    carId: r.carId,
    date: dateToStr(r.date),
    description: r.description,
    cost: r.cost,
    mileage: r.mileage ?? undefined,
    category: r.category as CarMaintenance["category"],
  }))
}

export async function createCarMaintenance(data: {
  carId: string
  date: string
  description: string
  cost: number
  mileage?: number
  category: string
}) {
  await prisma.carMaintenance.create({
    data: {
      carId: data.carId,
      date: new Date(data.date),
      description: data.description,
      cost: data.cost,
      mileage: data.mileage || null,
      category: data.category,
    },
  })
  revalidatePath("/garage")
}

export async function updateCarMaintenance(
  id: string,
  data: {
    date: string
    description: string
    cost: number
    mileage?: number
    category: string
  }
) {
  await prisma.carMaintenance.update({
    where: { id },
    data: {
      date: new Date(data.date),
      description: data.description,
      cost: data.cost,
      mileage: data.mileage || null,
      category: data.category,
    },
  })
  revalidatePath("/garage")
}

export async function deleteCarMaintenance(id: string) {
  await prisma.carMaintenance.delete({ where: { id } })
  revalidatePath("/garage")
}

// ─── Fuel Entries ───────────────────────────────────────────────────────

export async function getFuelEntries(carId: string): Promise<FuelEntry[]> {
  const rows = await prisma.fuelEntry.findMany({
    where: { carId },
    orderBy: { date: "desc" },
  })
  return rows.map((r: PrismaFuelEntry) => ({
    id: r.id,
    carId: r.carId,
    date: dateToStr(r.date),
    liters: r.liters,
    pricePerLiter: r.pricePerLiter,
    totalCost: r.totalCost,
    mileage: r.mileage,
    fuelType: r.fuelType as FuelEntry["fuelType"],
  }))
}

export async function createFuelEntry(data: {
  carId: string
  date: string
  liters: number
  pricePerLiter: number
  totalCost: number
  mileage: number | null
  fuelType: string
}) {
  await prisma.fuelEntry.create({
    data: {
      carId: data.carId,
      date: new Date(data.date),
      liters: data.liters,
      pricePerLiter: data.pricePerLiter,
      totalCost: data.totalCost,
      mileage: data.mileage,
      fuelType: data.fuelType,
    },
  })
  revalidatePath("/garage")
}

export async function updateFuelEntry(
  id: string,
  data: {
    date: string
    liters: number
    pricePerLiter: number
    totalCost: number
    mileage: number | null
    fuelType: string
  }
) {
  await prisma.fuelEntry.update({
    where: { id },
    data: {
      date: new Date(data.date),
      liters: data.liters,
      pricePerLiter: data.pricePerLiter,
      totalCost: data.totalCost,
      mileage: data.mileage,
      fuelType: data.fuelType,
    },
  })
  revalidatePath("/garage")
}

export async function deleteFuelEntry(id: string) {
  await prisma.fuelEntry.delete({ where: { id } })
  revalidatePath("/garage")
}

// ─── Toll Entries ───────────────────────────────────────────────────────

export async function getTollEntries(carId: string): Promise<TollEntry[]> {
  const rows = await prisma.tollEntry.findMany({
    where: { carId },
    orderBy: { date: "desc" },
  })
  return rows.map((r: PrismaTollEntry) => ({
    id: r.id,
    carId: r.carId,
    date: dateToStr(r.date),
    cost: r.cost,
    route: r.route ?? undefined,
    country: r.country ?? undefined,
  }))
}

export async function createTollEntry(data: {
  carId: string
  date: string
  cost: number
  route?: string
  country?: string
}) {
  await prisma.tollEntry.create({
    data: {
      carId: data.carId,
      date: new Date(data.date),
      cost: data.cost,
      route: data.route || null,
      country: data.country || null,
    },
  })
  revalidatePath("/garage")
}

export async function updateTollEntry(
  id: string,
  data: {
    date: string
    cost: number
    route?: string
    country?: string
  }
) {
  await prisma.tollEntry.update({
    where: { id },
    data: {
      date: new Date(data.date),
      cost: data.cost,
      route: data.route || null,
      country: data.country || null,
    },
  })
  revalidatePath("/garage")
}

export async function deleteTollEntry(id: string) {
  await prisma.tollEntry.delete({ where: { id } })
  revalidatePath("/garage")
}

// ─── Car Documents ──────────────────────────────────────────────────────

export async function getCarDocuments(carId: string): Promise<CarDocument[]> {
  const rows = await prisma.carDocument.findMany({
    where: { carId },
    orderBy: { uploadDate: "desc" },
  })
  return rows.map((r: PrismaCarDocument) => ({
    id: r.id,
    carId: r.carId,
    title: r.title,
    category: r.category as CarDocument["category"],
    fileName: r.fileName,
    uploadDate: dateToStr(r.uploadDate),
  }))
}

export async function createCarDocument(data: {
  carId: string
  title: string
  category: string
  fileName: string
}) {
  await prisma.carDocument.create({
    data: {
      carId: data.carId,
      title: data.title,
      category: data.category,
      fileName: data.fileName,
    },
  })
  revalidatePath("/garage")
}

export async function deleteCarDocument(id: string) {
  await prisma.carDocument.delete({ where: { id } })
  revalidatePath("/garage")
}

export async function uploadCarDocument(formData: FormData) {
  const file = formData.get("file") as File
  const carId = formData.get("carId") as string
  const title = formData.get("title") as string
  const category = formData.get("category") as string

  if (!file) throw new Error("No file uploaded")

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = `${Date.now()}-${file.name}`
  const path = join(process.cwd(), "public/uploads", fileName)

  await writeFile(path, buffer)

  await prisma.carDocument.create({
    data: {
      carId,
      title,
      category,
      fileName,
      uploadDate: new Date(),
    },
  })
  revalidatePath("/garage")
}


export async function generateCancellationLetter(id: string): Promise<string> {
  const insurance = await prisma.insurance.findUnique({ where: { id } })
  if (!insurance) throw new Error("Insurance not found")

  const today = new Date().toLocaleDateString("de-DE")
  const endDate = insurance.cancellationDeadline
    ? new Date(insurance.cancellationDeadline).toLocaleDateString("de-DE")
    : "nächstmöglichen Termin"

  return `Max Mustermann
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

Max Mustermann`
}

// ─── Contracts ──────────────────────────────────────────────────────────

export async function getContracts(): Promise<Contract[]> {
  const rows = await prisma.contract.findMany({ orderBy: { nextBillingDate: "asc" } })
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
  }))
}

export async function getContract(id: string): Promise<Contract | null> {
  const r = await prisma.contract.findUnique({ where: { id } })
  if (!r) return null
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
  }
}

export async function createContract(data: Omit<Contract, "id">) {
  await prisma.contract.create({
    data: {
      providerName: data.providerName,
      accountId: data.accountId || null,
      monthlyCost: data.monthlyCost,
      yearlyCost: data.yearlyCost || null,
      category: data.category,
      lastUsedDate: data.lastUsedDate ? new Date(data.lastUsedDate) : null,
      isTrial: data.isTrial,
      trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null,
      nextBillingDate: new Date(data.nextBillingDate),
      notes: data.notes || null,
    },
  })
  revalidatePath("/contracts")
  revalidatePath("/")
}

export async function updateContract(id: string, data: Partial<Omit<Contract, "id">>) {
  await prisma.contract.update({
    where: { id },
    data: {
      ...(data.providerName !== undefined && { providerName: data.providerName }),
      ...(data.accountId !== undefined && { accountId: data.accountId || null }),
      ...(data.monthlyCost !== undefined && { monthlyCost: data.monthlyCost }),
      ...(data.yearlyCost !== undefined && { yearlyCost: data.yearlyCost || null }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.lastUsedDate !== undefined && { lastUsedDate: data.lastUsedDate ? new Date(data.lastUsedDate) : null }),
      ...(data.isTrial !== undefined && { isTrial: data.isTrial }),
      ...(data.trialEndDate !== undefined && { trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null }),
      ...(data.nextBillingDate !== undefined && { nextBillingDate: new Date(data.nextBillingDate) }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  })
  revalidatePath("/contracts")
  revalidatePath("/")
}

export async function deleteContract(id: string) {
  await prisma.contract.delete({ where: { id } })
  revalidatePath("/contracts")
  revalidatePath("/")
}

export async function generateContractCancellationLetter(id: string): Promise<string> {
  const contract = await getContract(id)
  if (!contract) throw new Error("Contract not found")

  const today = new Date()
  const todayStr = today.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  // Calculate cancellation date (30 days from now as default)
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + 30)
  const endDateStr = endDate.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  // NOTE: Replace placeholder personal information with actual user data
  // This should be made configurable through user settings in a future update
  return `Max Mustermann
Musterstraße 1
12345 Musterstadt

${contract.providerName}
${contract.accountId ? `Kundennummer: ${contract.accountId}` : ""}

${todayStr}

**Betreff: Kündigung des Vertrags${contract.accountId ? ` (Kundennummer: ${contract.accountId})` : ""}**

Sehr geehrte Damen und Herren,

hiermit kündige ich meinen Vertrag bei ${contract.providerName}${contract.accountId ? ` (Kundennummer: ${contract.accountId})` : ""} fristgerecht zum ${endDateStr} oder hilfsweise zum nächstmöglichen Termin.

Bitte senden Sie mir eine schriftliche Bestätigung der Kündigung unter Angabe des Beendigungszeitpunktes zu.

Mit freundlichen Grüßen

Max Mustermann`
}

// ─── Notifications ──────────────────────────────────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  const notifications: Notification[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 1. Waste Pickups (Tomorrow)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const endOfTomorrow = new Date(tomorrow)
  endOfTomorrow.setHours(23, 59, 59, 999)

  const waste = await prisma.wastePickup.findMany({
    where: {
      date: {
        gte: tomorrow,
        lte: endOfTomorrow,
      },
    },
    include: { wasteType: true },
  })

  waste.forEach((w) => {
    notifications.push({
      id: `waste-${w.id}`,
      title: `Müllabfuhr Morgen: ${w.wasteType.name}`,
      message: "Vergiss nicht, die Tonne rauszustellen!",
      type: "info",
      category: "Waste",
      link: "/waste",
      date: dateToStr(w.date),
    })
  })

  // 2. Appliances (Warranty expiring < 30 days)
  const warningDate = new Date(today)
  warningDate.setDate(warningDate.getDate() + 30)

  const appliances = await prisma.appliance.findMany({
    where: {
      warrantyEnd: {
        gte: today,
        lte: warningDate,
      },
      status: { not: "zombie" },
    },
  })

  appliances.forEach((a) => {
    notifications.push({
      id: `appliance-${a.id}`,
      title: `Garantie läuft ab: ${a.name}`,
      message: `Die Garantie endet am ${dateToStr(a.warrantyEnd)}.`,
      type: "warning",
      category: "Appliance",
      link: `/vault/${a.id}`,
      date: dateToStr(a.warrantyEnd),
    })
  })

  // 3. Maintenance Tasks (Due or Overdue)
  const tasks = await prisma.maintenanceTask.findMany({
    where: {
      dueDate: { lte: today },
      completed: false,
    },
  })

  tasks.forEach((t) => {
    notifications.push({
      id: `maintenance-${t.id}`,
      title: `Wartung fällig: ${t.title}`,
      message: "Diese Aufgabe ist heute fällig oder überfällig.",
      type: "warning",
      category: "Maintenance",
      link: "/maintenance",
      date: dateToStr(t.dueDate),
    })
  })

  // 4. Lent Items (Overdue)
  const lentItems = await prisma.lentItem.findMany({
    where: {
      expectedReturn: { lt: today },
    },
  })

  lentItems.forEach((l) => {
    notifications.push({
      id: `lent-${l.id}`,
      title: `Überfällig: ${l.item}`,
      message: `${l.borrower} sollte das eigentlich schon zurückgegeben haben.`,
      type: "error",
      category: "Lent",
      link: "/lending",
      date: dateToStr(l.expectedReturn),
    })
  })

  // 5. Contracts (Trial ending in 48 hours)
  const in48Hours = new Date(today)
  in48Hours.setHours(today.getHours() + 48)

  const trials = await prisma.contract.findMany({
    where: {
      isTrial: true,
      trialEndDate: {
        gte: today,
        lte: in48Hours,
      },
    },
  })

  trials.forEach((c) => {
    notifications.push({
      id: `contract-trial-${c.id}`,
      title: `🚨 Trial-Trap Alert: ${c.providerName}`,
      message: `Free trial ends in 48 hours! First charge: €${c.monthlyCost}/month`,
      type: "warning",
      category: "Contract",
      link: "/contracts",
      date: c.trialEndDate ? dateToStr(c.trialEndDate) : undefined,
    })
  })

  // 5. Identity Documents (Expired or Expiring Soon)
  const sixMonthsFromNow = new Date(today)
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

  const expiringDocuments = await prisma.identityDocument.findMany({
    where: {
      expiryDate: { lte: sixMonthsFromNow }
    },
    include: { person: true },
    orderBy: { expiryDate: "asc" },
  })

  expiringDocuments.forEach((doc) => {
    const daysRemaining = Math.ceil(
      (doc.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysRemaining < 0) {
      // Expired
      notifications.push({
        id: `doc-${doc.id}`,
        title: `⚠️ ${doc.documentType} Abgelaufen!`,
        message: `${doc.person.name}'s ${doc.documentType} ist seit ${Math.abs(daysRemaining)} Tagen abgelaufen. Sofort erneuern!`,
        type: "error",
        category: "Maintenance", // Using Maintenance as category since we don't have Documents category
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      })
    } else if (daysRemaining <= 30) {
      // 1 month warning
      notifications.push({
        id: `doc-${doc.id}`,
        title: `Dringend: ${doc.documentType} läuft bald ab`,
        message: `${doc.person.name}'s ${doc.documentType} läuft in ${daysRemaining} Tagen ab.`,
        type: "error",
        category: "Maintenance",
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      })
    } else if (daysRemaining <= 90) {
      // 3 months warning
      notifications.push({
        id: `doc-${doc.id}`,
        title: `${doc.documentType} läuft in ${Math.floor(daysRemaining / 30)} Monaten ab`,
        message: `Zeit für ${doc.person.name}, einen Termin beim Bürgeramt zu vereinbaren.`,
        type: "warning",
        category: "Maintenance",
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      })
    } else if (daysRemaining <= 180) {
      // 6 months warning
      notifications.push({
        id: `doc-${doc.id}`,
        title: `${doc.documentType} läuft in 6 Monaten ab`,
        message: `${doc.person.name}: Der Staat will bald dein Geld/Aufmerksamkeit. Fang an, für einen Termin zu beten.`,
        type: "info",
        category: "Maintenance",
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      })
    }
  })

  // Filter out read notifications
  const readNotifications = await prisma.notificationRead.findMany({
    select: { id: true },
  })
  const readIds = new Set(readNotifications.map((n) => n.id))

  return notifications.filter((n) => !readIds.has(n.id))
}

export async function markNotificationAsRead(id: string) {
  await prisma.notificationRead.create({
    data: { id },
  })
  revalidatePath("/")
}

export async function markAllNotificationsAsRead(ids: string[]) {
  if (ids.length === 0) return
  await prisma.notificationRead.createMany({
    data: ids.map((id) => ({ id })),
    skipDuplicates: true,
  })
  revalidatePath("/")
}

// ─── Person & Identity Documents ────────────────────────────────────────

export async function getPersons(): Promise<(Person & { documentCount: number })[]> {
  const persons = await prisma.person.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { documents: true }
      }
    }
  })

  return persons.map((p) => ({
    id: p.id,
    name: p.name,
    relation: p.relation as Person["relation"],
    documentCount: p._count.documents,
  }))
}

export async function getPerson(id: string): Promise<Person | null> {
  const p = await prisma.person.findUnique({ where: { id } })
  if (!p) return null
  return {
    id: p.id,
    name: p.name,
    relation: p.relation as Person["relation"],
  }
}

export async function createPerson(data: Omit<Person, "id">) {
  await prisma.person.create({
    data: {
      name: data.name,
      relation: data.relation,
    },
  })
  revalidatePath("/documents")
  revalidatePath("/illnesses")
  revalidatePath("/")
}

export async function updatePerson(id: string, data: Partial<Omit<Person, "id">>) {
  await prisma.person.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.relation !== undefined && { relation: data.relation }),
    },
  })
  revalidatePath("/documents")
  revalidatePath("/illnesses")
  revalidatePath("/")
}

export async function deletePerson(id: string) {
  await prisma.person.delete({ where: { id } })
  revalidatePath("/documents")
  revalidatePath("/illnesses")
  revalidatePath("/")
}

export async function getIdentityDocuments(personId?: string): Promise<IdentityDocument[]> {
  const where = personId ? { personId } : {}
  const docs = await prisma.identityDocument.findMany({
    where,
    include: { person: true },
    orderBy: { expiryDate: "asc" },
  })

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
  }))
}

export async function getIdentityDocument(id: string): Promise<IdentityDocument | null> {
  const d = await prisma.identityDocument.findUnique({
    where: { id },
    include: { person: true },
  })
  if (!d) return null

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
  }
}

export async function createIdentityDocument(data: Omit<IdentityDocument, "id" | "personName">) {
  await prisma.identityDocument.create({
    data: {
      personId: data.personId,
      documentType: data.documentType,
      customDocumentType: data.customDocumentType,
      documentNumber: data.documentNumber,
      issueDate: new Date(data.issueDate),
      expiryDate: new Date(data.expiryDate),
      photoFrontPath: data.photoFrontPath,
      photoBackPath: data.photoBackPath,
      physicalLocation: data.physicalLocation,
      lostFoundGuide: data.lostFoundGuide,
      emergencyContact: data.emergencyContact,
      notes: data.notes,
    },
  })
  revalidatePath("/documents")
  revalidatePath("/")
}

export async function updateIdentityDocument(id: string, data: Partial<Omit<IdentityDocument, "id" | "personName">>) {
  await prisma.identityDocument.update({
    where: { id },
    data: {
      ...(data.personId !== undefined && { personId: data.personId }),
      ...(data.documentType !== undefined && { documentType: data.documentType }),
      ...(data.customDocumentType !== undefined && { customDocumentType: data.customDocumentType }),
      ...(data.documentNumber !== undefined && { documentNumber: data.documentNumber }),
      ...(data.issueDate !== undefined && { issueDate: new Date(data.issueDate) }),
      ...(data.expiryDate !== undefined && { expiryDate: new Date(data.expiryDate) }),
      ...(data.photoFrontPath !== undefined && { photoFrontPath: data.photoFrontPath }),
      ...(data.photoBackPath !== undefined && { photoBackPath: data.photoBackPath }),
      ...(data.physicalLocation !== undefined && { physicalLocation: data.physicalLocation }),
      ...(data.lostFoundGuide !== undefined && { lostFoundGuide: data.lostFoundGuide }),
      ...(data.emergencyContact !== undefined && { emergencyContact: data.emergencyContact }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  })
  revalidatePath("/documents")
  revalidatePath("/")
}

export async function deleteIdentityDocument(id: string) {
  await prisma.identityDocument.delete({ where: { id } })
  revalidatePath("/documents")
  revalidatePath("/")
}

export async function getExpiringDocuments(daysThreshold: number = 180): Promise<IdentityDocument[]> {
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)

  const docs = await prisma.identityDocument.findMany({
    where: {
      expiryDate: { lte: thresholdDate }
    },
    include: { person: true },
    orderBy: { expiryDate: "asc" },
  })

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
  }))
}

function mapIllness(illness: PrismaIllness & { person: PrismaPerson }): Illness {
  return {
    id: illness.id,
    personId: illness.personId,
    personName: illness.person.name,
    name: illness.name,
    startDate: dateToStr(illness.startDate),
    endDate: illness.endDate ? dateToStr(illness.endDate) : undefined,
    notes: illness.notes || undefined,
  }
}

function validateIllnessDates(startDate: string, endDate?: string) {
  if (!endDate) return

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    throw new Error("Illness end date must be on or after the start date.")
  }
}

export async function getIllnesses(personId?: string): Promise<Illness[]> {
  const where = personId ? { personId } : {}
  const illnesses = await prisma.illness.findMany({
    where,
    include: { person: true },
    orderBy: [
      { startDate: "desc" },
      { createdAt: "desc" },
    ],
  })

  return illnesses.map(mapIllness)
}

export async function getIllness(id: string): Promise<Illness | null> {
  const illness = await prisma.illness.findUnique({
    where: { id },
    include: { person: true },
  })

  return illness ? mapIllness(illness) : null
}

export async function createIllness(data: Omit<Illness, "id" | "personName">) {
  validateIllnessDates(data.startDate, data.endDate)

  await prisma.illness.create({
    data: {
      personId: data.personId,
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      notes: data.notes ?? null,
    },
  })

  revalidatePath("/illnesses")
}

export async function updateIllness(id: string, data: Partial<Omit<Illness, "id" | "personName">>) {
  if (data.startDate !== undefined || data.endDate !== undefined) {
    const existingIllness = await prisma.illness.findUnique({ where: { id } })
    if (!existingIllness) {
      throw new Error("Illness not found.")
    }

    validateIllnessDates(
      data.startDate ?? dateToStr(existingIllness.startDate),
      data.endDate ?? (existingIllness.endDate ? dateToStr(existingIllness.endDate) : undefined)
    )
  }

  await prisma.illness.update({
    where: { id },
    data: {
      ...(data.personId !== undefined && { personId: data.personId }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  })

  revalidatePath("/illnesses")
}

export async function deleteIllness(id: string) {
  await prisma.illness.delete({ where: { id } })
  revalidatePath("/illnesses")
}

// ─── Pet Management ──────────────────────────────────────────────────────

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
  }
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
  }
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
  }
}

export async function getPets(): Promise<Pet[]> {
  const rows = await prisma.pet.findMany({ orderBy: { name: "asc" } })
  return rows.map(mapPet)
}

export async function getPet(id: string): Promise<Pet | null> {
  const r = await prisma.pet.findUnique({ where: { id } })
  if (!r) return null
  return mapPet(r)
}

export async function createPet(data: Omit<Pet, "id">) {
  await prisma.pet.create({
    data: {
      name: data.name,
      species: data.species,
      breed: data.breed || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      microchipNumber: data.microchipNumber || null,
      color: data.color || null,
      photoPath: data.photoPath || null,
      dietaryNeeds: data.dietaryNeeds || null,
      medications: data.medications || null,
      notes: data.notes || null,
    },
  })
  revalidatePath("/pets")
  revalidatePath("/")
}

export async function updatePet(id: string, data: Partial<Omit<Pet, "id">>) {
  await prisma.pet.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.species !== undefined && { species: data.species }),
      ...(data.breed !== undefined && { breed: data.breed || null }),
      ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
      ...(data.microchipNumber !== undefined && { microchipNumber: data.microchipNumber || null }),
      ...(data.color !== undefined && { color: data.color || null }),
      ...(data.photoPath !== undefined && { photoPath: data.photoPath || null }),
      ...(data.dietaryNeeds !== undefined && { dietaryNeeds: data.dietaryNeeds || null }),
      ...(data.medications !== undefined && { medications: data.medications || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  })
  revalidatePath("/pets")
  revalidatePath("/")
}

export async function deletePet(id: string) {
  await prisma.pet.delete({ where: { id } })
  revalidatePath("/pets")
  revalidatePath("/")
}

// ─── Vet Records ──────────────────────────────────────────────────────────

export async function getVetRecords(petId?: string): Promise<VetRecord[]> {
  const where = petId ? { petId } : {}
  const rows = await prisma.vetRecord.findMany({
    where,
    include: { pet: true },
    orderBy: { date: "desc" },
  })
  return rows.map((r) => mapVetRecord(r, r.pet.name))
}

export async function createVetRecord(data: Omit<VetRecord, "id" | "petName">) {
  await prisma.vetRecord.create({
    data: {
      petId: data.petId,
      date: new Date(data.date),
      vetName: data.vetName,
      description: data.description,
      cost: data.cost ?? null,
      nextVisit: data.nextVisit ? new Date(data.nextVisit) : null,
      notes: data.notes || null,
    },
  })
  revalidatePath("/pets")
  revalidatePath("/")
}

export async function updateVetRecord(id: string, data: Partial<Omit<VetRecord, "id" | "petName">>) {
  await prisma.vetRecord.update({
    where: { id },
    data: {
      ...(data.petId !== undefined && { petId: data.petId }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.vetName !== undefined && { vetName: data.vetName }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.cost !== undefined && { cost: data.cost ?? null }),
      ...(data.nextVisit !== undefined && { nextVisit: data.nextVisit ? new Date(data.nextVisit) : null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  })
  revalidatePath("/pets")
  revalidatePath("/")
}

export async function deleteVetRecord(id: string) {
  await prisma.vetRecord.delete({ where: { id } })
  revalidatePath("/pets")
  revalidatePath("/")
}

// ─── Vaccinations ─────────────────────────────────────────────────────────

export async function getVaccinations(petId?: string): Promise<Vaccination[]> {
  const where = petId ? { petId } : {}
  const rows = await prisma.vaccination.findMany({
    where,
    include: { pet: true },
    orderBy: { date: "desc" },
  })
  return rows.map((r) => mapVaccination(r, r.pet.name))
}

export async function createVaccination(data: Omit<Vaccination, "id" | "petName">) {
  await prisma.vaccination.create({
    data: {
      petId: data.petId,
      name: data.name,
      date: new Date(data.date),
      nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
      vetName: data.vetName || null,
      batchNumber: data.batchNumber || null,
      notes: data.notes || null,
    },
  })
  revalidatePath("/pets")
  revalidatePath("/")
}

export async function updateVaccination(id: string, data: Partial<Omit<Vaccination, "id" | "petName">>) {
  await prisma.vaccination.update({
    where: { id },
    data: {
      ...(data.petId !== undefined && { petId: data.petId }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.nextDueDate !== undefined && { nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null }),
      ...(data.vetName !== undefined && { vetName: data.vetName || null }),
      ...(data.batchNumber !== undefined && { batchNumber: data.batchNumber || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  })
  revalidatePath("/pets")
  revalidatePath("/")
}

export async function deleteVaccination(id: string) {
  await prisma.vaccination.delete({ where: { id } })
  revalidatePath("/pets")
  revalidatePath("/")
}
