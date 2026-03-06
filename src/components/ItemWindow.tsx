import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Item {
  id: string;
  nome: string;
  descricao: string;
  valor: string;
  imagem_url: string | null;
}

interface ItemWindowProps {
  item: Item;
  onClose: () => void;
  onMinimize: () => void;
  initialPosition?: { x: number; y: number };
  admin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-accent text-sm">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const ItemWindow = ({ item, onClose, onMinimize, initialPosition, admin, onEdit, onDelete }: ItemWindowProps) => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dragging) {
      const handleMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      };
      const handleUp = () => setDragging(false);
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
    }
  }, [dragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setDragging(true);
  };

  // Mobile: bottom sheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col">
        <div className="fixed inset-0 bg-black/70" onClick={onClose} />
        <div className="relative z-10 mt-auto bg-card border-t border-border max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
          <div
            className="flex items-center justify-between px-3 py-2 shrink-0"
            style={{
              background: "linear-gradient(180deg, hsl(25 100% 55%) 0%, hsl(25 100% 40%) 100%)",
            }}
          >
            <span className="text-xs font-bold text-primary-foreground truncate flex-1">
              🎒 {item.nome}
            </span>
            <div className="flex gap-1">
              <button onClick={onMinimize} className="px-2 py-0.5 text-[10px] bg-black/30 text-primary-foreground border border-black/20">_</button>
              <button onClick={onClose} className="px-2 py-0.5 text-[10px] bg-black/30 text-primary-foreground border border-black/20">✕</button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-3">
            {item.imagem_url && (
              <img src={item.imagem_url} alt={item.nome} className="w-full max-h-[200px] object-contain border border-border mb-3" />
            )}
            {item.descricao && (
              <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed mb-2">
                {renderBoldText(item.descricao)}
              </div>
            )}
            {item.valor && (
              <div className="mb-2">
                <span className="text-sm font-bold text-accent">💰 {item.valor}</span>
              </div>
            )}
            {admin && (
              <div className="flex gap-2 mt-2 justify-end border-t border-border pt-2">
                {onEdit && <button onClick={onEdit} className="text-[10px] text-muted-foreground hover:text-accent">✏️ Editar</button>}
                {onDelete && <button onClick={onDelete} className="text-[10px] text-muted-foreground hover:text-destructive">🗑️ Deletar</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: draggable window
  return (
    <div
      ref={windowRef}
      className="fixed z-50 shadow-2xl"
      style={{ left: position.x, top: position.y, width: 380, maxHeight: "70vh" }}
    >
      <div
        className="flex items-center justify-between px-2 py-1 cursor-move select-none"
        onMouseDown={handleMouseDown}
        style={{
          background: "linear-gradient(180deg, hsl(25 100% 55%) 0%, hsl(25 100% 40%) 100%)",
          borderBottom: "1px solid hsl(25 100% 30%)",
        }}
      >
        <span className="text-[11px] font-bold text-primary-foreground truncate flex-1">
          🎒 {item.nome}
        </span>
        <div className="flex gap-1 shrink-0">
          <button onClick={onMinimize} className="w-5 h-4 text-[10px] bg-black/30 text-primary-foreground border border-black/20 flex items-center justify-center hover:bg-black/50">_</button>
          <button onClick={onClose} className="w-5 h-4 text-[10px] bg-black/30 text-primary-foreground border border-black/20 flex items-center justify-center hover:bg-black/50">✕</button>
        </div>
      </div>
      <div className="bg-card border border-border border-t-0 overflow-y-auto" style={{ maxHeight: "calc(70vh - 28px)" }}>
        <div className="p-3">
          {item.imagem_url && (
            <img src={item.imagem_url} alt={item.nome} className="w-full max-h-[200px] object-contain border border-border mb-3" />
          )}
          {item.descricao && (
            <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed mb-2">
              {renderBoldText(item.descricao)}
            </div>
          )}
          {item.valor && (
            <div className="mb-2">
              <span className="text-sm font-bold text-accent">💰 {item.valor}</span>
            </div>
          )}
          {admin && (
            <div className="flex gap-2 mt-2 justify-end border-t border-border pt-2">
              {onEdit && <button onClick={onEdit} className="text-[10px] text-muted-foreground hover:text-accent">✏️ Editar</button>}
              {onDelete && <button onClick={onDelete} className="text-[10px] text-muted-foreground hover:text-destructive">🗑️ Deletar</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemWindow;
