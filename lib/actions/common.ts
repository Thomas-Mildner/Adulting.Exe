export function dateToStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

