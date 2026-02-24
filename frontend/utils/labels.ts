const WORK_ORDER_LABELS: Record<string, string> = {
  id: "ID",
  title: "Title",
  description: "Description",
  department: "Department",
  priority: "Priority",
  status: "Status",
  requesterName: "Requester",
  assignee: "Assignee",
  createdAt: "Created",
  updatedAt: "Updated",
};

export function getWorkOrderFieldLabel(key: string): string {
  return WORK_ORDER_LABELS[key] ?? key;
}
