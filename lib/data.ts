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
  receiptPath?: string
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

export type Insurance = {
  id: string
  providerName: string
  policyType: "Home Contents" | "Residential Building" | "Private Liability" | "Legal Protection" | "Life Insurance" | "Disability" | "Pet Insurance" | "Car Insurance" | "Custom"
  customPolicyType?: string
  policyNumber: string
  premiumAmount: number
  paymentFrequency: "Monthly" | "Quarterly" | "Annually"
  deductible: number
  startDate: string
  endDate?: string
  cancellationDeadline: string
  documentPath?: string
  claimsHotline: string
  agentEmail: string
  beneficiary?: string
  notes?: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: "warning" | "info" | "error"
  category: "Waste" | "Appliance" | "Maintenance" | "Lent" | "Insurance" | "Contract"
  link?: string
  date?: string
}

export type Contract = {
  id: string
  providerName: string
  accountId?: string
  monthlyCost: number
  yearlyCost?: number
  category: "Utilities" | "Entertainment" | "Fitness" | "Software" | "Guilty Pleasure" | "Other"
  lastUsedDate?: string
  isTrial: boolean
  trialEndDate?: string
  nextBillingDate: string
  notes?: string
}

export type Person = {
  id: string
  name: string
  relation: "Self" | "Spouse" | "Child" | "Other"
}

export type IdentityDocument = {
  id: string
  personId: string
  personName?: string
  documentType: "ID" | "Passport" | "Driver's License" | "Visa" | "Other"
  customDocumentType?: string
  documentNumber: string
  issueDate: string
  expiryDate: string
  photoFrontPath?: string
  photoBackPath?: string
  physicalLocation?: string
  lostFoundGuide?: string
  emergencyContact?: string
  notes?: string
}

export type PackageReturn = {
  id: string
  trackingId: string
  carrier: string
  targetVendor: string
  status: string
  amountExpected: number
  refundReceived: boolean
  dateSent: string
  returnWindow: string
  receiptPhoto?: string
  updatedAt: string
}

export type Pet = {
  id: string
  name: string
  species: "Dog" | "Cat" | "Bird" | "Rabbit" | "Fish" | "Other"
  breed?: string
  dateOfBirth?: string
  microchipNumber?: string
  color?: string
  photoPath?: string
  dietaryNeeds?: string
  medications?: string
  notes?: string
}

export type VetRecord = {
  id: string
  petId: string
  petName?: string
  date: string
  vetName: string
  description: string
  cost?: number
  nextVisit?: string
  notes?: string
}

export type Vaccination = {
  id: string
  petId: string
  petName?: string
  name: string
  date: string
  nextDueDate?: string
  vetName?: string
  batchNumber?: string
  notes?: string
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

export function getDocumentStatus(expiryDate: string): "valid" | "expiring-soon" | "expired" {
  const daysRemaining = getDaysRemaining(expiryDate)
  if (daysRemaining < 0) return "expired"
  if (daysRemaining < 180) return "expiring-soon" // Less than 6 months
  return "valid"
}

export function getDocumentStatusColor(status: "valid" | "expiring-soon" | "expired"): string {
  switch (status) {
    case "valid": return "green"
    case "expiring-soon": return "yellow"
    case "expired": return "red"
  }
}

export function getDocumentStatusLabel(status: "valid" | "expiring-soon" | "expired"): string {
  switch (status) {
    case "valid": return "Model Citizen"
    case "expiring-soon": return "Bureaucratic Anxiety"
    case "expired": return "International Fugitive"
  }
}

