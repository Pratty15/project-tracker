import { useEffect } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import { useDrag } from "../../hooks/useDrag";
import { useCollaboration } from "../../hooks/useCollaboration";
import type { Task } from "../../types/task";
import type { User } from "../../hooks/useCollaboration";

const columns: string[] = ["todo", "inprogress", "review", "done"];

export default function Kanban() {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const updateTask = useTaskStore((s) => s.updateTask);

  const { drag, position, hoveredColumn, startDrag, endDrag } = useDrag();

  //  FILTER LOGIC
  const filteredTasks: Task[] = tasks.filter((task) => {
    if (filters.status?.length && !filters.status.includes(task.status)) return false;
    if (filters.priority?.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee?.length && !filters.assignee.includes(task.assignee)) return false;
    if (filters.from && new Date(task.dueDate) < new Date(filters.from)) return false;
    if (filters.to && new Date(task.dueDate) > new Date(filters.to)) return false;
    return true;
  });

  //  Collaboration users
  const taskIds: string[] = filteredTasks.map((t) => t.id);
  const users: User[] = useCollaboration(taskIds);

  // Group tasks
  const grouped: Record<string, Task[]> = {
    todo: [],
    inprogress: [],
    review: [],
    done: [],
  };

  filteredTasks.forEach((t) => grouped[t.status].push(t));

  const handleDrop = () => {
    if (!drag.task) return;

    if (hoveredColumn) {
      updateTask(drag.task.id, {
        status: hoveredColumn as Task["status"],
      });
    }

    endDrag();
  };

  useEffect(() => {
    window.addEventListener("pointerup", handleDrop);
    return () => window.removeEventListener("pointerup", handleDrop);
  }, [drag, hoveredColumn]);

  return (
    <div>

      {/*  VIEWERS BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px",
        }}
      >
        {users.map((u: User) => (
          <div
            key={u.id}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: u.color,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {u.name}
          </div>
        ))}
        <span>{users.length} people viewing</span>
      </div>

      {/* COLUMNS */}
      <div style={{ display: "flex", gap: "10px" }}>
        {columns.map((col) => (
          <div
            key={col}
            data-column={col}
            style={{
              width: "250px",
              height: "80vh",
              border: "1px solid gray",
              overflowY: "auto",
              background: hoveredColumn === col ? "#e6f7ff" : "#f9f9f9",
              borderRadius: "8px",
              padding: "5px",
            }}
          >
            <h3>
              {col} ({grouped[col].length})
            </h3>

            {grouped[col].map((task) => {
              const isDragging = drag.task?.id === task.id;

              const activeUsers: User[] = users.filter(
                (u: User) => u.taskId === task.id
              );

              return (
                <div key={task.id}>
                  {/* Placeholder */}
                  {isDragging && (
                    <div
                      style={{
                        height: "60px",
                        margin: "5px",
                        background: "#ddd",
                        borderRadius: "4px",
                      }}
                    />
                  )}

                  {/* Card */}
                  <div
                    onPointerDown={(e) => startDrag(e, task, col)}
                    style={{
                      padding: "10px",
                      margin: "8px",
                      borderRadius: "8px",
                      background: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid #eee",
                      opacity: isDragging ? 0.3 : 1,
                      cursor: "grab",
                    }}
                  >
                    <p>{task.title}</p>

                    {/* PRIORITY BADGE */}
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        background: getPriorityColor(task.priority),
                        color: "white",
                      }}
                    >
                      {task.priority}
                    </span>

                    {/* USERS ON TASK */}
                    <div style={{ display: "flex", marginTop: "5px" }}>
                      {activeUsers.slice(0, 2).map((u: User) => (
                        <div
                          key={u.id}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: u.color,
                            color: "white",
                            fontSize: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "-5px",
                            border: "2px solid white",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          {u.name}
                        </div>
                      ))}

                      {activeUsers.length > 2 && (
                        <div style={{ fontSize: "10px", marginLeft: "5px" }}>
                          +{activeUsers.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* DRAG PREVIEW */}
      {drag.task && (
        <div
          style={{
            position: "fixed",
            top: position.y - drag.offsetY,
            left: position.x - drag.offsetX,
            pointerEvents: "none",
            background: "white",
            padding: "10px",
            border: "1px solid black",
            borderRadius: "6px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {drag.task.title}
        </div>
      )}
    </div>
  );
}

// 🎨 Priority colors
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