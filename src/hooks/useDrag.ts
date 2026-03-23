import { useState, useRef, useEffect } from "react";
import type { Task } from "../types/task";

interface DragState {
  task: Task | null;
  sourceColumn: string | null;
  offsetX: number;
  offsetY: number;
}

export function useDrag() {
  const [drag, setDrag] = useState<DragState>({
    task: null,
    sourceColumn: null,
    offsetX: 0,
    offsetY: 0,
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const isDragging = useRef(false);

  // 🔹 Pointer Move
  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging.current) return;

    setPosition({
      x: e.clientX,
      y: e.clientY,
    });

    // 🔥 Detect column under cursor
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const column = element?.closest("[data-column]") as HTMLElement | null;

    if (column) {
      setHoveredColumn(column.dataset.column || null);
    } else {
      setHoveredColumn(null);
    }
  };

  // 🔹 Pointer Up
  const handlePointerUp = () => {
    isDragging.current = false;

    setDrag({
      task: null,
      sourceColumn: null,
      offsetX: 0,
      offsetY: 0,
    });

    setHoveredColumn(null);

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  // 🔹 Start Drag
  const startDrag = (
    e: React.PointerEvent,
    task: Task,
    column: string
  ) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    isDragging.current = true;

    setDrag({
      task,
      sourceColumn: column,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });

    setPosition({
      x: e.clientX,
      y: e.clientY,
    });

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // 🔹 Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return {
    drag,
    position,
    hoveredColumn,
    startDrag,
    endDrag: handlePointerUp,
  };
}