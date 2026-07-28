export const ALCANCES = [
  { id: "corpo", label: "Corpo-a-corpo", dist: "1 bloco (1,5m)" },
  { id: "curto", label: "Curta Distância", dist: "4 blocos (6m)" },
  { id: "medio", label: "Média Distância", dist: "8 blocos (12m)" },
  { id: "longo", label: "Longa Distância", dist: "12 blocos (18m)" },
  { id: "area", label: "Área", dist: "16 blocos (24m)" },
] as const;

export type AlcanceId = (typeof ALCANCES)[number]["id"];

// Opções extras disponíveis no cadastro (não são alcances "normais")
export const ALCANCE_TAIJUTSU = { id: "taijutsu", label: "Taijutsu (corpo-a-corpo)", dist: "1 bloco (1,5m)" } as const;

interface Cell {
  mod: number | null; // null = sem valor numérico (não tem / acerto garantido)
  obs?: string;
}

// [alcance do jutsu][distância do alvo]
const TABELA: Record<AlcanceId, Record<AlcanceId, Cell>> = {
  corpo: {
    corpo: { mod: 0, obs: "Alcance base do jutsu" },
    curto: { mod: 2 },
    medio: { mod: 3 },
    longo: { mod: 4 },
    area: { mod: null, obs: "Não tem" },
  },
  curto: {
    corpo: { mod: -2, obs: "Rola Acrobacia; em caso de falha recebe 20% de volta" },
    curto: { mod: 0, obs: "Alcance base do jutsu" },
    medio: { mod: 0 },
    longo: { mod: 2 },
    area: { mod: 3 },
  },
  medio: {
    corpo: { mod: -3, obs: "Recebe 50% do dano da própria técnica" },
    curto: { mod: -2, obs: "Rola Acrobacia; em caso de falha recebe 20% de volta" },
    medio: { mod: 0, obs: "Alcance base do jutsu" },
    longo: { mod: 0 },
    area: { mod: 2 },
  },
  longo: {
    corpo: { mod: -4, obs: "Recebe 75% do dano da própria técnica" },
    curto: { mod: -3, obs: "Recebe 50% do dano da própria técnica" },
    medio: { mod: -2, obs: "Rola Acrobacia; em caso de falha recebe 20% de volta" },
    longo: { mod: 0, obs: "Alcance base do jutsu" },
    area: { mod: 0 },
  },
  area: {
    corpo: { mod: null, obs: "Acerto garantido; recebe 100% do dano da própria técnica" },
    curto: { mod: -4, obs: "Recebe 75% do dano da própria técnica" },
    medio: { mod: -3, obs: "Recebe 50% do dano da própria técnica" },
    longo: { mod: -2 },
    area: { mod: 0, obs: "Alcance base do jutsu" },
  },
};

const SELOS_MANUAIS_MOD: Record<string, number> = { I: 2, II: 0, III: -2, IV: -5 };

// Redução de selos pela maestria
const MAESTRIA_REDUCAO: Record<string, number> = { Nula: 0, I: 0, II: 2, III: 0, IV: 3, V: 99 };

export function selosCountEffect(selos: number): { mod: number; label: string; vantagem: boolean } {
  if (selos <= 0) return { mod: -5, label: "0 selos — oponente não nota a formação (igual Selos Manuais IV)", vantagem: false };
  if (selos <= 3) return { mod: 0, label: "1-3 selos — quantidade mínima, sem buff ou debuff", vantagem: false };
  if (selos <= 6) return { mod: 1, label: "4-6 selos — quantidade normal", vantagem: false };
  if (selos <= 9) return { mod: 3, label: "7-9 selos — quantidade alta", vantagem: false };
  if (selos <= 13) return { mod: 5, label: "10-13 selos — quantidade anormal", vantagem: false };
  return { mod: 5, label: "14+ selos — oponente recebe vantagem de roll", vantagem: true };
}

export interface TaticaLinha {
  label: string;
  dist: string;
  total: number | null;
  obs?: string;
  base: number | null;
}

export interface TaticaResultado {
  alcanceJutsu: AlcanceId;
  selosBase: number;
  selosEfetivos: number;
  reducao: number;
  selosManuaisMod: number;
  selosCountMod: number;
  selosCountLabel: string;
  vantagem: boolean;
  bonusTotal: number;
  linhas: TaticaLinha[];
}

export function calcularTatica(params: {
  alcance: string;
  qtdSelos: number;
  maestria: string;
  selosManuais: string;
}): TaticaResultado | null {
  const alcance = params.alcance as AlcanceId;
  if (!TABELA[alcance]) return null;

  const reducaoRaw = MAESTRIA_REDUCAO[params.maestria] ?? 0;
  const selosBase = Math.max(0, params.qtdSelos || 0);
  const reducao = Math.min(reducaoRaw, selosBase);
  const selosEfetivos = Math.max(0, selosBase - reducaoRaw);

  const count = selosCountEffect(selosEfetivos);
  // Com 0 selos o benefício já equivale a Selos Manuais IV — não acumula
  const selosManuaisMod = selosEfetivos === 0 ? 0 : (SELOS_MANUAIS_MOD[params.selosManuais] ?? 0);
  const bonusTotal = count.mod + selosManuaisMod;

  const linhas: TaticaLinha[] = ALCANCES.map((a) => {
    const cell = TABELA[alcance][a.id];
    return {
      label: a.label,
      dist: a.dist,
      base: cell.mod,
      total: cell.mod === null ? null : cell.mod + bonusTotal,
      obs: cell.obs,
    };
  });

  return {
    alcanceJutsu: alcance,
    selosBase,
    selosEfetivos,
    reducao,
    selosManuaisMod,
    selosCountMod: count.mod,
    selosCountLabel: count.label,
    vantagem: count.vantagem,
    bonusTotal,
    linhas,
  };
}

export function fmtMod(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}
