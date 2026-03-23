import { useState } from "react";

export function useVirtualScroll<T>(
  items: T[],
  rowHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * rowHeight;

  const visibleCount = Math.ceil(containerHeight / rowHeight);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / rowHeight) - 5
  );

  const endIndex = Math.min(
    items.length,
    startIndex + visibleCount + 10
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const offsetY = startIndex * rowHeight;

  return {
    totalHeight,
    visibleItems,
    offsetY,
    setScrollTop,
  };
}