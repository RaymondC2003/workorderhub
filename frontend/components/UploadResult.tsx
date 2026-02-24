import type { BulkUploadResult } from "@/services/api";

type UploadResultProps = {
  result: BulkUploadResult;
};

export default function UploadResult({ result }: UploadResultProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-medium text-slate-800 mb-2">Upload summary</h3>
        <p className="text-sm text-slate-600">
          <strong>Request ID:</strong>{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">
            {result.uploadId}
          </code>
        </p>
        <ul className="mt-2 text-sm text-slate-600 space-y-0.5">
          <li>Strategy: {result.strategy}</li>
          <li>Total rows: {result.totalRows}</li>
          <li>Accepted: {result.accepted}</li>
          <li>Rejected: {result.rejected}</li>
        </ul>
      </div>
      {result.errors.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 overflow-hidden">
          <h3 className="font-medium text-amber-900 px-4 py-2 border-b border-amber-200">
            Row-level errors
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-amber-100/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-amber-900">
                    Row
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-amber-900">
                    Field
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-amber-900">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {result.errors.map((err, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-sm text-amber-900">
                      {err.row}
                    </td>
                    <td className="px-4 py-2 text-sm text-amber-800">
                      {err.field}
                    </td>
                    <td className="px-4 py-2 text-sm text-amber-800">
                      {err.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
