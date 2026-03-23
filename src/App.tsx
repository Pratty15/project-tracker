import { useEffect, useState } from "react";
import { generateTasks } from "./utils/dataGenerator";
import { useTaskStore } from "./store/useTaskStore";

import Kanban from "./components/Kanban/Kanban";
import List from "./components/List/List";
import Timeline from "./components/Timeline/Timeline";
import FilterBar from "./components/Common/FilterBar";

function App() {
  const setTasks = useTaskStore((s) => s.setTasks);
  const tasks = useTaskStore((s) => s.tasks);

  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(generateTasks(500));
    }
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <FilterBar />

      {/* VIEW SWITCH */}
      <div style={{ display: "flex", gap: "10px", margin: "10px" }}>
        <button onClick={() => setView("kanban")} style={getTabStyle(view === "kanban")}>
          Kanban
        </button>
        <button onClick={() => setView("list")} style={getTabStyle(view === "list")}>
          List
        </button>
        <button onClick={() => setView("timeline")} style={getTabStyle(view === "timeline")}>
          Timeline
        </button>
      </div>

      {view === "kanban" && <Kanban />}
      {view === "list" && <List />}
      {view === "timeline" && <Timeline />}
    </div>
  );
}

function getTabStyle(active: boolean) {
  return {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: active ? "#1890ff" : "#eee",
    color: active ? "white" : "black",
    fontWeight: "bold",
  };
}

export default App;