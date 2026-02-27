export const getJutsuEmoji = (nome: string) => {
  if (nome.startsWith("Ninjutsu")) return "🌀";
  if (nome.startsWith("Genjutsu")) return "👁️";
  if (nome.startsWith("Taijutsu")) return "💪";
  return "🐱‍👤";
};
