import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean existing data
  await prisma.serviceHistory.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.serviceProvider.deleteMany()
  await prisma.appliance.deleteMany()
  await prisma.document.deleteMany()
  await prisma.maintenanceTask.deleteMany()
  await prisma.lentItem.deleteMany()
  await prisma.meterReading.deleteMany()
  await prisma.wishlistProject.deleteMany()
  await prisma.wastePickup.deleteMany()
  await prisma.wasteType.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.insurance.deleteMany()
  await prisma.identityDocument.deleteMany()
  await prisma.person.deleteMany()

  // ─── Appliances ─────────────────────────────────────────────────────────
  await prisma.appliance.createMany({
    data: [
      { id: "app-1", name: "Samsung Refrigerator RT38", category: "Kitchen", purchaseDate: new Date("2023-03-15"), warrantyEnd: new Date("2026-03-15"), boxLocation: "Basement, Shelf 3", status: "protected", brand: "Samsung", price: 899 },
      { id: "app-2", name: "Bosch Serie 6 Dishwasher", category: "Kitchen", purchaseDate: new Date("2022-08-20"), warrantyEnd: new Date("2025-08-20"), boxLocation: "Basement, Shelf 2", status: "protected", brand: "Bosch", price: 749 },
      { id: "app-3", name: "Miele W1 Washing Machine", category: "Laundry", purchaseDate: new Date("2021-01-10"), warrantyEnd: new Date("2024-01-10"), boxLocation: "Garage, Shelf 2", status: "zombie", brand: "Miele", price: 1299 },
      { id: "app-4", name: "Dyson V15 Detect", category: "Cleaning", purchaseDate: new Date("2024-06-01"), warrantyEnd: new Date("2027-06-01"), boxLocation: "Utility Closet", status: "protected", brand: "Dyson", price: 649 },
      { id: "app-5", name: "Siemens iQ700 Oven", category: "Kitchen", purchaseDate: new Date("2020-11-25"), warrantyEnd: new Date("2023-11-25"), boxLocation: "Basement, Shelf 1", status: "zombie", brand: "Siemens", price: 1199 },
      { id: "app-6", name: "LG Artcool Gallery AC", category: "Climate", purchaseDate: new Date("2024-04-12"), warrantyEnd: new Date("2027-04-12"), boxLocation: "Attic Storage, Box A", status: "protected", brand: "LG", price: 1450 },
      { id: "app-7", name: "Philips 3200 LatteGo", category: "Kitchen", purchaseDate: new Date("2023-12-24"), warrantyEnd: new Date("2025-12-24"), boxLocation: "Kitchen, Top Drawer", status: "protected", brand: "Philips", price: 579 },
      { id: "app-8", name: "Bosch Serie 4 Dryer", category: "Laundry", purchaseDate: new Date("2021-01-10"), warrantyEnd: new Date("2024-01-10"), boxLocation: "Garage, Shelf 2", status: "zombie", brand: "Bosch", price: 599 },
      { id: "app-9", name: "Sonos Arc Soundbar", category: "Entertainment", purchaseDate: new Date("2025-01-05"), warrantyEnd: new Date("2028-01-05"), boxLocation: "Living Room Shelf", status: "protected", brand: "Sonos", price: 899 },
      { id: "app-10", name: "Gardena Sileno Mower", category: "Garden", purchaseDate: new Date("2024-03-20"), warrantyEnd: new Date("2026-09-20"), boxLocation: "Shed", status: "solo", brand: "Gardena", price: 1099 },
    ],
  })
  console.log("  ✅ Appliances seeded")

  // ─── Service Providers (with nested history) ────────────────────────────

  await prisma.serviceProvider.create({
    data: {
      id: "sp-1", name: "Hans Mueller", specialty: "Klempner", phone: "+49 176 1234 5678", email: "hans.mueller@email.de", rating: 5,
      history: {
        create: [
          { id: "sh-1", date: new Date("2024-11-03"), description: "Kuechenspuele-Leck repariert", cost: 180, taxRelevant: true, invoiceId: "inv-1" },
          { id: "sh-2", date: new Date("2024-06-15"), description: "Neuen Badezimmer-Wasserhahn installiert", cost: 320, taxRelevant: true, invoiceId: "inv-2" },
          { id: "sh-3", date: new Date("2023-12-10"), description: "Jaehrliche Rohrleitungs-Inspektion", cost: 120, taxRelevant: true },
        ],
      },
    },
  })
  await prisma.serviceProvider.create({
    data: {
      id: "sp-2", name: "Klaus Weber", specialty: "Elektriker", phone: "+49 176 2345 6789", email: "klaus.weber@email.de", rating: 4,
      history: {
        create: [
          { id: "sh-4", date: new Date("2025-01-10"), description: "Garagen-Steckdosen neu verkabelt", cost: 450, taxRelevant: true, invoiceId: "inv-3" },
          { id: "sh-5", date: new Date("2024-08-22"), description: "Smarte Lichtschalter installiert", cost: 280, taxRelevant: false },
        ],
      },
    },
  })
  await prisma.serviceProvider.create({
    data: {
      id: "sp-3", name: "Anna Schmidt", specialty: "Heizungstechnikerin", phone: "+49 176 3456 7890", email: "anna.schmidt@email.de", rating: 5,
      history: {
        create: [
          { id: "sh-6", date: new Date("2025-02-01"), description: "Jaehrliche Heizungswartung", cost: 250, taxRelevant: true, invoiceId: "inv-4" },
          { id: "sh-7", date: new Date("2024-02-15"), description: "Thermostat-Sensor ausgetauscht", cost: 165, taxRelevant: true },
        ],
      },
    },
  })
  await prisma.serviceProvider.create({
    data: {
      id: "sp-4", name: "Peter Braun", specialty: "Schlosser", phone: "+49 176 4567 8901", email: "peter.braun@email.de", rating: 4,
      history: {
        create: [
          { id: "sh-8", date: new Date("2024-09-14"), description: "Haustuer-Schloss ausgetauscht", cost: 380, taxRelevant: true, invoiceId: "inv-5" },
        ],
      },
    },
  })
  await prisma.serviceProvider.create({
    data: {
      id: "sp-5", name: "Maria Fischer", specialty: "Malerin", phone: "+49 176 5678 9012", email: "maria.fischer@email.de", rating: 5,
      history: {
        create: [
          { id: "sh-9", date: new Date("2024-07-20"), description: "Wohnzimmer & Flur gestrichen", cost: 1200, taxRelevant: true, invoiceId: "inv-6" },
          { id: "sh-10", date: new Date("2024-03-05"), description: "Fensterrahmen nachgebessert", cost: 350, taxRelevant: true },
        ],
      },
    },
  })
  console.log("  ✅ Service providers seeded")

  // ─── Invoices ───────────────────────────────────────────────────────────
  await prisma.invoice.createMany({
    data: [
      { id: "inv-1", providerId: "sp-1", providerName: "Hans Mueller", date: new Date("2024-11-03"), description: "Kuechenspuele-Reparatur", amount: 180, taxRelevant: true, fileName: "rechnung-mueller-2024-11.pdf" },
      { id: "inv-2", providerId: "sp-1", providerName: "Hans Mueller", date: new Date("2024-06-15"), description: "Badezimmer-Armatur-Installation", amount: 320, taxRelevant: true, fileName: "rechnung-mueller-2024-06.pdf" },
      { id: "inv-3", providerId: "sp-2", providerName: "Klaus Weber", date: new Date("2025-01-10"), description: "Garagen-Steckdosen-Neuverkabelung", amount: 450, taxRelevant: true, fileName: "rechnung-weber-2025-01.pdf" },
      { id: "inv-4", providerId: "sp-3", providerName: "Anna Schmidt", date: new Date("2025-02-01"), description: "Jaehrliche Heizungswartung", amount: 250, taxRelevant: true, fileName: "rechnung-schmidt-2025-02.pdf" },
      { id: "inv-5", providerId: "sp-4", providerName: "Peter Braun", date: new Date("2024-09-14"), description: "Haustuer-Schloss-Austausch", amount: 380, taxRelevant: true, fileName: "rechnung-braun-2024-09.pdf" },
      { id: "inv-6", providerId: "sp-5", providerName: "Maria Fischer", date: new Date("2024-07-20"), description: "Innenanstrich", amount: 1200, taxRelevant: true, fileName: "rechnung-fischer-2024-07.pdf" },
    ],
  })
  console.log("  ✅ Invoices seeded")

  // ─── Documents ──────────────────────────────────────────────────────────
  await prisma.document.createMany({
    data: [
      { id: "doc-1", title: "Heizkessel zuruecksetzen", category: "Heating", type: "markdown", description: "Schritt-fuer-Schritt Viessmann-Heizkessel-Reset. Weil er um 2 Uhr morgens im Januar ausfallen wird.", content: "# Heizkessel-Reset-Anleitung\n\n1. Roten Reset-Knopf finden\n2. 3 Sekunden gedrueckt halten\n3. Auf das Flammen-Symbol warten\n4. Beten." },
      { id: "doc-2", title: "Smart Home Hub Konfiguration", category: "Smart Home", type: "markdown", description: "Homematic IP Einrichtungsanleitung. Fuer wenn du willst, dass deine Lichter mit dem Thermostat streiten." },
      { id: "doc-3", title: "Wasserenthaerter-Handbuch", category: "Plumbing", type: "pdf", description: "BWT Perla Installations- & Salz-Nachfuellanleitung. Ja, es braucht Salz. Nein, nicht das zum Kochen." },
      { id: "doc-4", title: "Sicherungskasten-Plan", category: "Structural", type: "pdf", description: "Sicherungszuordnungen. Den falschen umlegen und das WLAN ist weg." },
      { id: "doc-5", title: "Thermostat-Programmierung", category: "Heating", type: "markdown", description: "Heizplan-Einrichtung. Der ewige Kampf zwischen Komfort und Gasrechnung." },
      { id: "doc-6", title: "Gartenbewaesserungs-Plan", category: "Plumbing", type: "pdf", description: "Sprinklerzonen und Programmierung. Dein Rasen verlangt nach Wasser." },
      { id: "doc-7", title: "WLAN-Mesh-Netzwerk-Plan", category: "Smart Home", type: "markdown", description: "Netzwerktopologie und IP-Zuweisungen. Der Router steht immer am falschen Platz." },
      { id: "doc-8", title: "Notabschaltungs-Anleitung", category: "Structural", type: "pdf", description: "Wasser-, Gas- und Strom-Hauptschalter. Praege dir diese ein, bevor die Katastrophe kommt." },
    ],
  })
  console.log("  ✅ Documents seeded")

  // ─── Maintenance Tasks ──────────────────────────────────────────────────
  await prisma.maintenanceTask.createMany({
    data: [
      { id: "mt-1", title: "HVAC-Filter wechseln", dueDate: new Date("2026-03-01"), recurring: "Alle 3 Monate", priority: "high", completed: false },
      { id: "mt-2", title: "Rauchmelder testen", dueDate: new Date("2026-02-15"), recurring: "Alle 6 Monate", priority: "high", completed: false },
      { id: "mt-3", title: "Dachrinnen reinigen", dueDate: new Date("2026-04-01"), recurring: "Alle 6 Monate", priority: "medium", completed: false },
      { id: "mt-4", title: "Kaffeemaschine entkalken", dueDate: new Date("2026-02-20"), recurring: "Alle 2 Monate", priority: "low", completed: false },
      { id: "mt-5", title: "Heizung warten lassen", dueDate: new Date("2026-09-01"), recurring: "Jaehrlich", priority: "high", completed: false },
      { id: "mt-6", title: "Wasserenthaerter-Salz nachfuellen", dueDate: new Date("2026-02-28"), recurring: "Monatlich", priority: "medium", completed: true },
      { id: "mt-7", title: "Dachziegel ueberpruefen", dueDate: new Date("2026-05-15"), recurring: "Jaehrlich", priority: "medium", completed: false },
    ],
  })
  console.log("  ✅ Maintenance tasks seeded")

  // ─── Lent Items ─────────────────────────────────────────────────────────
  await prisma.lentItem.createMany({
    data: [
      { id: "li-1", item: "Power Drill (Makita)", borrower: "Max", lentDate: new Date("2026-01-28"), expectedReturn: new Date("2026-02-14"), trustLevel: 4 },
      { id: "li-2", item: "Pressure Washer", borrower: "Thomas", lentDate: new Date("2026-02-01"), expectedReturn: new Date("2026-02-15"), trustLevel: 3 },
      { id: "li-3", item: "3m Ladder", borrower: "Julia", lentDate: new Date("2026-02-05"), expectedReturn: new Date("2026-02-12"), trustLevel: 5 },
      { id: "li-4", item: "Circular Saw", borrower: "Stefan", lentDate: new Date("2026-01-15"), expectedReturn: new Date("2026-02-01"), trustLevel: 2 },
    ],
  })
  console.log("  ✅ Lent items seeded")

  // ─── Meter Readings ─────────────────────────────────────────────────────
  await prisma.meterReading.createMany({
    data: [
      { id: "mr-01", month: "Mär 2025", power: 260, water: 10.4, heating: 240, powerCost: 83.20, waterCost: 24.96, heatingCost: 26.40 },
      { id: "mr-02", month: "Apr 2025", power: 240, water: 10.1, heating: 140, powerCost: 76.80, waterCost: 24.24, heatingCost: 15.40 },
      { id: "mr-03", month: "Mai 2025", power: 220, water: 11.5, heating: 60, powerCost: 70.40, waterCost: 27.60, heatingCost: 6.60 },
      { id: "mr-04", month: "Jun 2025", power: 210, water: 12.8, heating: 20, powerCost: 67.20, waterCost: 30.72, heatingCost: 2.20 },
      { id: "mr-05", month: "Jul 2025", power: 215, water: 14.2, heating: 10, powerCost: 68.80, waterCost: 34.08, heatingCost: 1.10 },
      { id: "mr-06", month: "Aug 2025", power: 225, water: 13.5, heating: 15, powerCost: 72.00, waterCost: 32.40, heatingCost: 1.65 },
      { id: "mr-07", month: "Sep 2025", power: 285, water: 11.2, heating: 45, powerCost: 91.20, waterCost: 26.88, heatingCost: 4.95 },
      { id: "mr-08", month: "Okt 2025", power: 310, water: 10.8, heating: 120, powerCost: 99.20, waterCost: 25.92, heatingCost: 13.20 },
      { id: "mr-09", month: "Nov 2025", power: 340, water: 10.5, heating: 280, powerCost: 108.80, waterCost: 25.20, heatingCost: 30.80 },
      { id: "mr-10", month: "Dez 2025", power: 380, water: 11.0, heating: 350, powerCost: 121.60, waterCost: 26.40, heatingCost: 38.50 },
      { id: "mr-11", month: "Jan 2026", power: 365, water: 10.9, heating: 320, powerCost: 116.80, waterCost: 26.16, heatingCost: 35.20 },
      { id: "mr-12", month: "Feb 2026", power: 345, water: 10.6, heating: 290, powerCost: 110.40, waterCost: 25.44, heatingCost: 31.90 },
    ],
  })
  console.log("  ✅ Meter readings seeded")

  // ─── Wishlist Projects ──────────────────────────────────────────────────
  await prisma.wishlistProject.createMany({
    data: [
      { id: "wp-1", title: "Neue Terrasse", description: "WPC-Terrasse fuer den Garten. Endlich grillen ohne Splitter.", estimatedCost: 8500, currentSavings: 3200, urgency: "nice-to-have", category: "Outdoor" },
      { id: "wp-2", title: "Solaranlage", description: "6kWp Dachanlage. Weil die Sonne gratis ist und die Stromrechnung nicht.", estimatedCost: 14000, currentSavings: 6800, urgency: "should-do", category: "Energie" },
      { id: "wp-3", title: "Badezimmer-Renovierung", description: "Die Fliesen sind aus den 80ern und sehen auch so aus.", estimatedCost: 12000, currentSavings: 9500, urgency: "need-soon", category: "Innenraum" },
      { id: "wp-4", title: "Dachdaemmung", description: "Aktuelle Daemmung von 1995. Die Waerme fluechtet wie Miete faellig ist.", estimatedCost: 6000, currentSavings: 1500, urgency: "falling-apart", category: "Struktur" },
      { id: "wp-5", title: "Smart-Lock-System", description: "Schluesselloser Zugang. Eine Sache weniger zum Vergessen.", estimatedCost: 800, currentSavings: 400, urgency: "nice-to-have", category: "Smart Home" },
    ],
  })
  console.log("  ✅ Wishlist projects seeded")

  // ─── Waste Calendar ───────────────────────────────────────────────────
  await prisma.wasteType.createMany({
    data: [
      { id: "wt-rest", name: "Restmüll", color: "gray-700", icon: "Trash2" },
      { id: "wt-bio", name: "Bio", color: "green-600", icon: "Leaf" },
      { id: "wt-papier", name: "Papier", color: "blue-600", icon: "FileText" },
      { id: "wt-gelb", name: "Gelber Sack", color: "yellow-500", icon: "Package" },
    ],
  })

  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 4)
  const inTwoWeeks = new Date(today)
  inTwoWeeks.setDate(today.getDate() + 11)

  await prisma.wastePickup.createMany({
    data: [
      { date: nextWeek, wasteTypeId: "wt-rest" },
      { date: inTwoWeeks, wasteTypeId: "wt-bio" },
    ],
  })
  console.log("  ✅ Waste calendar seeded")

  // ─── Contracts ──────────────────────────────────────────────────────────
  const now = new Date()
  const trialEndingSoon = new Date(now)
  trialEndingSoon.setHours(now.getHours() + 36) // Within 48 hours for trial-trap alert

  await prisma.contract.createMany({
    data: [
      {
        id: "con-1",
        providerName: "Netflix",
        accountId: "netflix@example.com",
        monthlyCost: 17.99,
        yearlyCost: 215.88,
        category: "Entertainment",
        lastUsedDate: new Date("2026-02-15"),
        isTrial: false,
        nextBillingDate: new Date("2026-03-01"),
        notes: "Premium plan with 4K",
      },
      {
        id: "con-2",
        providerName: "Spotify",
        accountId: "user@example.com",
        monthlyCost: 10.99,
        yearlyCost: 131.88,
        category: "Entertainment",
        lastUsedDate: new Date("2026-02-17"),
        isTrial: false,
        nextBillingDate: new Date("2026-02-25"),
      },
      {
        id: "con-3",
        providerName: "Ultra-Premium Yoga App",
        monthlyCost: 19.99,
        category: "Guilty Pleasure",
        lastUsedDate: new Date("2022-03-15"),
        isTrial: false,
        nextBillingDate: new Date("2026-03-05"),
        notes: "Used once in 2022. Classic.",
      },
      {
        id: "con-4",
        providerName: "Electricity Provider",
        accountId: "KD-1234567",
        monthlyCost: 95.0,
        category: "Utilities",
        lastUsedDate: new Date(),
        isTrial: false,
        nextBillingDate: new Date("2026-03-01"),
      },
      {
        id: "con-5",
        providerName: "Internet & Fiber",
        accountId: "12345678",
        monthlyCost: 49.99,
        category: "Utilities",
        lastUsedDate: new Date(),
        isTrial: false,
        nextBillingDate: new Date("2026-02-28"),
      },
      {
        id: "con-6",
        providerName: "Cloud Storage Pro",
        accountId: "cloud@example.com",
        monthlyCost: 9.99,
        yearlyCost: 99.99,
        category: "Software",
        lastUsedDate: new Date("2026-01-20"),
        isTrial: false,
        nextBillingDate: new Date("2026-03-15"),
      },
      {
        id: "con-7",
        providerName: "Premium Fitness Tracker",
        monthlyCost: 14.99,
        category: "Fitness",
        isTrial: true,
        trialEndDate: trialEndingSoon,
        nextBillingDate: trialEndingSoon,
        notes: "Trial ending soon! Cancel before first charge!",
      },
      {
        id: "con-8",
        providerName: "Meal Kit Delivery",
        accountId: "meal@example.com",
        monthlyCost: 89.99,
        category: "Guilty Pleasure",
        lastUsedDate: new Date("2025-11-10"),
        isTrial: false,
        nextBillingDate: new Date("2026-03-10"),
        notes: "Haven't ordered in months but still paying",
      },
    ],
  })
  console.log("  ✅ Contracts seeded")

  // ─── Insurance ──────────────────────────────────────────────────────────
  const now = new Date()
  const threeMonthsFromNow = new Date(now)
  threeMonthsFromNow.setMonth(now.getMonth() + 3)
  const sixMonthsFromNow = new Date(now)
  sixMonthsFromNow.setMonth(now.getMonth() + 6)
  const oneYearFromNow = new Date(now)
  oneYearFromNow.setFullYear(now.getFullYear() + 1)
  const twoMonthsAgo = new Date(now)
  twoMonthsAgo.setMonth(now.getMonth() - 2)

  await prisma.insurance.createMany({
    data: [
      {
        id: "ins-1",
        providerName: "Allianz",
        policyType: "Private Liability",
        policyNumber: "HV-2023-45678",
        premiumAmount: 85.50,
        paymentFrequency: "Annually",
        deductible: 0,
        startDate: new Date("2023-03-01"),
        cancellationDeadline: threeMonthsFromNow,
        claimsHotline: "+49 800 4 100 100",
        agentEmail: "service@allianz.de",
        notes: "Deckungssumme: 10 Mio. €",
      },
      {
        id: "ins-2",
        providerName: "HUK-Coburg",
        policyType: "Car Insurance",
        policyNumber: "KFZ-2024-12345",
        premiumAmount: 89.90,
        paymentFrequency: "Monthly",
        deductible: 500,
        startDate: new Date("2024-01-01"),
        cancellationDeadline: oneYearFromNow,
        claimsHotline: "+49 9561 96 0",
        agentEmail: "schadenservice@huk-coburg.de",
        beneficiary: "",
        notes: "Vollkasko, SF-Klasse 12",
      },
      {
        id: "ins-3",
        providerName: "Debeka",
        policyType: "Home Contents",
        policyNumber: "HR-2022-98765",
        premiumAmount: 198.00,
        paymentFrequency: "Annually",
        deductible: 150,
        startDate: new Date("2022-05-15"),
        cancellationDeadline: twoMonthsAgo, // Expired - should show as "Yolo"
        claimsHotline: "+49 261 498 1200",
        agentEmail: "service@debeka.de",
        notes: "Versicherungssumme: 65.000 €, inkl. Fahrraddiebstahl",
      },
      {
        id: "ins-4",
        providerName: "ERGO",
        policyType: "Legal Protection",
        policyNumber: "RS-2023-54321",
        premiumAmount: 32.50,
        paymentFrequency: "Monthly",
        deductible: 0,
        startDate: new Date("2023-09-01"),
        cancellationDeadline: sixMonthsFromNow,
        claimsHotline: "+49 211 477 5000",
        agentEmail: "rechtsschutz@ergo.de",
        notes: "Privat-, Berufs- und Verkehrsrechtsschutz",
      },
      {
        id: "ins-5",
        providerName: "WWK",
        policyType: "Disability",
        policyNumber: "BU-2021-11111",
        premiumAmount: 125.00,
        paymentFrequency: "Monthly",
        deductible: 0,
        startDate: new Date("2021-01-01"),
        cancellationDeadline: oneYearFromNow,
        claimsHotline: "+49 89 5114 0",
        agentEmail: "service@wwk.de",
        beneficiary: "Lebenspartner",
        notes: "Monatliche BU-Rente: 2.000 €",
      },
      {
        id: "ins-6",
        providerName: "Petplan",
        policyType: "Pet Insurance",
        policyNumber: "TK-2024-77777",
        premiumAmount: 45.90,
        paymentFrequency: "Monthly",
        deductible: 100,
        startDate: new Date("2024-06-01"),
        cancellationDeadline: sixMonthsFromNow,
        claimsHotline: "+49 40 8080 7474",
        agentEmail: "schadenservice@petplan.de",
        notes: "Für Hund: Max, 5 Jahre, Labrador",
      },
    ],
  })
  console.log("  ✅ Insurance policies seeded")

  // ─── Persons & Identity Documents ───────────────────────────────────────

  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

  const currentYear = today.getFullYear()
  const previousYear = currentYear - 1

  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  const twoYearsFromNow = new Date(today)
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2)

  const threeMonthsAgo = new Date(today)
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  await prisma.person.create({
    data: {
      id: "person-1",
      name: "Max Mustermann",
      relation: "Self",
      documents: {
        create: [
          {
            id: "doc-1",
            documentType: "Passport",
            documentNumber: "C01X0000X",
            issueDate: new Date("2020-01-15"),
            expiryDate: new Date("2030-01-15"),
            physicalLocation: "Fireproof safe in bedroom",
            lostFoundGuide: "Call emergency hotline: 116 116. Report to local police station. Visit embassy if abroad.",
            emergencyContact: "Bürgeramt Berlin Mitte: +49 30 9018 0",
            notes: "Valid for 10 years"
          },
          {
            id: "doc-2",
            documentType: "ID",
            documentNumber: "T22000000<8",
            issueDate: new Date("2019-06-20"),
            expiryDate: sixMonthsFromNow, // Expiring soon!
            physicalLocation: "Wallet",
            lostFoundGuide: "Block immediately: Call 116 116. Report to Bürgeramt within 4 weeks.",
            emergencyContact: "Bürgeramt: +49 30 115",
            notes: "Needs renewal soon!"
          },
          {
            id: "doc-3",
            documentType: "Driver's License",
            documentNumber: "B123456789",
            issueDate: new Date("2015-03-10"),
            expiryDate: new Date("2030-03-10"),
            physicalLocation: "Wallet",
            lostFoundGuide: "Report to local driver's license authority (Führerscheinstelle). Get temporary driving permit.",
            emergencyContact: "Führerscheinstelle: +49 30 9018 0"
          }
        ]
      },
      illnesses: {
        create: [
          {
            id: "illness-1",
            name: "Seasonal Flu",
            startDate: new Date(`${currentYear}-01-12`),
            endDate: new Date(`${currentYear}-01-18`),
            notes: "Fever for two days, then a week of couch recovery."
          },
          {
            id: "illness-2",
            name: "Stomach Bug",
            startDate: new Date(`${previousYear}-11-03`),
            endDate: new Date(`${previousYear}-11-05`),
            notes: "Likely traced back to that suspicious office potluck."
          }
        ]
      }
    }
  })

  await prisma.person.create({
    data: {
      id: "person-2",
      name: "Anna Mustermann",
      relation: "Spouse",
      documents: {
        create: [
          {
            id: "doc-4",
            documentType: "Passport",
            documentNumber: "C02X0000Y",
            issueDate: new Date("2021-05-10"),
            expiryDate: new Date("2031-05-10"),
            physicalLocation: "Fireproof safe in bedroom",
            lostFoundGuide: "Call emergency hotline: 116 116. Report to local police station.",
            emergencyContact: "Bürgeramt: +49 30 115"
          },
          {
            id: "doc-5",
            documentType: "ID",
            documentNumber: "T23000000<1",
            issueDate: new Date("2022-02-14"),
            expiryDate: twoYearsFromNow,
            physicalLocation: "Handbag",
            lostFoundGuide: "Block immediately: Call 116 116",
            emergencyContact: "Bürgeramt: +49 30 115"
          }
        ]
      },
      illnesses: {
        create: [
          {
            id: "illness-3",
            name: "Migraine Episode",
            startDate: new Date(`${currentYear}-03-07`),
            endDate: new Date(`${currentYear}-03-08`),
            notes: "Low-light mode and quiet room required."
          },
          {
            id: "illness-4",
            name: "COVID-19",
            startDate: new Date(`${previousYear}-02-14`),
            endDate: new Date(`${previousYear}-02-21`),
            notes: "Isolated at home and kept hydration high."
          }
        ]
      }
    }
  })

  await prisma.person.create({
    data: {
      id: "person-3",
      name: "Leon Mustermann",
      relation: "Child",
      documents: {
        create: [
          {
            id: "doc-6",
            documentType: "ID",
            documentNumber: "T24000000<5",
            issueDate: new Date("2023-08-01"),
            expiryDate: threeMonthsAgo, // Expired!
            physicalLocation: "Kid's desk drawer",
            lostFoundGuide: "Report to Bürgeramt. Parental presence required for minors.",
            emergencyContact: "Bürgeramt: +49 30 115",
            notes: "EXPIRED - Needs immediate renewal!"
          }
        ]
      },
      illnesses: {
        create: [
          {
            id: "illness-5",
            name: "Chickenpox",
            startDate: new Date(`${previousYear}-05-06`),
            endDate: new Date(`${previousYear}-05-15`),
            notes: "Ten very itchy days and a lot of cartoons."
          },
          {
            id: "illness-6",
            name: "Common Cold",
            startDate: new Date(`${currentYear}-02-02`),
            endDate: new Date(`${currentYear}-02-06`)
          }
        ]
      }
    }
  })

  console.log("  ✅ Persons & identity documents seeded")
  console.log("  ✅ Illness tracker data seeded")

  console.log("🎉 Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
