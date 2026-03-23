import { useTaskStore } from "../../store/useTaskStore";
import {
  getMonthStart,
  getDaysInMonth,
  diffInDays,
} from "../../utils/dateUtils";

const DAY_WIDTH = 40;

export default function Timeline() {
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

  const today = new Date();
  const monthStart = getMonthStart(today);
  const totalDays = getDaysInMonth(today);
  const todayOffset = diffInDays(monthStart, today);

  return (
    <div>
      <h2>Timeline View</h2>

      <div style={{ overflowX: "auto", border: "1px solid black" }}>
        <div style={{ position: "relative", width: totalDays * DAY_WIDTH }}>
          
          {/* DAYS */}
          <div style={{ display: "flex" }}>
            {Array.from({ length: totalDays }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: DAY_WIDTH,
                  borderRight: "1px solid #ddd",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* TODAY LINE */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: todayOffset * DAY_WIDTH,
              width: "2px",
              height: "100%",
              background: "red",
            }}
          />

          {/* TASKS */}
          {filteredTasks.map((task) => {
            const start = task.startDate
              ? new Date(task.startDate)
              : new Date(task.dueDate);

            const end = new Date(task.dueDate);

            const startOffset = diffInDays(monthStart, start);
            const duration = Math.max(1, diffInDays(start, end));

            return (
              <div
                key={task.id}
                style={{
                  position: "relative",
                  height: "50px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: startOffset * DAY_WIDTH,
                    width: duration * DAY_WIDTH,
                    height: "30px",
                    top: "10px",
                    background: getPriorityColor(task.priority),
                    borderRadius: "4px",
                    padding: "2px",
                    fontSize: "12px",
                    color: "white",
                    overflow: "hidden",
                  }}
                >
                  {task.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "critical":
      return "#ff4d4f";
    case "high":
      return "#fa8c16";
    case "medium":
      return "#1890ff";
    case "low":
      return "#52c41a";
    default:
      return "#ccc";
  }
}