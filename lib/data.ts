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

// ─── Mock Data ──────────────────────────────────────────────────────────

export const appliances: Appliance[] = [
  {
    id: "1",
    name: "Samsung Refrigerator RT38",
    category: "Kitchen",
    purchaseDate: "2023-03-15",
    warrantyEnd: "2026-03-15",
    boxLocation: "Basement, Shelf 3",
    status: "protected",
    brand: "Samsung",
    price: 899,
  },
  {
    id: "2",
    name: "Bosch Serie 6 Dishwasher",
    category: "Kitchen",
    purchaseDate: "2022-08-20",
    warrantyEnd: "2025-08-20",
    boxLocation: "Basement, Shelf 2",
    status: "protected",
    brand: "Bosch",
    price: 749,
  },
  {
    id: "3",
    name: "Miele W1 Washing Machine",
    category: "Laundry",
    purchaseDate: "2021-01-10",
    warrantyEnd: "2024-01-10",
    boxLocation: "Garage, Shelf 2",
    status: "zombie",
    brand: "Miele",
    price: 1299,
  },
  {
    id: "4",
    name: "Dyson V15 Detect",
    category: "Cleaning",
    purchaseDate: "2024-06-01",
    warrantyEnd: "2027-06-01",
    boxLocation: "Utility Closet",
    status: "protected",
    brand: "Dyson",
    price: 649,
  },
  {
    id: "5",
    name: "Siemens iQ700 Oven",
    category: "Kitchen",
    purchaseDate: "2020-11-25",
    warrantyEnd: "2023-11-25",
    boxLocation: "Basement, Shelf 1",
    status: "zombie",
    brand: "Siemens",
    price: 1199,
  },
  {
    id: "6",
    name: "LG Artcool Gallery AC",
    category: "Climate",
    purchaseDate: "2024-04-12",
    warrantyEnd: "2027-04-12",
    boxLocation: "Attic Storage, Box A",
    status: "protected",
    brand: "LG",
    price: 1450,
  },
  {
    id: "7",
    name: "Philips 3200 LatteGo",
    category: "Kitchen",
    purchaseDate: "2023-12-24",
    warrantyEnd: "2025-12-24",
    boxLocation: "Kitchen, Top Drawer",
    status: "protected",
    brand: "Philips",
    price: 579,
  },
  {
    id: "8",
    name: "Bosch Serie 4 Dryer",
    category: "Laundry",
    purchaseDate: "2021-01-10",
    warrantyEnd: "2024-01-10",
    boxLocation: "Garage, Shelf 2",
    status: "zombie",
    brand: "Bosch",
    price: 599,
  },
  {
    id: "9",
    name: "Sonos Arc Soundbar",
    category: "Entertainment",
    purchaseDate: "2025-01-05",
    warrantyEnd: "2028-01-05",
    boxLocation: "Living Room Shelf",
    status: "protected",
    brand: "Sonos",
    price: 899,
  },
  {
    id: "10",
    name: "Gardena Sileno Mower",
    category: "Garden",
    purchaseDate: "2024-03-20",
    warrantyEnd: "2026-09-20",
    boxLocation: "Shed",
    status: "solo",
    brand: "Gardena",
    price: 1099,
  },
]

export const serviceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Hans Mueller",
    specialty: "Klempner",
    phone: "+49 176 1234 5678",
    email: "hans.mueller@email.de",
    rating: 5,
    history: [
      { date: "2024-11-03", description: "Kuechenspuele-Leck repariert", cost: 180, taxRelevant: true, invoiceId: "inv-1" },
      { date: "2024-06-15", description: "Neuen Badezimmer-Wasserhahn installiert", cost: 320, taxRelevant: true, invoiceId: "inv-2" },
      { date: "2023-12-10", description: "Jaehrliche Rohrleitungs-Inspektion", cost: 120, taxRelevant: true },
    ],
  },
  {
    id: "2",
    name: "Klaus Weber",
    specialty: "Elektriker",
    phone: "+49 176 2345 6789",
    email: "klaus.weber@email.de",
    rating: 4,
    history: [
      { date: "2025-01-10", description: "Garagen-Steckdosen neu verkabelt", cost: 450, taxRelevant: true, invoiceId: "inv-3" },
      { date: "2024-08-22", description: "Smarte Lichtschalter installiert", cost: 280, taxRelevant: false },
    ],
  },
  {
    id: "3",
    name: "Anna Schmidt",
    specialty: "Heizungstechnikerin",
    phone: "+49 176 3456 7890",
    email: "anna.schmidt@email.de",
    rating: 5,
    history: [
      { date: "2025-02-01", description: "Jaehrliche Heizungswartung", cost: 250, taxRelevant: true, invoiceId: "inv-4" },
      { date: "2024-02-15", description: "Thermostat-Sensor ausgetauscht", cost: 165, taxRelevant: true },
    ],
  },
  {
    id: "4",
    name: "Peter Braun",
    specialty: "Schlosser",
    phone: "+49 176 4567 8901",
    email: "peter.braun@email.de",
    rating: 4,
    history: [
      { date: "2024-09-14", description: "Haustuer-Schloss ausgetauscht", cost: 380, taxRelevant: true, invoiceId: "inv-5" },
    ],
  },
  {
    id: "5",
    name: "Maria Fischer",
    specialty: "Malerin",
    phone: "+49 176 5678 9012",
    email: "maria.fischer@email.de",
    rating: 5,
    history: [
      { date: "2024-07-20", description: "Wohnzimmer & Flur gestrichen", cost: 1200, taxRelevant: true, invoiceId: "inv-6" },
      { date: "2024-03-05", description: "Fensterrahmen nachgebessert", cost: 350, taxRelevant: true },
    ],
  },
]

export const invoices: Invoice[] = [
  { id: "inv-1", providerId: "1", providerName: "Hans Mueller", date: "2024-11-03", description: "Kuechenspuele-Reparatur", amount: 180, taxRelevant: true, fileName: "rechnung-mueller-2024-11.pdf" },
  { id: "inv-2", providerId: "1", providerName: "Hans Mueller", date: "2024-06-15", description: "Badezimmer-Armatur-Installation", amount: 320, taxRelevant: true, fileName: "rechnung-mueller-2024-06.pdf" },
  { id: "inv-3", providerId: "2", providerName: "Klaus Weber", date: "2025-01-10", description: "Garagen-Steckdosen-Neuverkabelung", amount: 450, taxRelevant: true, fileName: "rechnung-weber-2025-01.pdf" },
  { id: "inv-4", providerId: "3", providerName: "Anna Schmidt", date: "2025-02-01", description: "Jaehrliche Heizungswartung", amount: 250, taxRelevant: true, fileName: "rechnung-schmidt-2025-02.pdf" },
  { id: "inv-5", providerId: "4", providerName: "Peter Braun", date: "2024-09-14", description: "Haustuer-Schloss-Austausch", amount: 380, taxRelevant: true, fileName: "rechnung-braun-2024-09.pdf" },
  { id: "inv-6", providerId: "5", providerName: "Maria Fischer", date: "2024-07-20", description: "Innenanstrich", amount: 1200, taxRelevant: true, fileName: "rechnung-fischer-2024-07.pdf" },
]

export const documents: Document[] = [
  {
    id: "1",
    title: "Heizkessel zuruecksetzen",
    category: "Heating",
    type: "markdown",
    updatedAt: "2025-01-20",
    description: "Schritt-fuer-Schritt Viessmann-Heizkessel-Reset. Weil er um 2 Uhr morgens im Januar ausfallen wird.",
    content: "# Heizkessel-Reset-Anleitung\n\n1. Roten Reset-Knopf finden\n2. 3 Sekunden gedrueckt halten\n3. Auf das Flammen-Symbol warten\n4. Beten.",
  },
  {
    id: "2",
    title: "Smart Home Hub Konfiguration",
    category: "Smart Home",
    type: "markdown",
    updatedAt: "2025-01-30",
    description: "Homematic IP Einrichtungsanleitung. Fuer wenn du willst, dass deine Lichter mit dem Thermostat streiten.",
  },
  {
    id: "3",
    title: "Wasserenthaerter-Handbuch",
    category: "Plumbing",
    type: "pdf",
    updatedAt: "2024-08-05",
    description: "BWT Perla Installations- & Salz-Nachfuellanleitung. Ja, es braucht Salz. Nein, nicht das zum Kochen.",
  },
  {
    id: "4",
    title: "Sicherungskasten-Plan",
    category: "Structural",
    type: "pdf",
    updatedAt: "2024-05-12",
    description: "Sicherungszuordnungen. Den falschen umlegen und das WLAN ist weg.",
  },
  {
    id: "5",
    title: "Thermostat-Programmierung",
    category: "Heating",
    type: "markdown",
    updatedAt: "2025-02-01",
    description: "Heizplan-Einrichtung. Der ewige Kampf zwischen Komfort und Gasrechnung.",
  },
  {
    id: "6",
    title: "Gartenbewaesserungs-Plan",
    category: "Plumbing",
    type: "pdf",
    updatedAt: "2024-04-18",
    description: "Sprinklerzonen und Programmierung. Dein Rasen verlangt nach Wasser.",
  },
  {
    id: "7",
    title: "WLAN-Mesh-Netzwerk-Plan",
    category: "Smart Home",
    type: "markdown",
    updatedAt: "2025-01-30",
    description: "Netzwerktopologie und IP-Zuweisungen. Der Router steht immer am falschen Platz.",
  },
  {
    id: "8",
    title: "Notabschaltungs-Anleitung",
    category: "Structural",
    type: "pdf",
    updatedAt: "2024-12-01",
    description: "Wasser-, Gas- und Strom-Hauptschalter. Praege dir diese ein, bevor die Katastrophe kommt.",
  },
]

export const maintenanceTasks: MaintenanceTask[] = [
  { id: "1", title: "HVAC-Filter wechseln", dueDate: "2026-03-01", recurring: "Alle 3 Monate", priority: "high", completed: false },
  { id: "2", title: "Rauchmelder testen", dueDate: "2026-02-15", recurring: "Alle 6 Monate", priority: "high", completed: false },
  { id: "3", title: "Dachrinnen reinigen", dueDate: "2026-04-01", recurring: "Alle 6 Monate", priority: "medium", completed: false },
  { id: "4", title: "Kaffeemaschine entkalken", dueDate: "2026-02-20", recurring: "Alle 2 Monate", priority: "low", completed: false },
  { id: "5", title: "Heizung warten lassen", dueDate: "2026-09-01", recurring: "Jaehrlich", priority: "high", completed: false },
  { id: "6", title: "Wasserenthaerter-Salz nachfuellen", dueDate: "2026-02-28", recurring: "Monatlich", priority: "medium", completed: true },
  { id: "7", title: "Dachziegel ueberpruefen", dueDate: "2026-05-15", recurring: "Jaehrlich", priority: "medium", completed: false },
]

export const lentItems: LentItem[] = [
  { id: "1", item: "Power Drill (Makita)", borrower: "Max", lentDate: "2026-01-28", expectedReturn: "2026-02-14", trustLevel: 4 },
  { id: "2", item: "Pressure Washer", borrower: "Thomas", lentDate: "2026-02-01", expectedReturn: "2026-02-15", trustLevel: 3 },
  { id: "3", item: "3m Ladder", borrower: "Julia", lentDate: "2026-02-05", expectedReturn: "2026-02-12", trustLevel: 5 },
  { id: "4", item: "Circular Saw", borrower: "Stefan", lentDate: "2026-01-15", expectedReturn: "2026-02-01", trustLevel: 2 },
]

export const meterHistory: MeterReading[] = [
  { month: "Sep 2025", power: 285, water: 11.2, heating: 45 },
  { month: "Oct 2025", power: 310, water: 10.8, heating: 120 },
  { month: "Nov 2025", power: 340, water: 10.5, heating: 280 },
  { month: "Dec 2025", power: 380, water: 11.0, heating: 350 },
  { month: "Jan 2026", power: 365, water: 10.9, heating: 320 },
  { month: "Feb 2026", power: 345, water: 10.6, heating: 290 },
]

export const wishlistProjects: WishlistProject[] = [
  { id: "1", title: "Neue Terrasse", description: "WPC-Terrasse fuer den Garten. Endlich grillen ohne Splitter.", estimatedCost: 8500, currentSavings: 3200, urgency: "nice-to-have", category: "Outdoor" },
  { id: "2", title: "Solaranlage", description: "6kWp Dachanlage. Weil die Sonne gratis ist und die Stromrechnung nicht.", estimatedCost: 14000, currentSavings: 6800, urgency: "should-do", category: "Energie" },
  { id: "3", title: "Badezimmer-Renovierung", description: "Die Fliesen sind aus den 80ern und sehen auch so aus.", estimatedCost: 12000, currentSavings: 9500, urgency: "need-soon", category: "Innenraum" },
  { id: "4", title: "Dachdaemmung", description: "Aktuelle Daemmung von 1995. Die Waerme fluechtet wie Miete faellig ist.", estimatedCost: 6000, currentSavings: 1500, urgency: "falling-apart", category: "Struktur" },
  { id: "5", title: "Smart-Lock-System", description: "Schluesselloser Zugang. Eine Sache weniger zum Vergessen.", estimatedCost: 800, currentSavings: 400, urgency: "nice-to-have", category: "Smart Home" },
]

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

export function getTotalTaxDeductible(): number {
  return invoices.filter((i) => i.taxRelevant).reduce((sum, i) => sum + i.amount, 0)
}
