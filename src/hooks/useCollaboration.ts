import { useEffect, useState } from "react";

export interface User {
  id: number;
  name: string;
  color: string;
  taskId: string;
}

const COLORS = ["#ff4d4f", "#1890ff", "#52c41a", "#fa8c16"];

export function useCollaboration(taskIds: string[]) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (taskIds.length === 0) return;

    // initial users
    const initialUsers: User[] = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      name: `U${i + 1}`,
      color: COLORS[i],
      taskId: taskIds[Math.floor(Math.random() * taskIds.length)],
    }));

    setUsers(initialUsers);

    let timeout: any;

    const moveUsers = () => {
      setUsers((prev) =>
        prev.map((user) => {
          // 🔥 50% chance to move (not always move)
          const shouldMove = Math.random() > 0.5;

          return {
            ...user,
            taskId: shouldMove
              ? taskIds[Math.floor(Math.random() * taskIds.length)]
              : user.taskId,
          };
        })
      );

      // 🔥 random delay (2s to 5s)
      const nextDelay = 2000 + Math.random() * 3000;

      timeout = setTimeout(moveUsers, nextDelay);
    };

    // start movement
    timeout = setTimeout(moveUsers, 3000);

    return () => clearTimeout(timeout);
  }, [taskIds]);

  return users;
}