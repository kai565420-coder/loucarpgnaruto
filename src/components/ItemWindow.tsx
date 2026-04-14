import ResizableWindow from "./ResizableWindow";

interface Item {
  id: string;
  nome: string;
  descricao: string;
  valor: string;
  peso?: number;
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
  return (
    <ResizableWindow
      title={item.nome}
      icon="🎒"
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
    >
      {item.imagem_url && (
        <img src={item.imagem_url} alt={item.nome} className="w-full max-h-[200px] object-contain border border-border mb-3" />
      )}
      {item.descricao && (
        <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed mb-2">
          {renderBoldText(item.descricao)}
        </div>
      )}
      <div className="flex gap-3 mb-2 items-center">
        {item.valor && (
          <span className="text-sm font-bold text-accent">💰 {item.valor}</span>
        )}
        {(item.peso ?? 0) > 0 && (
          <span className="text-xs text-muted-foreground">⚖️ Peso: {item.peso}</span>
        )}
      </div>
      {admin && (
        <div className="flex gap-2 mt-2 justify-end border-t border-border pt-2">
          {onEdit && <button onClick={onEdit} className="text-[10px] text-muted-foreground hover:text-accent">✏️ Editar</button>}
          {onDelete && <button onClick={onDelete} className="text-[10px] text-muted-foreground hover:text-destructive">🗑️ Deletar</button>}
        </div>
      )}
    </ResizableWindow>
  );
};

export default ItemWindow;
