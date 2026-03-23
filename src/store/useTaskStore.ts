import { create } from "zustand";
import type { Task } from "../types/task";

interface Filters {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  from?: string;
  to?: string;
}

interface TaskState {
  tasks: Task[];
  filters: Filters;

  setTasks: (tasks: Task[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setFilters: (filters: Filters) => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filters: {},

  setTasks: (tasks) => set({ tasks }),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  setFilters: (filters) => set({ filters }),

  // 🔥 FILTER LOGIC
  getFilteredTasks: () => {
    const { tasks, filters } = get();

    return tasks.filter((task) => {
      if (
        filters.status &&
        filters.status.length &&
        !filters.status.includes(task.status)
      )
        return false;

      if (
        filters.priority &&
        filters.priority.length &&
        !filters.priority.includes(task.priority)
      )
        return false;

      if (
        filters.assignee &&
        filters.assignee.length &&
        !filters.assignee.includes(task.assignee)
      )
        return false;

      if (filters.from) {
        if (new Date(task.dueDate) < new Date(filters.from))
          return false;
      }

      if (filters.to) {
        if (new Date(task.dueDate) > new Date(filters.to))
          return false;
      }

      return true;
    });
  },
}));