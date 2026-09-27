import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminRequest, checkRateLimit } from "@/lib/security";

export async function GET(request: NextRequest) {
  // 1. Rate limiting (max 10 exports per minute)
  const clientIp = request.headers.get("x-forwarded-for") || "export-api";
  const rateLimit = checkRateLimit(`export-${clientIp}`, 10, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many export requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  // 2. Admin authorization (if ADMIN_API_KEY is configured in env)
  const auth = validateAdminRequest(request);
  if (!auth.authorized && auth.errorResponse) {
    return auth.errorResponse;
  }

  try {
    const data = {
      appliances: await prisma.appliance.findMany(),
      serviceProviders: await prisma.serviceProvider.findMany(),
      serviceHistory: await prisma.serviceHistory.findMany(),
      invoices: await prisma.invoice.findMany(),
      documents: await prisma.document.findMany(),
      maintenanceTasks: await prisma.maintenanceTask.findMany(),
      lentItems: await prisma.lentItem.findMany(),
      meterReadings: await prisma.meterReading.findMany(),
      wishlistProjects: await prisma.wishlistProject.findMany(),
      wasteTypes: await prisma.wasteType.findMany(),
      wastePickups: await prisma.wastePickup.findMany(),
      appConfig: await prisma.appConfig.findMany(),
      cars: await prisma.car.findMany(),
      carMaintenance: await prisma.carMaintenance.findMany(),
      fuelEntries: await prisma.fuelEntry.findMany(),
      tollEntries: await prisma.tollEntry.findMany(),
      carDocuments: await prisma.carDocument.findMany(),
      insurances: await prisma.insurance.findMany(),
      contracts: await prisma.contract.findMany(),
      notificationReads: await prisma.notificationRead.findMany(),
      pets: await prisma.pet.findMany(),
      vetRecords: await prisma.vetRecord.findMany(),
      vaccinations: await prisma.vaccination.findMany(),
      persons: await prisma.person.findMany(),
      identityDocuments: await prisma.identityDocument.findMany(),
      illnesses: await prisma.illness.findMany(),
    };

    const jsonString = JSON.stringify(data, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="adulting-export.json"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data." },
      { status: 500 }
    );
  }
}
