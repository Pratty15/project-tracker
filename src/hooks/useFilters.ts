import { useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useSearchParams } from "react-router-dom";

export function useFilters() {
  const [params, setParams] = useSearchParams();
  const setFilters = useTaskStore((s) => s.setFilters);

  
  useEffect(() => {
    const filters = {
      status: params.get("status")?.split(",").filter(Boolean),
      priority: params.get("priority")?.split(",").filter(Boolean),
      assignee: params.get("assignee")?.split(",").filter(Boolean),
      from: params.get("from") || undefined,
      to: params.get("to") || undefined,
    };

    setFilters(filters);
  }, [params]); 


  const updateURL = (filters: any) => {
    const newParams: any = {};

    if (filters.status?.length)
      newParams.status = filters.status.join(",");
    if (filters.priority?.length)
      newParams.priority = filters.priority.join(",");
    if (filters.assignee?.length)
      newParams.assignee = filters.assignee.join(",");
    if (filters.from) newParams.from = filters.from;
    if (filters.to) newParams.to = filters.to;

    setParams(newParams);
  };

  return { updateURL };
}