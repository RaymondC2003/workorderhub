import store from "../data/workorders.store.js";
import { AppError } from "../utils/errors.util.js";
import { randomUUID } from "crypto";

const transitions = {
  NEW: ["IN_PROGRESS"],
  IN_PROGRESS: ["BLOCKED", "DONE"],
  BLOCKED: ["IN_PROGRESS"],
  DONE: []
};

export function create(data) {
  const id = randomUUID();
  const now = new Date().toISOString();

  const workOrder = {
    id,
    status: "NEW",
    createdAt: now,
    updatedAt: now,
    ...data
  };

  store.set(id, workOrder);
  return workOrder;
}

export function list(query) {
  let items = Array.from(store.values());

  const {
    status,
    department,
    priority,
    assignee,
    q,
    page = 1,
    limit = 10
  } = query;

  if (status) {
    items = items.filter(w => w.status === status);
  }

  if (department) {
    items = items.filter(w => w.department === department);
  }

  if (priority) {
    items = items.filter(w => w.priority === priority);
  }

  if (assignee) {
    items = items.filter(w => w.assignee === assignee);
  }

  if (q) {
    items = items.filter(w =>
      w.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + Number(limit));

  return {
    items: paginated,
    page: Number(page),
    limit: Number(limit),
    total
  };
}

export function getById(id) {
  const item = store.get(id);

  if (!item) {
    throw new AppError(404, "NOT_FOUND", "Work order not found");
  }

  return item;
}

export function changeStatus(id, status) {
  const item = getById(id);

  if (!transitions[item.status].includes(status)) {
    throw new AppError(409, "INVALID_TRANSITION", "Invalid transition");
  }

  item.status = status;
  item.updatedAt = new Date().toISOString();

  return item;
}
