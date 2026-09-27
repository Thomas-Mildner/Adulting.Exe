

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { MaintenanceTask } from "@/lib/data";
import type { MaintenanceTask as PrismaMaintenanceTask } from "@prisma/client";
import { dateToStr } from "./common";

export const maintenanceTaskInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string(),
  recurring: z.string().default("none"),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean().default(false),
});

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  const rows = await prisma.maintenanceTask.findMany({ orderBy: { dueDate: "asc" } });
  return rows.map((r: PrismaMaintenanceTask) => ({
    id: r.id,
    title: r.title,
    dueDate: dateToStr(r.dueDate),
    recurring: r.recurring,
    priority: r.priority as MaintenanceTask["priority"],
    completed: r.completed,
  }));
}

export async function createMaintenanceTask(data: Omit<MaintenanceTask, "id">) {
  const validated = maintenanceTaskInputSchema.parse(data);
  const created = await prisma.maintenanceTask.create({
    data: {
      title: validated.title,
      dueDate: new Date(validated.dueDate),
      recurring: validated.recurring,
      priority: validated.priority,
      completed: validated.completed,
    },
  });
  revalidatePath("/");
  revalidatePath("/maintenance");
  return created;
}

export async function updateMaintenanceTask(
  id: string,
  data: Partial<Omit<MaintenanceTask, "id">>
) {
  const updated = await prisma.maintenanceTask.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.dueDate !== undefined && { dueDate: new Date(data.dueDate) }),
      ...(data.recurring !== undefined && { recurring: data.recurring }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.completed !== undefined && { completed: data.completed }),
    },
  });
  revalidatePath("/");
  revalidatePath("/maintenance");
  return updated;
}

export async function toggleMaintenanceTask(id: string) {
  const task = await prisma.maintenanceTask.findUnique({ where: { id } });
  if (!task) return null;
  const updated = await prisma.maintenanceTask.update({
    where: { id },
    data: { completed: !task.completed },
  });
  revalidatePath("/");
  revalidatePath("/maintenance");
  return updated;
}

export async function deleteMaintenanceTask(id: string) {
  await prisma.maintenanceTask.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/maintenance");
  return { success: true };
}

