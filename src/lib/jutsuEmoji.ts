export const getJutsuEmoji = (nome: string, categoria?: string | null) => {
  if (categoria === "invocacao") return "🦁";
  if (nome.includes("Fuinjutsu")) return "📜";
  if (nome.includes("Marionete")) return "👹";
  if (nome.includes("Invocação")) return "🦁";
  if (nome.startsWith("Ninjutsu")) return "🌀";
  if (nome.startsWith("Genjutsu")) return "👁️";
  if (nome.startsWith("Taijutsu")) return "💪";
  return "✨";
};
