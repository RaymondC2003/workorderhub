import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import {
  getWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
} from "@/services/api";
import type { WorkOrder } from "@/types/workorder";
import type { UpdateWorkOrderPayload } from "@/services/api";
import { WorkOrderUpdateForm } from "@/components/WorkOrderForm";
import ErrorBanner from "@/components/ErrorBanner";
import Modal from "@/components/Modal";
import { detailsToErrors } from "@/utils/errors";
import type { ApiErrorState } from "@/utils/errors";
import { getWorkOrderFieldLabel } from "@/utils/labels";

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [wo, setWo] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorState | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    getWorkOrder(id)
      .then((r) => {
        if (r.ok) setWo(r.data!);
        else
          setError({
            message: r.error.message,
            requestId: r.requestId,
          });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = (payload: UpdateWorkOrderPayload) => {
    if (!id) return;
    setError(null);
    setUpdating(true);
    updateWorkOrder(id, payload)
      .then((r) => {
        if (r.ok) {
          setWo(r.data!);
          setEditModalOpen(false);
        } else {
          setError({
            message: r.error.message,
            requestId: r.requestId,
            details: r.error.details,
          });
        }
      })
      .finally(() => setUpdating(false));
  };

  const handleDelete = () => {
    if (!id || !confirm("Delete this work order?")) return;
    deleteWorkOrder(id).then((r) => {
      if (r.ok) router.push("/workorders");
      else
        setError({
          message: r.error.message,
          requestId: r.requestId,
        });
    });
  };

  if (loading || !id) return <p className="text-slate-600">Loading…</p>;
  if (!wo) {
    return (
      <div>
        {error && (
          <ErrorBanner
            message={error.message}
            requestId={error.requestId}
            onDismiss={() => setError(null)}
          />
        )}
        <p className="text-slate-600">Work order not found.</p>
      </div>
    );
  }

  const formErrors = error?.details ? detailsToErrors(error.details) : {};

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">{wo.title}</h1>
      {error && (
        <ErrorBanner
          message={error.message}
          requestId={error.requestId}
          onDismiss={() => setError(null)}
        />
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium text-slate-800">Details</h2>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setEditModalOpen(true);
            }}
            className="text-sm bg-slate-700 text-white px-3 py-1.5 rounded hover:bg-slate-800"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {Object.entries(wo).map(([key, value]) => (
            <Fragment key={key}>
              <dt className="text-slate-500">{getWorkOrderFieldLabel(key)}</dt>
              <dd
                className={`${key === "id" ? "font-mono " : ""}text-slate-700 ${key === "description" ? "sm:col-span-2" : ""}`}
              >
                {value == null || value === "" ? "—" : String(value)}
              </dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit work order"
      >
        {error && (
          <div className="mb-4">
            <ErrorBanner
              message={error.message}
              requestId={error.requestId}
              onDismiss={() => setError(null)}
            />
          </div>
        )}
        <WorkOrderUpdateForm
          initial={{
            title: wo.title,
            description: wo.description,
            priority: wo.priority,
            assignee: wo.assignee ?? null,
          }}
          onSubmit={handleUpdate}
          errors={formErrors}
        />
      </Modal>

      <section>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete work order
        </button>
      </section>
    </div>
  );
}
