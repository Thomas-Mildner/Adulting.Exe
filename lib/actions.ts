"use server"

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
  }))
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
