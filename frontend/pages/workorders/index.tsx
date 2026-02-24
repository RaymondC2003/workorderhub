import { useEffect, useState } from "react";
import { listWorkOrders } from "@/services/api";
import type { ListWorkOrdersQuery } from "@/services/api";
import type { WorkOrder } from "@/types/workorder";
import WorkOrdersTable from "@/components/WorkOrdersTable";
import FilterBar from "@/components/FilterBar";
import ErrorBanner from "@/components/ErrorBanner";
import type { ApiErrorState } from "@/utils/errors";

const DEFAULT_LIMIT = 10;

export default function WorkOrdersListPage() {
  const [query, setQuery] = useState<ListWorkOrdersQuery>({
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [items, setItems] = useState<WorkOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorState | null>(null);

  useEffect(() => {
    setLoading(true);
    listWorkOrders(query)
      .then((r) => {
        if (r.ok) {
          setItems(r.data.items);
          setTotal(r.data.total);
          setError(null);
        } else {
          setError({
            message: r.error.message,
            requestId: r.requestId,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [query.status, query.department, query.priority, query.assignee, query.q, query.page, query.limit]);

  const handleQueryChange = (q: ListWorkOrdersQuery) => {
    setQuery({ ...q, page: 1, limit: query.limit ?? DEFAULT_LIMIT });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">
        Work Orders
      </h1>
      {error && (
        <ErrorBanner
          message={error.message}
          requestId={error.requestId}
          onDismiss={() => setError(null)}
        />
      )}
      <FilterBar
        query={query}
        total={total}
        onQueryChange={handleQueryChange}
      />
      {loading ? (
        <p className="text-slate-600">Loading…</p>
      ) : (
        <>
          <WorkOrdersTable items={items} />
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setQuery((q) => ({ ...q, page: Math.max(1, (q.page ?? 1) - 1) }))
              }
              disabled={(query.page ?? 1) <= 1}
              className="text-blue-600 hover:underline disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {query.page ?? 1} of{" "}
              {Math.ceil(total / (query.limit ?? DEFAULT_LIMIT)) || 1}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))
              }
              disabled={
                (query.page ?? 1) >=
                Math.ceil(total / (query.limit ?? DEFAULT_LIMIT))
              }
              className="text-blue-600 hover:underline disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
