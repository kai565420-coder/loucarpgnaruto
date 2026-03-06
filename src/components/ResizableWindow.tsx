import { useState, useRef, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResizableWindowProps {
  title: string;
  icon: string;
  onClose: () => void;
  onMinimize: () => void;
  initialPosition?: { x: number; y: number };
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

const ResizableWindow = ({
  title,
  icon,
  onClose,
  onMinimize,
  initialPosition,
  children,
  minWidth = 250,
  minHeight = 200,
  defaultWidth = 380,
  defaultHeight = 400,
}: ResizableWindowProps) => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag
  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [dragging]);

  // Resize
  useEffect(() => {
    if (!resizing) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      const dir = resizing;

      let newW = resizeStart.current.width;
      let newH = resizeStart.current.height;
      let newX = resizeStart.current.posX;
      let newY = resizeStart.current.posY;

      if (dir.includes("e")) newW = Math.max(minWidth, resizeStart.current.width + dx);
      if (dir.includes("w")) {
        newW = Math.max(minWidth, resizeStart.current.width - dx);
        newX = resizeStart.current.posX + (resizeStart.current.width - newW);
      }
      if (dir.includes("s")) newH = Math.max(minHeight, resizeStart.current.height + dy);
      if (dir.includes("n")) {
        newH = Math.max(minHeight, resizeStart.current.height - dy);
        newY = resizeStart.current.posY + (resizeStart.current.height - newH);
      }

      setSize({ width: newW, height: newH });
      setPosition({ x: newX, y: newY });
    };
    const handleUp = () => setResizing(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [resizing, minWidth, minHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setDragging(true);
  };

  const startResize = useCallback((dir: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height, posX: position.x, posY: position.y };
    setResizing(dir);
  }, [size, position]);

  const cursorMap: Record<string, string> = {
    n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
    ne: "nesw-resize", sw: "nesw-resize", nw: "nwse-resize", se: "nwse-resize",
  };

  // Mobile: bottom sheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col">
        <div className="fixed inset-0 bg-black/70" onClick={onClose} />
        <div className="relative z-10 mt-auto bg-card border-t border-border max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
          <div
            className="flex items-center justify-between px-3 py-2 shrink-0"
            style={{ background: "linear-gradient(180deg, hsl(25 100% 55%) 0%, hsl(25 100% 40%) 100%)" }}
          >
            <span className="text-xs font-bold text-primary-foreground truncate flex-1">
              {icon} {title}
            </span>
            <div className="flex gap-1">
              <button onClick={onMinimize} className="px-2 py-0.5 text-[10px] bg-black/30 text-primary-foreground border border-black/20">_</button>
              <button onClick={onClose} className="px-2 py-0.5 text-[10px] bg-black/30 text-primary-foreground border border-black/20">✕</button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-3">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: draggable + resizable
  const edges = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
  return (
    <div
      ref={windowRef}
      className="fixed z-50 shadow-2xl"
      style={{ left: position.x, top: position.y, width: size.width, height: size.height }}
    >
      {/* Resize handles */}
      {edges.map((dir) => {
        const style: React.CSSProperties = { position: "absolute", zIndex: 10, cursor: cursorMap[dir] };
        const sz = 6;
        if (dir === "n") Object.assign(style, { top: -sz / 2, left: sz, right: sz, height: sz });
        if (dir === "s") Object.assign(style, { bottom: -sz / 2, left: sz, right: sz, height: sz });
        if (dir === "e") Object.assign(style, { right: -sz / 2, top: sz, bottom: sz, width: sz });
        if (dir === "w") Object.assign(style, { left: -sz / 2, top: sz, bottom: sz, width: sz });
        if (dir === "ne") Object.assign(style, { top: -sz / 2, right: -sz / 2, width: sz * 2, height: sz * 2 });
        if (dir === "nw") Object.assign(style, { top: -sz / 2, left: -sz / 2, width: sz * 2, height: sz * 2 });
        if (dir === "se") Object.assign(style, { bottom: -sz / 2, right: -sz / 2, width: sz * 2, height: sz * 2 });
        if (dir === "sw") Object.assign(style, { bottom: -sz / 2, left: -sz / 2, width: sz * 2, height: sz * 2 });
        return <div key={dir} style={style} onMouseDown={startResize(dir)} />;
      })}

      {/* Title bar */}
      <div
        className="flex items-center justify-between px-2 py-1 cursor-move select-none"
        onMouseDown={handleMouseDown}
        style={{
          background: "linear-gradient(180deg, hsl(25 100% 55%) 0%, hsl(25 100% 40%) 100%)",
          borderBottom: "1px solid hsl(25 100% 30%)",
        }}
      >
        <span className="text-[11px] font-bold text-primary-foreground truncate flex-1">
          {icon} {title}
        </span>
        <div className="flex gap-1 shrink-0">
          <button onClick={onMinimize} className="w-5 h-4 text-[10px] bg-black/30 text-primary-foreground border border-black/20 flex items-center justify-center hover:bg-black/50">_</button>
          <button onClick={onClose} className="w-5 h-4 text-[10px] bg-black/30 text-primary-foreground border border-black/20 flex items-center justify-center hover:bg-black/50">✕</button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border border-t-0 overflow-y-auto" style={{ height: "calc(100% - 28px)" }}>
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResizableWindow;
