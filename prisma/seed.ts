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
      { id: "mr-1", month: "Sep 2025", power: 285, water: 11.2, heating: 45 },
      { id: "mr-2", month: "Oct 2025", power: 310, water: 10.8, heating: 120 },
      { id: "mr-3", month: "Nov 2025", power: 340, water: 10.5, heating: 280 },
      { id: "mr-4", month: "Dec 2025", power: 380, water: 11.0, heating: 350 },
      { id: "mr-5", month: "Jan 2026", power: 365, water: 10.9, heating: 320 },
      { id: "mr-6", month: "Feb 2026", power: 345, water: 10.6, heating: 290 },
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
