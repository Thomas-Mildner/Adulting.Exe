"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAppConfig() {
  let config = await prisma.appConfig.findUnique({ where: { id: "default" } });
  if (!config) {
    config = await prisma.appConfig.create({ data: { id: "default", heatingType: "Gas" } });
  }
  return config;
}

export async function updateHeatingType(type: string) {
  const updated = await prisma.appConfig.update({
    where: { id: "default" },
    data: { heatingType: type },
  });
  revalidatePath("/settings");
  revalidatePath("/utilities");
  return updated;
}

export async function completeOnboarding() {
  const updated = await prisma.appConfig.upsert({
    where: { id: "default" },
    update: { onboardingCompleted: true },
    create: { id: "default", heatingType: "Gas", onboardingCompleted: true },
  });
  revalidatePath("/");
  return updated;
}

export async function updateDisabledModules(modules: string[]) {
  const updated = await prisma.appConfig.upsert({
    where: { id: "default" },
    create: { id: "default", heatingType: "Gas", disabledModules: modules },
    update: { disabledModules: modules },
  });
  revalidatePath("/settings");
  revalidatePath("/");
  return updated;
}

export async function completeTutorial(moduleKey: string) {
  const config = await getAppConfig();
  const updated = Array.from(new Set([...config.tutorialCompletedModules, moduleKey]));
  return await prisma.appConfig.update({
    where: { id: "default" },
    data: { tutorialCompletedModules: updated },
  });
}

