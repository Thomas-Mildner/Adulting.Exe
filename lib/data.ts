// ─── Types ──────────────────────────────────────────────────────────────

export type Appliance = {
  id: string
  name: string
  category: string
  purchaseDate: string
  warrantyEnd: string
  boxLocation: string
  status: "protected" | "solo" | "zombie"
  brand: string
  price: number
}

export type ServiceHistory = {
  date: string
  description: string
  cost: number
  taxRelevant: boolean
  invoiceId?: string
}

export type ServiceProvider = {
  id: string
  name: string
  specialty: string
  phone: string
  email: string
  website?: string
  rating: number
  history: ServiceHistory[]
}

export type Invoice = {
  id: string
  providerId: string
  providerName: string
  date: string
  description: string
  amount: number
  taxRelevant: boolean
  fileName: string
}

export type Document = {
  id: string
  title: string
  category: "Heating" | "Plumbing" | "Smart Home" | "Structural" | "General"
  type: "pdf" | "markdown"
  updatedAt: string
  description: string
  content?: string
}

export type MaintenanceTask = {
  id: string
  title: string
  dueDate: string
  recurring: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

export type LentItem = {
  id: string
  item: string
  borrower: string
  lentDate: string
  expectedReturn: string
  trustLevel: 1 | 2 | 3 | 4 | 5
}

export type MeterReading = {
  month: string
  power: number
  water: number
  heating: number
  powerCost: number
  waterCost: number
  heatingCost: number
}

export type WishlistProject = {
  id: string
  title: string
  description: string
  estimatedCost: number
  currentSavings: number
  urgency: "nice-to-have" | "should-do" | "need-soon" | "falling-apart"
  category: string
}

export type WasteType = {
  id: string
  name: string
  color: string
  icon: string
}

export type WastePickup = {
  id: string
  date: string
  wasteTypeId: string
  wasteType?: WasteType
}

export type Car = {
  id: string
  name: string
  brand: string
  model: string
  licensePlate: string
  purchaseDate: string
  purchasePrice: number
  nextInspection?: string
  currentTireType: "summer" | "winter"
  tireStorageLocation?: string
  firstAidKitExpiry?: string
}

export type CarMaintenance = {
  id: string
  carId: string
  date: string
  description: string
  cost: number
  mileage?: number
  category: "oil_change" | "repair" | "inspection" | "parts" | "other"
}

export type FuelEntry = {
  id: string
  carId: string
  date: string
  liters: number
  pricePerLiter: number
  totalCost: number
  mileage: number
  fuelType: "diesel" | "petrol" | "e10" | "electric"
}

export type TollEntry = {
  id: string
  carId: string
  date: string
  cost: number
  route?: string
  country?: string
}

export type CarDocument = {
  id: string
  carId: string
  title: string
  category: "registration" | "insurance" | "invoice" | "other"
  fileName: string
  uploadDate: string
}

// ─── Note ────────────────────────────────────────────────────────────────
// Mock data has been moved to the database. Use server actions from
// "@/lib/actions" to fetch / mutate data. Seed with `pnpm prisma db seed`.

// ─── Utility functions ──────────────────────────────────────────────────

export function getDaysRemaining(dateStr: string): number {
  return Math.ceil(
    (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
}

export function getWarrantyPercent(purchase: string, expiry: string): number {
  const total = new Date(expiry).getTime() - new Date(purchase).getTime()
  const elapsed = new Date().getTime() - new Date(purchase).getTime()
  return Math.max(0, Math.min(100, 100 - (elapsed / total) * 100))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
}


