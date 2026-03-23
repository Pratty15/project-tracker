import type { Task } from "../types/task";

const users = ["A", "B", "C", "D", "E", "F"];
const priorities = ["low", "medium", "high", "critical"] as const;
const statuses = ["todo", "inprogress", "review", "done"] as const;

function randomDate() {
  const start = new Date(2026, 2, 1).getTime();
  const end = new Date(2026, 2, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString();
}

export function generateTasks(count = 500): Task[] {
  return Array.from({ length: count }).map((_, i) => {
    const hasStart = Math.random() > 0.2;

    return {
      id: String(i),
      title: `Task ${i}`,
      assignee: users[Math.floor(Math.random() * users.length)],
      priority: priorities[Math.floor(Math.random() * 4)],
      status: statuses[Math.floor(Math.random() * 4)],
      startDate: hasStart ? randomDate() : undefined,
      dueDate: randomDate(),
    };
  });
}