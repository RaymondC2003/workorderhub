import type { ListWorkOrdersQuery } from "@/services/api";

type FilterBarProps = {
  query: ListWorkOrdersQuery;
  total: number;
  onQueryChange: (q: ListWorkOrdersQuery) => void;
};

const DEPARTMENTS = ["FACILITIES", "IT", "SECURITY", "HR"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const STATUSES = ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"];

export default function FilterBar({
  query,
  total,
  onQueryChange,
}: FilterBarProps) {
  const set = (key: keyof ListWorkOrdersQuery, value: string | number | undefined) => {
    onQueryChange({ ...query, [key]: value });
  };
  return (
    <div className="flex flex-wrap items-end gap-4 mb-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Search</span>
        <input
          type="text"
          placeholder="Title keyword"
          value={query.q ?? ""}
          onChange={(e) => set("q", e.target.value || undefined)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-48 text-slate-900 bg-white placeholder:text-slate-500"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Status</span>
        <select
          value={query.status ?? ""}
          onChange={(e) => set("status", e.target.value || undefined)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-36 text-slate-900 bg-white"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Department</span>
        <select
          value={query.department ?? ""}
          onChange={(e) => set("department", e.target.value || undefined)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-36 text-slate-900 bg-white"
        >
          <option value="">All</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Priority</span>
        <select
          value={query.priority ?? ""}
          onChange={(e) => set("priority", e.target.value || undefined)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-36 text-slate-900 bg-white"
        >
          <option value="">All</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Assignee</span>
        <input
          type="text"
          placeholder="Filter by assignee"
          value={query.assignee ?? ""}
          onChange={(e) => set("assignee", e.target.value || undefined)}
          className="border border-slate-300 rounded px-3 py-2 text-sm w-36 text-slate-900 bg-white placeholder:text-slate-500"
        />
      </label>
      <div className="text-sm text-slate-600 ml-2">
        Total: <strong>{total}</strong>
      </div>
    </div>
  );
}
