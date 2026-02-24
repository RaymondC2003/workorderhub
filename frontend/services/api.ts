import type { WorkOrder, PaginatedWorkOrders } from "@/types/workorder";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const API_KEY = (process.env.NEXT_PUBLIC_API_KEY || "").trim();

export type ApiResult<T> =
  | { ok: true; requestId: string; data: T }
  | {
      ok: false;
      requestId: string;
      error: { code: string; message: string; details?: unknown[] };
    };

export interface ListWorkOrdersQuery {
  status?: string;
  department?: string;
  priority?: string;
  assignee?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface CreateWorkOrderPayload {
  title: string;
  description: string;
  department: string;
  priority: string;
  requesterName: string;
  assignee?: string | null;
}

export interface UpdateWorkOrderPayload {
  title?: string;
  description?: string;
  priority?: string;
  assignee?: string | null;
}

export interface BulkUploadResult {
  uploadId: string;
  strategy: string;
  totalRows: number;
  accepted: number;
  rejected: number;
  errors: { row: number; field: string; reason: string }[];
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "x-api-key": API_KEY,
    ...(options.headers as Record<string, string>),
  };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });
  const requestIdFromHeader = res.headers.get("x-request-id") ?? "";

  let body: unknown;
  if (res.status === 204) {
    return {
      ok: true,
      requestId: requestIdFromHeader,
      data: undefined as T,
    };
  }
  try {
    body = await res.json();
  } catch {
    return {
      ok: false,
      requestId: requestIdFromHeader,
      error: {
        code: "INTERNAL_ERROR",
        message: "Invalid response body",
      },
    };
  }

  const obj = body as {
    requestId?: string;
    success?: boolean;
    data?: T;
    error?: { code: string; message: string; details?: unknown[] };
  };
  const rid = obj.requestId ?? requestIdFromHeader;

  if (res.ok && obj.success !== false) {
    return { ok: true, requestId: rid, data: (obj.data ?? body) as T };
  }

  return {
    ok: false,
    requestId: rid,
    error: obj.error || {
      code: "INTERNAL_ERROR",
      message: "Unknown error",
      details: [],
    },
  };
}

export function listWorkOrders(
  query: ListWorkOrdersQuery = {}
): Promise<ApiResult<PaginatedWorkOrders>> {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.department) params.set("department", query.department);
  if (query.priority) params.set("priority", query.priority);
  if (query.assignee) params.set("assignee", query.assignee);
  if (query.q) params.set("q", query.q);
  if (query.page != null) params.set("page", String(query.page));
  if (query.limit != null) params.set("limit", String(query.limit));
  const qs = params.toString();
  return request<PaginatedWorkOrders>(
    `/api/v1/workorders${qs ? `?${qs}` : ""}`
  );
}

export function getWorkOrder(id: string): Promise<ApiResult<WorkOrder>> {
  return request<WorkOrder>(`/api/v1/workorders/${id}`);
}

export function createWorkOrder(
  payload: CreateWorkOrderPayload
): Promise<ApiResult<WorkOrder>> {
  return request<WorkOrder>("/api/v1/workorders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateWorkOrder(
  id: string,
  payload: UpdateWorkOrderPayload
): Promise<ApiResult<WorkOrder>> {
  return request<WorkOrder>(`/api/v1/workorders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function changeStatus(
  id: string,
  status: string
): Promise<ApiResult<WorkOrder>> {
  return request<WorkOrder>(`/api/v1/workorders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteWorkOrder(
  id: string
): Promise<ApiResult<undefined>> {
  return request<undefined>(`/api/v1/workorders/${id}`, { method: "DELETE" });
}

export function bulkUploadCsv(
  file: File
): Promise<ApiResult<BulkUploadResult>> {
  const form = new FormData();
  form.append("file", file);
  return request<BulkUploadResult>("/api/v1/workorders/bulk-upload", {
    method: "POST",
    body: form,
  });
}
