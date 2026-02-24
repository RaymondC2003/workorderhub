import { useEffect, useState } from "react";
import Link from "next/link";
import { listWorkOrders, changeStatus } from "@/services/api";
import type { WorkOrder, Status } from "@/types/workorder";
import type { ApiErrorState } from "@/utils/errors";

const STATUSES = ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"] as const;
const VALID_TRANSITIONS: Record<string, string[]> = {
  NEW: ["IN_PROGRESS"],
  IN_PROGRESS: ["BLOCKED", "DONE"],
  BLOCKED: ["IN_PROGRESS"],
  DONE: [],
};

function canTransition(from: string, to: string): boolean {
  return (VALID_TRANSITIONS[from] ?? []).includes(to);
}

export default function DashboardPage() {
  const [items, setItems] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorState | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    listWorkOrders({ limit: 500 })
      .then((r) => {
        if (r.ok) setItems(r.data.items);
        else setError({ message: r.error.message, requestId: r.requestId });
      })
      .finally(() => setLoading(false));
  }, []);

  const byStatus = (status: string) =>
    items.filter((wo) => wo.status === status);

  const handleDragStart = (e: React.DragEvent, wo: WorkOrder) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: wo.id, status: wo.status }),
    );
    e.dataTransfer.effectAllowed = "move";
    setMovingId(wo.id);
  };

  const handleDragEnd = () => {
    setMovingId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    let data: { id: string; status: string };
    try {
      data = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }
    const { id, status: fromStatus } = data;
    if (!canTransition(fromStatus, newStatus)) return;
    setMovingId(id);
    changeStatus(id, newStatus)
      .then((r) => {
        if (r.ok) {
          setItems((prev) =>
            prev.map((wo) =>
              wo.id === id
                ? {
                    ...wo,
                    status: newStatus as Status,
                    updatedAt: r.data!.updatedAt,
                  }
                : wo,
            ),
          );
        } else {
          setError({ message: r.error.message, requestId: r.requestId });
        }
      })
      .finally(() => setMovingId(null));
  };

  if (loading) return <p className="text-slate-600">Loading…</p>;
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
        <p>{error.message}</p>
        {error.requestId && (
          <p className="text-sm mt-1 font-mono">
            Request ID: {error.requestId}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const count = byStatus(status).length;
          const isDropTarget = dragOverColumn === status;
          return (
            <div
              key={status}
              className={`rounded-lg border-2 bg-slate-50 min-h-[200px] flex flex-col transition-colors ${
                isDropTarget
                  ? "border-slate-800 bg-blue-50/50"
                  : "border-slate-200"
              }`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="p-3 border-b border-slate-200 bg-white rounded-t-lg flex gap-2 items-center">
                <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  {status.replace("_", " ")}
                </h2>
                <p className="text-md font-semibold text-white h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center">{count}</p>
              </div>
              <div className="p-2 flex-1 space-y-2 overflow-y-auto">
                {byStatus(status).map((wo) => (
                  <div
                    key={wo.id}
                    draggable={
                      !!VALID_TRANSITIONS[wo.status]?.length &&
                      movingId !== wo.id
                    }
                    onDragStart={(e) => handleDragStart(e, wo)}
                    onDragEnd={handleDragEnd}
                    className={`rounded border border-slate-200 bg-white p-2 shadow-sm cursor-grab active:cursor-grabbing ${
                      movingId === wo.id ? "opacity-50" : ""
                    } ${!VALID_TRANSITIONS[wo.status]?.length ? "cursor-default" : ""}`}
                  >
                    <Link
                      href={`/workorders/${wo.id}`}
                      className="text-sm text-slate-800 hover:underline line-clamp-2 font-medium"
                      onClick={(e) => movingId && e.preventDefault()}
                    >
                      {wo.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {wo.priority}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
