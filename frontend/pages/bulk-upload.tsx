import { useState } from "react";
import { bulkUploadCsv } from "@/services/api";
import type { BulkUploadResult } from "@/services/api";
import CsvUpload from "@/components/CsvUpload";
import UploadResult from "@/components/UploadResult";
import ErrorBanner from "@/components/ErrorBanner";
import type { ApiErrorState } from "@/utils/errors";

export default function BulkUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [error, setError] = useState<ApiErrorState | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    setResult(null);
    setUploading(true);
    bulkUploadCsv(file).then((r) => {
      if (r.ok) {
        setResult(r.data!);
      } else {
        setError({
          message: r.error.message,
          requestId: r.requestId,
        });
      }
    }).finally(() => setUploading(false));
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-4">
        Bulk Upload (CSV)
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
      <CsvUpload onFileSelect={handleFileSelect} uploading={uploading} />
      {result && (
        <div className="mt-6">
          <UploadResult result={result} />
        </div>
      )}
    </div>
  );
}
