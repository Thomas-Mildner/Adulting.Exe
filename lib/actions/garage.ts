"use server";



import { writeFile, mkdir } from "fs/promises";
import { join, extname, basename } from "path";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Car, CarMaintenance, FuelEntry, TollEntry, CarDocument } from "@/lib/data";
import type {
  Car as PrismaCar,
  CarMaintenance as PrismaCarMaintenance,
  FuelEntry as PrismaFuelEntry,
  TollEntry as PrismaTollEntry,
  CarDocument as PrismaCarDocument,
} from "@prisma/client";
import { dateToStr } from "./common";

const carInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  purchaseDate: z.string(),
  purchasePrice: z.number().nonnegative(),
  nextInspection: z.string().optional(),
  currentTireType: z.string().optional(),
  tireStorageLocation: z.string().optional(),
  firstAidKitExpiry: z.string().optional(),
});

export async function getCars(): Promise<Car[]> {
  const rows = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
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
  }));
}

export async function createCar(data: {
  name: string;
  brand: string;
  model: string;
  licensePlate: string;
  purchaseDate: string;
  purchasePrice: number;
  nextInspection?: string;
  currentTireType?: string;
  tireStorageLocation?: string;
  firstAidKitExpiry?: string;
}) {
  const validated = carInputSchema.parse(data);
  const created = await prisma.car.create({
    data: {
      name: validated.name,
      brand: validated.brand,
      model: validated.model,
      licensePlate: validated.licensePlate,
      purchaseDate: new Date(validated.purchaseDate),
      purchasePrice: validated.purchasePrice,
      nextInspection: validated.nextInspection ? new Date(validated.nextInspection) : null,
      currentTireType: validated.currentTireType || "summer",
      tireStorageLocation: validated.tireStorageLocation || null,
      firstAidKitExpiry: validated.firstAidKitExpiry ? new Date(validated.firstAidKitExpiry) : null,
    },
  });
  revalidatePath("/garage");
  return created;
}

export async function updateCar(
  id: string,
  data: {
    name: string;
    brand: string;
    model: string;
    licensePlate: string;
    purchaseDate: string;
    purchasePrice: number;
    nextInspection?: string;
    currentTireType?: string;
    tireStorageLocation?: string;
    firstAidKitExpiry?: string;
  }
) {
  const updated = await prisma.car.update({
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
  });
  revalidatePath("/garage");
  return updated;
}

export async function deleteCar(id: string) {
  await prisma.car.delete({ where: { id } });
  revalidatePath("/garage");
  return { success: true };
}

// ─── Car Maintenance ────────────────────────────────────────────────────

export async function getCarMaintenance(carId: string): Promise<CarMaintenance[]> {
  const rows = await prisma.carMaintenance.findMany({
    where: { carId },
    orderBy: { date: "desc" },
  });
  return rows.map((r: PrismaCarMaintenance) => ({
    id: r.id,
    carId: r.carId,
    date: dateToStr(r.date),
    description: r.description,
    cost: r.cost,
    mileage: r.mileage ?? undefined,
    category: r.category as CarMaintenance["category"],
  }));
}

export async function createCarMaintenance(data: {
  carId: string;
  date: string;
  description: string;
  cost: number;
  mileage?: number;
  category: string;
}) {
  const created = await prisma.carMaintenance.create({
    data: {
      carId: data.carId,
      date: new Date(data.date),
      description: data.description,
      cost: data.cost,
      mileage: data.mileage || null,
      category: data.category,
    },
  });
  revalidatePath("/garage");
  return created;
}

export async function updateCarMaintenance(
  id: string,
  data: {
    date: string;
    description: string;
    cost: number;
    mileage?: number;
    category: string;
  }
) {
  const updated = await prisma.carMaintenance.update({
    where: { id },
    data: {
      date: new Date(data.date),
      description: data.description,
      cost: data.cost,
      mileage: data.mileage || null,
      category: data.category,
    },
  });
  revalidatePath("/garage");
  return updated;
}

export async function deleteCarMaintenance(id: string) {
  await prisma.carMaintenance.delete({ where: { id } });
  revalidatePath("/garage");
  return { success: true };
}

// ─── Fuel Entries ───────────────────────────────────────────────────────

export async function getFuelEntries(carId: string): Promise<FuelEntry[]> {
  const rows = await prisma.fuelEntry.findMany({
    where: { carId },
    orderBy: { date: "desc" },
  });
  return rows.map((r: PrismaFuelEntry) => ({
    id: r.id,
    carId: r.carId,
    date: dateToStr(r.date),
    liters: r.liters,
    pricePerLiter: r.pricePerLiter,
    totalCost: r.totalCost,
    mileage: r.mileage,
    fuelType: r.fuelType as FuelEntry["fuelType"],
  }));
}

export async function createFuelEntry(data: {
  carId: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  mileage: number | null;
  fuelType: string;
}) {
  const created = await prisma.fuelEntry.create({
    data: {
      carId: data.carId,
      date: new Date(data.date),
      liters: data.liters,
      pricePerLiter: data.pricePerLiter,
      totalCost: data.totalCost,
      mileage: data.mileage,
      fuelType: data.fuelType,
    },
  });
  revalidatePath("/garage");
  return created;
}

export async function updateFuelEntry(
  id: string,
  data: {
    date: string;
    liters: number;
    pricePerLiter: number;
    totalCost: number;
    mileage: number | null;
    fuelType: string;
  }
) {
  const updated = await prisma.fuelEntry.update({
    where: { id },
    data: {
      date: new Date(data.date),
      liters: data.liters,
      pricePerLiter: data.pricePerLiter,
      totalCost: data.totalCost,
      mileage: data.mileage,
      fuelType: data.fuelType,
    },
  });
  revalidatePath("/garage");
  return updated;
}

export async function deleteFuelEntry(id: string) {
  await prisma.fuelEntry.delete({ where: { id } });
  revalidatePath("/garage");
  return { success: true };
}

// ─── Toll Entries ───────────────────────────────────────────────────────

export async function getTollEntries(carId: string): Promise<TollEntry[]> {
  const rows = await prisma.tollEntry.findMany({
    where: { carId },
    orderBy: { date: "desc" },
  });
  return rows.map((r: PrismaTollEntry) => ({
    id: r.id,
    carId: r.carId,
    date: dateToStr(r.date),
    cost: r.cost,
    route: r.route ?? undefined,
    country: r.country ?? undefined,
  }));
}

export async function createTollEntry(data: {
  carId: string;
  date: string;
  cost: number;
  route?: string;
  country?: string;
}) {
  const created = await prisma.tollEntry.create({
    data: {
      carId: data.carId,
      date: new Date(data.date),
      cost: data.cost,
      route: data.route || null,
      country: data.country || null,
    },
  });
  revalidatePath("/garage");
  return created;
}

export async function updateTollEntry(
  id: string,
  data: {
    date: string;
    cost: number;
    route?: string;
    country?: string;
  }
) {
  const updated = await prisma.tollEntry.update({
    where: { id },
    data: {
      date: new Date(data.date),
      cost: data.cost,
      route: data.route || null,
      country: data.country || null,
    },
  });
  revalidatePath("/garage");
  return updated;
}

export async function deleteTollEntry(id: string) {
  await prisma.tollEntry.delete({ where: { id } });
  revalidatePath("/garage");
  return { success: true };
}

// ─── Car Documents ──────────────────────────────────────────────────────

export async function getCarDocuments(carId: string): Promise<CarDocument[]> {
  const rows = await prisma.carDocument.findMany({
    where: { carId },
    orderBy: { uploadDate: "desc" },
  });
  return rows.map((r: PrismaCarDocument) => ({
    id: r.id,
    carId: r.carId,
    title: r.title,
    category: r.category as CarDocument["category"],
    fileName: r.fileName,
    uploadDate: dateToStr(r.uploadDate),
  }));
}

export async function createCarDocument(data: {
  carId: string;
  title: string;
  category: string;
  fileName: string;
}) {
  const created = await prisma.carDocument.create({
    data: {
      carId: data.carId,
      title: data.title,
      category: data.category,
      fileName: data.fileName,
    },
  });
  revalidatePath("/garage");
  return created;
}

export async function deleteCarDocument(id: string) {
  await prisma.carDocument.delete({ where: { id } });
  revalidatePath("/garage");
  return { success: true };
}

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_UPLOAD_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"]);

export async function uploadCarDocument(formData: FormData) {
  const file = formData.get("file") as File | null;
  const carId = formData.get("carId") as string | null;
  const title = (formData.get("title") as string | null) || "";
  const category = (formData.get("category") as string | null) || "other";

  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("No file uploaded");
  }
  if (!carId) {
    throw new Error("Car ID is required");
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("File too large. Maximum size is 10 MB.");
  }

  const rawExt = extname(file.name).toLowerCase();
  if (!ALLOWED_UPLOAD_EXTENSIONS.has(rawExt)) {
    throw new Error("Invalid file type. Only images (JPEG, PNG, WebP, GIF) and PDFs are allowed.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const sanitizedBase = basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
  const uniqueFileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizedBase || "doc"}${rawExt}`;

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const destinationPath = join(uploadDir, uniqueFileName);

  await writeFile(destinationPath, buffer);

  const doc = await prisma.carDocument.create({
    data: {
      carId,
      title: title || sanitizedBase || "Car Document",
      category,
      fileName: uniqueFileName,
      uploadDate: new Date(),
    },
  });
  revalidatePath("/garage");
  return { success: true, data: doc };
}

