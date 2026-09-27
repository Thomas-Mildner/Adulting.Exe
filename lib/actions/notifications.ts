"use server";



import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Notification } from "@/lib/data";
import { dateToStr } from "./common";

export async function getNotifications(): Promise<Notification[]> {
  const notifications: Notification[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Waste Pickups (Tomorrow)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfTomorrow = new Date(tomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const waste = await prisma.wastePickup.findMany({
    where: {
      date: {
        gte: tomorrow,
        lte: endOfTomorrow,
      },
    },
    include: { wasteType: true },
  });

  waste.forEach((w) => {
    notifications.push({
      id: `waste-${w.id}`,
      title: `Müllabfuhr Morgen: ${w.wasteType.name}`,
      message: "Vergiss nicht, die Tonne rauszustellen!",
      type: "info",
      category: "Waste",
      link: "/waste",
      date: dateToStr(w.date),
    });
  });

  // 2. Appliances (Warranty expiring < 30 days)
  const warningDate = new Date(today);
  warningDate.setDate(warningDate.getDate() + 30);

  const appliances = await prisma.appliance.findMany({
    where: {
      warrantyEnd: {
        gte: today,
        lte: warningDate,
      },
      status: { not: "zombie" },
    },
  });

  appliances.forEach((a) => {
    notifications.push({
      id: `appliance-${a.id}`,
      title: `Garantie läuft ab: ${a.name}`,
      message: `Die Garantie endet am ${dateToStr(a.warrantyEnd)}.`,
      type: "warning",
      category: "Appliance",
      link: `/vault/${a.id}`,
      date: dateToStr(a.warrantyEnd),
    });
  });

  // 3. Maintenance Tasks (Due or Overdue)
  const tasks = await prisma.maintenanceTask.findMany({
    where: {
      dueDate: { lte: today },
      completed: false,
    },
  });

  tasks.forEach((t) => {
    notifications.push({
      id: `maintenance-${t.id}`,
      title: `Wartung fällig: ${t.title}`,
      message: "Diese Aufgabe ist heute fällig oder überfällig.",
      type: "warning",
      category: "Maintenance",
      link: "/maintenance",
      date: dateToStr(t.dueDate),
    });
  });

  // 4. Lent Items (Overdue)
  const lentItems = await prisma.lentItem.findMany({
    where: {
      expectedReturn: { lt: today },
    },
  });

  lentItems.forEach((l) => {
    notifications.push({
      id: `lent-${l.id}`,
      title: `Überfällig: ${l.item}`,
      message: `${l.borrower} sollte das eigentlich schon zurückgegeben haben.`,
      type: "error",
      category: "Lent",
      link: "/lending",
      date: dateToStr(l.expectedReturn),
    });
  });

  // 5. Contracts (Trial ending in 48 hours)
  const in48Hours = new Date(today);
  in48Hours.setHours(today.getHours() + 48);

  const trials = await prisma.contract.findMany({
    where: {
      isTrial: true,
      trialEndDate: {
        gte: today,
        lte: in48Hours,
      },
    },
  });

  trials.forEach((c) => {
    notifications.push({
      id: `contract-trial-${c.id}`,
      title: `🚨 Trial-Trap Alert: ${c.providerName}`,
      message: `Free trial ends in 48 hours! First charge: €${c.monthlyCost}/month`,
      type: "warning",
      category: "Contract",
      link: "/contracts",
      date: c.trialEndDate ? dateToStr(c.trialEndDate) : undefined,
    });
  });

  // 6. Identity Documents (Expired or Expiring Soon)
  const sixMonthsFromNow = new Date(today);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  const expiringDocuments = await prisma.identityDocument.findMany({
    where: {
      expiryDate: { lte: sixMonthsFromNow },
    },
    include: { person: true },
    orderBy: { expiryDate: "asc" },
  });

  expiringDocuments.forEach((doc) => {
    const daysRemaining = Math.ceil(
      (doc.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0) {
      notifications.push({
        id: `doc-${doc.id}`,
        title: `⚠️ ${doc.documentType} Abgelaufen!`,
        message: `${doc.person.name}'s ${doc.documentType} ist seit ${Math.abs(daysRemaining)} Tagen abgelaufen. Sofort erneuern!`,
        type: "error",
        category: "Maintenance",
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      });
    } else if (daysRemaining <= 30) {
      notifications.push({
        id: `doc-${doc.id}`,
        title: `Dringend: ${doc.documentType} läuft bald ab`,
        message: `${doc.person.name}'s ${doc.documentType} läuft in ${daysRemaining} Tagen ab.`,
        type: "error",
        category: "Maintenance",
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      });
    } else if (daysRemaining <= 90) {
      notifications.push({
        id: `doc-${doc.id}`,
        title: `${doc.documentType} läuft in ${Math.floor(daysRemaining / 30)} Monaten ab`,
        message: `Zeit für ${doc.person.name}, einen Termin beim Bürgeramt zu vereinbaren.`,
        type: "warning",
        category: "Maintenance",
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      });
    } else if (daysRemaining <= 180) {
      notifications.push({
        id: `doc-${doc.id}`,
        title: `${doc.documentType} läuft in 6 Monaten ab`,
        message: `${doc.person.name}: Der Staat will bald dein Geld/Aufmerksamkeit. Fang an, für einen Termin zu beten.`,
        type: "info",
        category: "Maintenance",
        link: "/documents",
        date: dateToStr(doc.expiryDate),
      });
    }
  });

  // Filter out read notifications
  const readNotifications = await prisma.notificationRead.findMany({
    select: { id: true },
  });
  const readIds = new Set(readNotifications.map((n) => n.id));

  return notifications.filter((n) => !readIds.has(n.id));
}

export async function markNotificationAsRead(id: string) {
  const result = await prisma.notificationRead.create({
    data: { id },
  });
  revalidatePath("/");
  return result;
}

export async function markAllNotificationsAsRead(ids: string[]) {
  if (ids.length === 0) return { count: 0 };
  const result = await prisma.notificationRead.createMany({
    data: ids.map((id) => ({ id })),
    skipDuplicates: true,
  });
  revalidatePath("/");
  return result;
}

