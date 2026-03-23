import { useTaskStore } from "../../store/useTaskStore";
import { useFilters } from "../../hooks/useFilters";

export default function FilterBar() {
  const filters = useTaskStore((s) => s.filters);
  const setFilters = useTaskStore((s) => s.setFilters);
  const { updateURL } = useFilters();

  const update = (newFilters: any) => {
    setFilters(newFilters);
    updateURL(newFilters);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px",
        background: "#fafafa",
        borderBottom: "1px solid #ddd",
      }}
    >
      <select
        multiple
        value={filters.status || []}
        onChange={(e) =>
          update({
            ...filters,
            status: Array.from(e.target.selectedOptions).map((o) => o.value),
          })
        }
        style={inputStyle}
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>

      <select
        multiple
        value={filters.priority || []}
        onChange={(e) =>
          update({
            ...filters,
            priority: Array.from(e.target.selectedOptions).map((o) => o.value),
          })
        }
        style={inputStyle}
      >
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <input
        type="date"
        value={filters.from || ""}
        onChange={(e) => update({ ...filters, from: e.target.value })}
        style={inputStyle}
      />

      <input
        type="date"
        value={filters.to || ""}
        onChange={(e) => update({ ...filters, to: e.target.value })}
        style={inputStyle}
      />

      {Object.keys(filters).length > 0 && (
        <button onClick={() => update({})} style={clearBtn}>
          Clear
        </button>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "6px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const clearBtn = {
  padding: "6px 12px",
  background: "#ff4d4f",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};