import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Run everything in a transaction to ensure atomic restore
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing data in reverse dependency order
      await tx.illness.deleteMany();
      await tx.identityDocument.deleteMany();
      await tx.person.deleteMany();

      await tx.vetRecord.deleteMany();
      await tx.vaccination.deleteMany();
      await tx.pet.deleteMany();

      await tx.carDocument.deleteMany();
      await tx.tollEntry.deleteMany();
      await tx.fuelEntry.deleteMany();
      await tx.carMaintenance.deleteMany();
      await tx.car.deleteMany();

      await tx.wastePickup.deleteMany();
      await tx.wasteType.deleteMany();

      await tx.invoice.deleteMany();
      await tx.serviceHistory.deleteMany();
      await tx.serviceProvider.deleteMany();

      await tx.appliance.deleteMany();
      await tx.document.deleteMany();
      await tx.maintenanceTask.deleteMany();
      await tx.lentItem.deleteMany();
      await tx.meterReading.deleteMany();
      await tx.wishlistProject.deleteMany();
      await tx.appConfig.deleteMany();
      await tx.insurance.deleteMany();
      await tx.contract.deleteMany();
      await tx.notificationRead.deleteMany();

      // 2. Insert new data
      if (data.appConfig && data.appConfig.length > 0) await tx.appConfig.createMany({ data: data.appConfig });
      if (data.appliances && data.appliances.length > 0) await tx.appliance.createMany({ data: data.appliances });
      if (data.documents && data.documents.length > 0) await tx.document.createMany({ data: data.documents });
      if (data.maintenanceTasks && data.maintenanceTasks.length > 0) await tx.maintenanceTask.createMany({ data: data.maintenanceTasks });
      if (data.lentItems && data.lentItems.length > 0) await tx.lentItem.createMany({ data: data.lentItems });
      if (data.meterReadings && data.meterReadings.length > 0) await tx.meterReading.createMany({ data: data.meterReadings });
      if (data.wishlistProjects && data.wishlistProjects.length > 0) await tx.wishlistProject.createMany({ data: data.wishlistProjects });
      if (data.insurances && data.insurances.length > 0) await tx.insurance.createMany({ data: data.insurances });
      if (data.contracts && data.contracts.length > 0) await tx.contract.createMany({ data: data.contracts });
      if (data.notificationReads && data.notificationReads.length > 0) await tx.notificationRead.createMany({ data: data.notificationReads });

      if (data.serviceProviders && data.serviceProviders.length > 0) await tx.serviceProvider.createMany({ data: data.serviceProviders });
      if (data.serviceHistory && data.serviceHistory.length > 0) await tx.serviceHistory.createMany({ data: data.serviceHistory });
      if (data.invoices && data.invoices.length > 0) await tx.invoice.createMany({ data: data.invoices });

      if (data.wasteTypes && data.wasteTypes.length > 0) await tx.wasteType.createMany({ data: data.wasteTypes });
      if (data.wastePickups && data.wastePickups.length > 0) await tx.wastePickup.createMany({ data: data.wastePickups });

      if (data.cars && data.cars.length > 0) await tx.car.createMany({ data: data.cars });
      if (data.carMaintenance && data.carMaintenance.length > 0) await tx.carMaintenance.createMany({ data: data.carMaintenance });
      if (data.fuelEntries && data.fuelEntries.length > 0) await tx.fuelEntry.createMany({ data: data.fuelEntries });
      if (data.tollEntries && data.tollEntries.length > 0) await tx.tollEntry.createMany({ data: data.tollEntries });
      if (data.carDocuments && data.carDocuments.length > 0) await tx.carDocument.createMany({ data: data.carDocuments });

      if (data.pets && data.pets.length > 0) await tx.pet.createMany({ data: data.pets });
      if (data.vetRecords && data.vetRecords.length > 0) await tx.vetRecord.createMany({ data: data.vetRecords });
      if (data.vaccinations && data.vaccinations.length > 0) await tx.vaccination.createMany({ data: data.vaccinations });

      if (data.persons && data.persons.length > 0) await tx.person.createMany({ data: data.persons });
      if (data.identityDocuments && data.identityDocuments.length > 0) await tx.identityDocument.createMany({ data: data.identityDocuments });
      if (data.illnesses && data.illnesses.length > 0) await tx.illness.createMany({ data: data.illnesses });
    }, {
      timeout: 20000 // Give it 20 seconds to do the full restore
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import data." },
      { status: 500 }
    );
  }
}
