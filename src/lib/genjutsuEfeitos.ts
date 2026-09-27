export const TIPOS_EFEITO = [
  "Medo", "Confusão", "Atordoamento", "Paralisia", "Inconsciência",
  "Alucinação", "Tortura Mental", "Controle", "Distorção Temporal",
] as const;

export const RANKS = ["C", "B", "A", "S"] as const;
export const MAX_PRIMARIOS: Record<string, number> = { C: 1, B: 2, A: 3, S: 4 };

export interface EfeitoGenjutsu {
  tipo: string;
  niveis: [string, string, string, string];
}
export interface GenjutsuEfeitos {
  primarios: EfeitoGenjutsu[];
  secundarios: EfeitoGenjutsu[];
}

export const emptyEfeitos = (): GenjutsuEfeitos => ({ primarios: [], secundarios: [] });
export const novoEfeito = (tipo: string = TIPOS_EFEITO[0]): EfeitoGenjutsu => ({ tipo, niveis: ["", "", "", ""] });

export const parseEfeitos = (raw: any): GenjutsuEfeitos => ({
  primarios: Array.isArray(raw?.primarios) ? raw.primarios : [],
  secundarios: Array.isArray(raw?.secundarios) ? raw.secundarios : [],
});

/** 0–2 sem efeito, 3–5 N1, 6–8 N2, 9–11 N3, 12+ N4 */
export const nivelEfeito = (base: number): number => {
  if (base >= 12) return 4;
  if (base >= 9) return 3;
  if (base >= 6) return 2;
  if (base >= 3) return 1;
  return 0;
};

export const FAIXAS = ["3–5", "6–8", "9–11", "12+"];
