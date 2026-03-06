import { useState, useCallback } from "react";

export interface FloatingWindow<T> {
  data: T;
  id: string;
  position: { x: number; y: number };
}

export interface MinimizedWindow<T> {
  data: T;
  id: string;
}

export function useFloatingWindows<T>() {
  const [openWindows, setOpenWindows] = useState<FloatingWindow<T>[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<MinimizedWindow<T>[]>([]);

  const openWindow = useCallback((id: string, data: T) => {
    setMinimizedWindows((prev) => prev.filter((m) => m.id !== id));
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === id)) return prev;
      const offset = prev.length * 30;
      return [...prev, { id, data, position: { x: 150 + offset, y: 100 + offset } }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setMinimizedWindows((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => {
      const found = prev.find((w) => w.id === id);
      if (found) {
        setMinimizedWindows((mp) => [...mp.filter((m) => m.id !== id), { id, data: found.data }]);
      }
      return prev.filter((w) => w.id !== id);
    });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setMinimizedWindows((prev) => {
      const found = prev.find((m) => m.id === id);
      if (found) {
        setOpenWindows((op) => {
          if (op.some((w) => w.id === id)) return op;
          const offset = op.length * 30;
          return [...op, { id, data: found.data, position: { x: 150 + offset, y: 100 + offset } }];
        });
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  return { openWindows, minimizedWindows, openWindow, closeWindow, minimizeWindow, restoreWindow };
}
