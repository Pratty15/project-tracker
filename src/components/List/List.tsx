import { useRef, useState } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import { useVirtualScroll } from "../../hooks/useVirtualScroll";
import type { Task } from "../../types/task";

const ROW_HEIGHT = 60;
const CONTAINER_HEIGHT = 500;

export default function List() {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);

  const filteredTasks = tasks.filter((task) => {
    if (filters.status?.length && !filters.status.includes(task.status)) return false;
    if (filters.priority?.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee?.length && !filters.assignee.includes(task.assignee)) return false;
    if (filters.from && new Date(task.dueDate) < new Date(filters.from)) return false;
    if (filters.to && new Date(task.dueDate) > new Date(filters.to)) return false;
    return true;
  });

  // SORT STATE
  const [sortBy, setSortBy] = useState<"title" | "priority" | "dueDate" | null>(null);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  // SORT FUNCTION
  function sortTasks(tasks: Task[]) {
    if (!sortBy) return tasks;

    const sorted = [...tasks].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);

      if (sortBy === "priority") {
        const order = ["critical", "high", "medium", "low"];
        return order.indexOf(a.priority) - order.indexOf(b.priority);
      }

      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      return 0;
    });

    return direction === "asc" ? sorted : sorted.reverse();
  }

  const sortedTasks = sortTasks(filteredTasks);
const containerRef = useRef<HTMLDivElement | null>(null);

  const { totalHeight, visibleItems, offsetY, setScrollTop } =
    useVirtualScroll<Task>(sortedTasks, ROW_HEIGHT, CONTAINER_HEIGHT);

  return (
    <div>
      <h2>List View</h2>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderBottom: "2px solid black",
          fontWeight: "bold",
        }}
      >
        <Header label="Title" field="title" sortBy={sortBy} direction={direction} setSortBy={setSortBy} setDirection={setDirection} />
        <Header label="Priority" field="priority" sortBy={sortBy} direction={direction} setSortBy={setSortBy} setDirection={setDirection} />
        <Header label="Assignee" field={null} sortBy={sortBy} direction={direction} setSortBy={setSortBy} setDirection={setDirection} />
        <Header label="Status" field={null} sortBy={sortBy} direction={direction} setSortBy={setSortBy} setDirection={setDirection} />
        <Header label="Due Date" field="dueDate" sortBy={sortBy} direction={direction} setSortBy={setSortBy} setDirection={setDirection} />
      </div>

      {/* SCROLL */}
      <div
        ref={containerRef}
        style={{
          height: CONTAINER_HEIGHT,
          overflowY: "auto",
          border: "1px solid black",
        }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: "absolute",
              width: "100%",
            }}
          >
            {visibleItems.map((task) => (
              <Row key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// HEADER
function Header({
  label,
  field,
  sortBy,
  direction,
  setSortBy,
  setDirection,
}: any) {
  return (
    <div
      style={{ flex: 1, cursor: field ? "pointer" : "default" }}
      onClick={() => {
        if (!field) return;

        setSortBy((prev: any) => {
          if (prev === field) {
            setDirection((d: any) => (d === "asc" ? "desc" : "asc"));
            return prev;
          }
          setDirection("asc");
          return field;
        });
      }}
    >
      {label}
      {sortBy === field && (direction === "asc" ? " ↑" : " ↓")}
    </div>
  );
}

// ROW
function Row({ task }: { task: Task }) {
  const updateTask = useTaskStore((s) => s.updateTask);

  return (
    <div
      style={{
        height: ROW_HEIGHT,
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
      }}
    >
      <div style={{ flex: 1 }}>{task.title}</div>
      <div style={{ flex: 1 }}>{task.priority}</div>
      <div style={{ flex: 1 }}>{task.assignee}</div>

      <div style={{ flex: 1 }}>
        <select
          value={task.status}
          onChange={(e) =>
            updateTask(task.id, {
              status: e.target.value as any,
            })
          }
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="review">In Review</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div style={{ flex: 1 }}>
        {new Date(task.dueDate).toLocaleDateString()}
      </div>
    </div>
  );
}