-- CreateIndex
CREATE INDEX "ServiceHistory_providerId_idx" ON "ServiceHistory"("providerId");

-- CreateIndex
CREATE INDEX "Invoice_providerId_idx" ON "Invoice"("providerId");

-- CreateIndex
CREATE INDEX "WastePickup_wasteTypeId_idx" ON "WastePickup"("wasteTypeId");

-- CreateIndex
CREATE INDEX "CarMaintenance_carId_idx" ON "CarMaintenance"("carId");

-- CreateIndex
CREATE INDEX "FuelEntry_carId_idx" ON "FuelEntry"("carId");

-- CreateIndex
CREATE INDEX "TollEntry_carId_idx" ON "TollEntry"("carId");

-- CreateIndex
CREATE INDEX "CarDocument_carId_idx" ON "CarDocument"("carId");

-- CreateIndex
CREATE INDEX "VetRecord_petId_idx" ON "VetRecord"("petId");

-- CreateIndex
CREATE INDEX "Vaccination_petId_idx" ON "Vaccination"("petId");

-- CreateIndex
CREATE INDEX "IdentityDocument_personId_idx" ON "IdentityDocument"("personId");

-- CreateIndex
CREATE INDEX "Illness_personId_idx" ON "Illness"("personId");

