import { useState } from "react";
import InlineError from "./InlineError";
import type { CreateWorkOrderPayload, UpdateWorkOrderPayload } from "@/services/api";

const DEPARTMENTS = ["FACILITIES", "IT", "SECURITY", "HR"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

type CreateFormProps = {
  onSubmit: (payload: CreateWorkOrderPayload) => void;
  errors?: Record<string, string>;
};

export function WorkOrderCreateForm({ onSubmit, errors = {} }: CreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [assignee, setAssignee] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      department,
      priority,
      requesterName,
      assignee: assignee || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white placeholder:text-slate-500"
          minLength={5}
        />
        {errors.title && <InlineError message={errors.title} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white placeholder:text-slate-500"
          rows={3}
          minLength={10}
        />
        {errors.description && <InlineError message={errors.description} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Department *
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white"
        >
          <option value="">Select</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.department && <InlineError message={errors.department} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Priority *
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white"
        >
          <option value="">Select</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.priority && <InlineError message={errors.priority} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Requester Name *
        </label>
        <input
          type="text"
          value={requesterName}
          onChange={(e) => setRequesterName(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white placeholder:text-slate-500"
          minLength={3}
        />
        {errors.requesterName && <InlineError message={errors.requesterName} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Assignee (optional)
        </label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white placeholder:text-slate-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create
      </button>
    </form>
  );
}

type UpdateFormProps = {
  initial: UpdateWorkOrderPayload;
  onSubmit: (payload: UpdateWorkOrderPayload) => void;
  errors?: Record<string, string>;
};

export function WorkOrderUpdateForm({
  initial,
  onSubmit,
  errors = {},
}: UpdateFormProps) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [priority, setPriority] = useState(initial.priority ?? "");
  const [assignee, setAssignee] = useState(
    initial.assignee === null || initial.assignee === undefined ? "" : String(initial.assignee)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title || undefined,
      description: description || undefined,
      priority: priority || undefined,
      assignee: assignee || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white placeholder:text-slate-500"
          minLength={5}
        />
        {errors.title && <InlineError message={errors.title} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white placeholder:text-slate-500"
          rows={3}
          minLength={10}
        />
        {errors.description && <InlineError message={errors.description} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white"
        >
          <option value="">Select</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.priority && <InlineError message={errors.priority} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Assignee
        </label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 bg-white placeholder:text-slate-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update
      </button>
    </form>
  );
}
