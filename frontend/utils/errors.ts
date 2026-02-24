export function detailsToErrors(details: unknown[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const d of details) {
    if (d && typeof d === "object" && "field" in d && "message" in d) {
      out[(d as { field: string }).field] = (d as { message: string }).message;
    }
  }
  return out;
}

export type ApiErrorState = {
  message: string;
  requestId?: string;
  details?: unknown[];
};
