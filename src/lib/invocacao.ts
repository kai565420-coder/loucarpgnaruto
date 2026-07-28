export const INVOCACAO_PERICIAS = [
  { key: "inv_taijutsu", label: "Taijutsu" },
  { key: "inv_shurikenjutsu", label: "Shurikenjutsu" },
  { key: "inv_reflexos_ninja", label: "Reflexos Ninjas" },
  { key: "inv_furtividade", label: "Furtividade" },
  { key: "inv_kenjutsu", label: "Kenjutsu" },
  { key: "inv_analise_combate", label: "Análise de Combate" },
  { key: "inv_conhecimento_shinobi", label: "Conhecimento Shinobi" },
  { key: "inv_conhecimento_clas", label: "Conhecimento de Clã" },
  { key: "inv_sabotagem", label: "Sabotagem" },
  { key: "inv_genjutsu", label: "Genjutsu" },
  { key: "inv_resistencia_genjutsu", label: "Resistência a Genjutsu" },
  { key: "inv_concentracao", label: "Concentração" },
  { key: "inv_intimidacao", label: "Intimidação" },
  { key: "inv_controle_chakra", label: "Controle de Chakra" },
  { key: "inv_moldagem_elemental", label: "Moldagem Elemental" },
] as const;

export const INVOCACAO_ATRIBUTOS = [
  { key: "inv_forca_fisica", label: "Força Física" },
  { key: "inv_destreza", label: "Destreza" },
] as const;

export const INVOCACAO_NUM_FIELDS = [
  "custo_invocacao",
  "inv_vida_max",
  "inv_sanidade_max",
  "inv_chakra_max",
  ...INVOCACAO_ATRIBUTOS.map((a) => a.key),
  ...INVOCACAO_PERICIAS.map((p) => p.key),
] as string[];
