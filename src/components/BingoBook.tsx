import { useState } from "react";

const TOTAL_PAGES = 8;

const BingoBook = () => {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);

  const go = (dir: "next" | "prev") => {
    if (flipping) return;
    if (dir === "next" && page >= TOTAL_PAGES - 1) return;
    if (dir === "prev" && page <= 0) return;
    setFlipping(dir);
    window.setTimeout(() => {
      setPage((p) => (dir === "next" ? p + 1 : p - 1));
      setFlipping(null);
    }, 550);
  };

  const pageStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, hsl(43 55% 84%) 0%, hsl(40 45% 76%) 55%, hsl(36 40% 68%) 100%)",
    boxShadow: "inset 0 0 40px hsl(32 45% 45% / 0.45)",
    color: "hsl(30 35% 22%)",
  };

  return (
    <div className="retro-panel p-4">
      <div className="retro-section-title">Livro Bingo</div>

      <div
        className="relative mx-auto w-full max-w-[560px]"
        style={{ perspective: "1600px" }}
      >
        <div
          className="relative w-full aspect-[3/4] border border-border"
          style={{ transformStyle: "preserve-3d", ...pageStyle }}
        >
          {/* Static current page */}
          <div className="absolute inset-0 p-6 flex flex-col" style={pageStyle}>
            <div className="text-[11px] uppercase tracking-widest opacity-70">
              Livro Bingo
            </div>
            <div className="flex-1" />
            <div className="text-center text-[11px] opacity-70">
              Página {page + 1} / {TOTAL_PAGES}
            </div>
          </div>

          {/* Flipping page */}
          {flipping && (
            <div
              key={`${page}-${flipping}`}
              className="absolute inset-0 p-6"
              style={{
                ...pageStyle,
                transformOrigin: flipping === "next" ? "left center" : "right center",
                animation: `${
                  flipping === "next" ? "bingo-flip-next" : "bingo-flip-prev"
                } 0.55s ease-in-out forwards`,
                backfaceVisibility: "hidden",
              }}
            >
              <div className="text-[11px] uppercase tracking-widest opacity-70">
                Livro Bingo
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes bingo-flip-next {
            from { transform: rotateY(0deg); filter: brightness(1); }
            to { transform: rotateY(-170deg); filter: brightness(0.75); }
          }
          @keyframes bingo-flip-prev {
            from { transform: rotateY(0deg); filter: brightness(1); }
            to { transform: rotateY(170deg); filter: brightness(0.75); }
          }
        `}</style>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          className="retro-button text-xs disabled:opacity-40"
          onClick={() => go("prev")}
          disabled={page === 0 || !!flipping}
        >
          ◀ Anterior
        </button>
        <span className="text-xs text-muted-foreground">
          {page + 1} / {TOTAL_PAGES}
        </span>
        <button
          className="retro-button text-xs disabled:opacity-40"
          onClick={() => go("next")}
          disabled={page === TOTAL_PAGES - 1 || !!flipping}
        >
          Próxima ▶
        </button>
      </div>
    </div>
  );
};

export default BingoBook;
