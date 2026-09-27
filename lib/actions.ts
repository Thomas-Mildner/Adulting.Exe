"use server";

import * as appliances from "./actions/appliances";
import * as config from "./actions/config";
import * as contracts from "./actions/contracts";
import * as garage from "./actions/garage";
import * as identity from "./actions/identity";
import * as illnesses from "./actions/illnesses";
import * as lending from "./actions/lending";
import * as library from "./actions/library";
import * as notifications from "./actions/notifications";
import * as pets from "./actions/pets";
import * as services from "./actions/services";
import * as tasks from "./actions/tasks";
import * as utilities from "./actions/utilities";
import * as waste from "./actions/waste";
import * as wishlist from "./actions/wishlist";

// --- APPLIANCES ---
export async function getAppliances(...args: Parameters<typeof appliances.getAppliances>) {
  return appliances.getAppliances(...args);
}

export async function getAppliance(...args: Parameters<typeof appliances.getAppliance>) {
  return appliances.getAppliance(...args);
}

export async function createAppliance(...args: Parameters<typeof appliances.createAppliance>) {
  return appliances.createAppliance(...args);
}

export async function updateAppliance(...args: Parameters<typeof appliances.updateAppliance>) {
  return appliances.updateAppliance(...args);
}

export async function deleteAppliance(...args: Parameters<typeof appliances.deleteAppliance>) {
  return appliances.deleteAppliance(...args);
}

// --- CONFIG ---
export async function getAppConfig(...args: Parameters<typeof config.getAppConfig>) {
  return config.getAppConfig(...args);
}

export async function updateHeatingType(...args: Parameters<typeof config.updateHeatingType>) {
  return config.updateHeatingType(...args);
}

export async function completeOnboarding(...args: Parameters<typeof config.completeOnboarding>) {
  return config.completeOnboarding(...args);
}

export async function updateDisabledModules(...args: Parameters<typeof config.updateDisabledModules>) {
  return config.updateDisabledModules(...args);
}

export async function completeTutorial(...args: Parameters<typeof config.completeTutorial>) {
  return config.completeTutorial(...args);
}

// --- CONTRACTS ---
export async function getContracts(...args: Parameters<typeof contracts.getContracts>) {
  return contracts.getContracts(...args);
}

export async function getContract(...args: Parameters<typeof contracts.getContract>) {
  return contracts.getContract(...args);
}

export async function createContract(...args: Parameters<typeof contracts.createContract>) {
  return contracts.createContract(...args);
}

export async function updateContract(...args: Parameters<typeof contracts.updateContract>) {
  return contracts.updateContract(...args);
}

export async function deleteContract(...args: Parameters<typeof contracts.deleteContract>) {
  return contracts.deleteContract(...args);
}

export async function generateCancellationLetter(...args: Parameters<typeof contracts.generateCancellationLetter>) {
  return contracts.generateCancellationLetter(...args);
}

export async function generateContractCancellationLetter(...args: Parameters<typeof contracts.generateContractCancellationLetter>) {
  return contracts.generateContractCancellationLetter(...args);
}

// --- GARAGE ---
export async function getCars(...args: Parameters<typeof garage.getCars>) {
  return garage.getCars(...args);
}

export async function createCar(...args: Parameters<typeof garage.createCar>) {
  return garage.createCar(...args);
}

export async function updateCar(...args: Parameters<typeof garage.updateCar>) {
  return garage.updateCar(...args);
}

export async function deleteCar(...args: Parameters<typeof garage.deleteCar>) {
  return garage.deleteCar(...args);
}

export async function getCarMaintenance(...args: Parameters<typeof garage.getCarMaintenance>) {
  return garage.getCarMaintenance(...args);
}

export async function createCarMaintenance(...args: Parameters<typeof garage.createCarMaintenance>) {
  return garage.createCarMaintenance(...args);
}

export async function updateCarMaintenance(...args: Parameters<typeof garage.updateCarMaintenance>) {
  return garage.updateCarMaintenance(...args);
}

export async function deleteCarMaintenance(...args: Parameters<typeof garage.deleteCarMaintenance>) {
  return garage.deleteCarMaintenance(...args);
}

export async function getFuelEntries(...args: Parameters<typeof garage.getFuelEntries>) {
  return garage.getFuelEntries(...args);
}

export async function createFuelEntry(...args: Parameters<typeof garage.createFuelEntry>) {
  return garage.createFuelEntry(...args);
}

export async function updateFuelEntry(...args: Parameters<typeof garage.updateFuelEntry>) {
  return garage.updateFuelEntry(...args);
}

export async function deleteFuelEntry(...args: Parameters<typeof garage.deleteFuelEntry>) {
  return garage.deleteFuelEntry(...args);
}

export async function getTollEntries(...args: Parameters<typeof garage.getTollEntries>) {
  return garage.getTollEntries(...args);
}

export async function createTollEntry(...args: Parameters<typeof garage.createTollEntry>) {
  return garage.createTollEntry(...args);
}

export async function updateTollEntry(...args: Parameters<typeof garage.updateTollEntry>) {
  return garage.updateTollEntry(...args);
}

export async function deleteTollEntry(...args: Parameters<typeof garage.deleteTollEntry>) {
  return garage.deleteTollEntry(...args);
}

export async function getCarDocuments(...args: Parameters<typeof garage.getCarDocuments>) {
  return garage.getCarDocuments(...args);
}

export async function createCarDocument(...args: Parameters<typeof garage.createCarDocument>) {
  return garage.createCarDocument(...args);
}

export async function deleteCarDocument(...args: Parameters<typeof garage.deleteCarDocument>) {
  return garage.deleteCarDocument(...args);
}

export async function uploadCarDocument(...args: Parameters<typeof garage.uploadCarDocument>) {
  return garage.uploadCarDocument(...args);
}

// --- IDENTITY ---
export async function getPersons(...args: Parameters<typeof identity.getPersons>) {
  return identity.getPersons(...args);
}

export async function getPerson(...args: Parameters<typeof identity.getPerson>) {
  return identity.getPerson(...args);
}

export async function createPerson(...args: Parameters<typeof identity.createPerson>) {
  return identity.createPerson(...args);
}

export async function updatePerson(...args: Parameters<typeof identity.updatePerson>) {
  return identity.updatePerson(...args);
}

export async function deletePerson(...args: Parameters<typeof identity.deletePerson>) {
  return identity.deletePerson(...args);
}

export async function getIdentityDocuments(...args: Parameters<typeof identity.getIdentityDocuments>) {
  return identity.getIdentityDocuments(...args);
}

export async function getIdentityDocument(...args: Parameters<typeof identity.getIdentityDocument>) {
  return identity.getIdentityDocument(...args);
}

export async function createIdentityDocument(...args: Parameters<typeof identity.createIdentityDocument>) {
  return identity.createIdentityDocument(...args);
}

export async function updateIdentityDocument(...args: Parameters<typeof identity.updateIdentityDocument>) {
  return identity.updateIdentityDocument(...args);
}

export async function deleteIdentityDocument(...args: Parameters<typeof identity.deleteIdentityDocument>) {
  return identity.deleteIdentityDocument(...args);
}

export async function getExpiringDocuments(...args: Parameters<typeof identity.getExpiringDocuments>) {
  return identity.getExpiringDocuments(...args);
}

// --- ILLNESSES ---
export async function getIllnesses(...args: Parameters<typeof illnesses.getIllnesses>) {
  return illnesses.getIllnesses(...args);
}

export async function getIllness(...args: Parameters<typeof illnesses.getIllness>) {
  return illnesses.getIllness(...args);
}

export async function createIllness(...args: Parameters<typeof illnesses.createIllness>) {
  return illnesses.createIllness(...args);
}

export async function updateIllness(...args: Parameters<typeof illnesses.updateIllness>) {
  return illnesses.updateIllness(...args);
}

export async function deleteIllness(...args: Parameters<typeof illnesses.deleteIllness>) {
  return illnesses.deleteIllness(...args);
}

// --- LENDING ---
export async function getLentItems(...args: Parameters<typeof lending.getLentItems>) {
  return lending.getLentItems(...args);
}

export async function createLentItem(...args: Parameters<typeof lending.createLentItem>) {
  return lending.createLentItem(...args);
}

export async function updateLentItem(...args: Parameters<typeof lending.updateLentItem>) {
  return lending.updateLentItem(...args);
}

export async function deleteLentItem(...args: Parameters<typeof lending.deleteLentItem>) {
  return lending.deleteLentItem(...args);
}

// --- LIBRARY ---
export async function getDocuments(...args: Parameters<typeof library.getDocuments>) {
  return library.getDocuments(...args);
}

export async function createDocument(...args: Parameters<typeof library.createDocument>) {
  return library.createDocument(...args);
}

export async function updateDocument(...args: Parameters<typeof library.updateDocument>) {
  return library.updateDocument(...args);
}

export async function deleteDocument(...args: Parameters<typeof library.deleteDocument>) {
  return library.deleteDocument(...args);
}

// --- NOTIFICATIONS ---
export async function getNotifications(...args: Parameters<typeof notifications.getNotifications>) {
  return notifications.getNotifications(...args);
}

export async function markNotificationAsRead(...args: Parameters<typeof notifications.markNotificationAsRead>) {
  return notifications.markNotificationAsRead(...args);
}

export async function markAllNotificationsAsRead(...args: Parameters<typeof notifications.markAllNotificationsAsRead>) {
  return notifications.markAllNotificationsAsRead(...args);
}

// --- PETS ---
export async function getPets(...args: Parameters<typeof pets.getPets>) {
  return pets.getPets(...args);
}

export async function getPet(...args: Parameters<typeof pets.getPet>) {
  return pets.getPet(...args);
}

export async function createPet(...args: Parameters<typeof pets.createPet>) {
  return pets.createPet(...args);
}

export async function updatePet(...args: Parameters<typeof pets.updatePet>) {
  return pets.updatePet(...args);
}

export async function deletePet(...args: Parameters<typeof pets.deletePet>) {
  return pets.deletePet(...args);
}

export async function getVetRecords(...args: Parameters<typeof pets.getVetRecords>) {
  return pets.getVetRecords(...args);
}

export async function createVetRecord(...args: Parameters<typeof pets.createVetRecord>) {
  return pets.createVetRecord(...args);
}

export async function updateVetRecord(...args: Parameters<typeof pets.updateVetRecord>) {
  return pets.updateVetRecord(...args);
}

export async function deleteVetRecord(...args: Parameters<typeof pets.deleteVetRecord>) {
  return pets.deleteVetRecord(...args);
}

export async function getVaccinations(...args: Parameters<typeof pets.getVaccinations>) {
  return pets.getVaccinations(...args);
}

export async function createVaccination(...args: Parameters<typeof pets.createVaccination>) {
  return pets.createVaccination(...args);
}

export async function updateVaccination(...args: Parameters<typeof pets.updateVaccination>) {
  return pets.updateVaccination(...args);
}

export async function deleteVaccination(...args: Parameters<typeof pets.deleteVaccination>) {
  return pets.deleteVaccination(...args);
}

// --- SERVICES ---
export async function getServiceProviders(...args: Parameters<typeof services.getServiceProviders>) {
  return services.getServiceProviders(...args);
}

export async function createServiceProvider(...args: Parameters<typeof services.createServiceProvider>) {
  return services.createServiceProvider(...args);
}

export async function updateServiceProvider(...args: Parameters<typeof services.updateServiceProvider>) {
  return services.updateServiceProvider(...args);
}

export async function deleteServiceProvider(...args: Parameters<typeof services.deleteServiceProvider>) {
  return services.deleteServiceProvider(...args);
}

export async function getInvoices(...args: Parameters<typeof services.getInvoices>) {
  return services.getInvoices(...args);
}

export async function createInvoice(...args: Parameters<typeof services.createInvoice>) {
  return services.createInvoice(...args);
}

export async function deleteInvoice(...args: Parameters<typeof services.deleteInvoice>) {
  return services.deleteInvoice(...args);
}

export async function updateInvoice(...args: Parameters<typeof services.updateInvoice>) {
  return services.updateInvoice(...args);
}

export async function getTotalTaxDeductible(...args: Parameters<typeof services.getTotalTaxDeductible>) {
  return services.getTotalTaxDeductible(...args);
}

// --- TASKS ---
export async function getMaintenanceTasks(...args: Parameters<typeof tasks.getMaintenanceTasks>) {
  return tasks.getMaintenanceTasks(...args);
}

export async function createMaintenanceTask(...args: Parameters<typeof tasks.createMaintenanceTask>) {
  return tasks.createMaintenanceTask(...args);
}

export async function updateMaintenanceTask(...args: Parameters<typeof tasks.updateMaintenanceTask>) {
  return tasks.updateMaintenanceTask(...args);
}

export async function toggleMaintenanceTask(...args: Parameters<typeof tasks.toggleMaintenanceTask>) {
  return tasks.toggleMaintenanceTask(...args);
}

export async function deleteMaintenanceTask(...args: Parameters<typeof tasks.deleteMaintenanceTask>) {
  return tasks.deleteMaintenanceTask(...args);
}

// --- UTILITIES ---
export async function getMeterReadings(...args: Parameters<typeof utilities.getMeterReadings>) {
  return utilities.getMeterReadings(...args);
}

export async function createMeterReading(...args: Parameters<typeof utilities.createMeterReading>) {
  return utilities.createMeterReading(...args);
}

// --- WASTE ---
export async function getWasteTypes(...args: Parameters<typeof waste.getWasteTypes>) {
  return waste.getWasteTypes(...args);
}

export async function getWastePickups(...args: Parameters<typeof waste.getWastePickups>) {
  return waste.getWastePickups(...args);
}

export async function createWastePickup(...args: Parameters<typeof waste.createWastePickup>) {
  return waste.createWastePickup(...args);
}

export async function importIcsWastePickups(...args: Parameters<typeof waste.importIcsWastePickups>) {
  return waste.importIcsWastePickups(...args);
}

export async function deleteWastePickup(...args: Parameters<typeof waste.deleteWastePickup>) {
  return waste.deleteWastePickup(...args);
}

export async function getNextWastePickup(...args: Parameters<typeof waste.getNextWastePickup>) {
  return waste.getNextWastePickup(...args);
}

export async function createWasteType(...args: Parameters<typeof waste.createWasteType>) {
  return waste.createWasteType(...args);
}

export async function deleteWasteType(...args: Parameters<typeof waste.deleteWasteType>) {
  return waste.deleteWasteType(...args);
}

// --- WISHLIST ---
export async function getWishlistProjects(...args: Parameters<typeof wishlist.getWishlistProjects>) {
  return wishlist.getWishlistProjects(...args);
}

export async function createWishlistProject(...args: Parameters<typeof wishlist.createWishlistProject>) {
  return wishlist.createWishlistProject(...args);
}

export async function updateWishlistProject(...args: Parameters<typeof wishlist.updateWishlistProject>) {
  return wishlist.updateWishlistProject(...args);
}

export async function deleteWishlistProject(...args: Parameters<typeof wishlist.deleteWishlistProject>) {
  return wishlist.deleteWishlistProject(...args);
}

