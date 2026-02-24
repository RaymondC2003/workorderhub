import { useState } from "react";
import { useRouter } from "next/router";
import { createWorkOrder } from "@/services/api";
import type { CreateWorkOrderPayload } from "@/services/api";
import { WorkOrderCreateForm } from "@/components/WorkOrderForm";
import ErrorBanner from "@/components/ErrorBanner";
import { detailsToErrors } from "@/utils/errors";
import type { ApiErrorState } from "@/utils/errors";

export default function CreateWorkOrderPage() {
  const router = useRouter();
  const [error, setError] = useState<ApiErrorState | null>(null);

  const handleSubmit = (payload: CreateWorkOrderPayload) => {
    setError(null);
    createWorkOrder(payload).then((r) => {
      if (r.ok) {
        router.push(`/workorders/${r.data!.id}`);
      } else {
        setError({
          message: r.error.message,
          requestId: r.requestId,
          details: r.error.details,
        });
      }
    });
  };

  const formErrors = error?.details ? detailsToErrors(error.details) : {};

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">
        Create Work Order
      </h1>
      {error && (
        <div className="mb-4">
          <ErrorBanner
            message={error.message}
            requestId={error.requestId}
            onDismiss={() => setError(null)}
          />
        </div>
      )}
      <WorkOrderCreateForm onSubmit={handleSubmit} errors={formErrors} />
    </div>
  );
}
