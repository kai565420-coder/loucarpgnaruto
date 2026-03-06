import ResizableWindow from "./ResizableWindow";

interface Jutsu {
  id: string;
  nome: string;
  informacoes: string;
  imagem_url: string | null;
}

interface JutsuWindowProps {
  jutsu: Jutsu;
  onClose: () => void;
  onMinimize: () => void;
  initialPosition?: { x: number; y: number };
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

const JutsuWindow = ({ jutsu, onClose, onMinimize, initialPosition }: JutsuWindowProps) => {
  return (
    <ResizableWindow
      title={jutsu.nome}
      icon="🌀"
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
    >
      {jutsu.imagem_url && (
        <img src={jutsu.imagem_url} alt={jutsu.nome} className="w-full max-h-[200px] object-contain border border-border mb-3" />
      )}
      <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
        {renderBoldText(jutsu.informacoes || "Sem informações.")}
      </div>
    </ResizableWindow>
  );
};

export default JutsuWindow;
