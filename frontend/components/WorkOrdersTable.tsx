import Link from "next/link";
import type { WorkOrder } from "@/types/workorder";

type WorkOrdersTableProps = {
  items: WorkOrder[];
};

export default function WorkOrdersTable({ items }: WorkOrdersTableProps) {
  if (items.length === 0) {
    return (
      <p className="text-slate-500 py-8 text-center">No work orders found.</p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
              Department
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
              Requester
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map((wo) => (
            <tr key={wo.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 text-sm text-slate-900">{wo.title}</td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {wo.department}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                    wo.priority === "HIGH"
                      ? "bg-red-100 text-red-800"
                      : wo.priority === "MEDIUM"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {wo.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
                  {wo.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {wo.requesterName}
              </td>
              <td className="px-4 py-3 text-sm">
                <Link
                  href={`/workorders/${wo.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
