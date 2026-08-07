export const BOSSES = [
  // Bosses Iniciais (12)
  { name: "Dorian Rex", over: 78, category: "inicial" },
  { name: "Damien Holt", over: 80, category: "inicial" },
  { name: "Kieran Blackthorn", over: 82, category: "inicial" },
  { name: "Dominic Vexley", over: 83, category: "inicial" },
  { name: "Armani Williams", over: 84, category: "inicial" },
  { name: "Malcon Saint Ísis", over: 85, category: "inicial" },
  { name: "Cassius Blackwell", over: 87, category: "inicial" },
  { name: "Elias Barrow", over: 88, category: "inicial" },
  { name: "Octavius Drexley", over: 89, category: "inicial" },
  { name: "Victor Crane", over: 90, category: "inicial" },
  { name: "Damocles MontGrave", over: 91, category: "inicial" },
  { name: "Magnus Crowley", over: 92, category: "inicial" },
  // Bosses Difíceis
  { name: "Krugdrak", over: 93, category: "dificil" },
  { name: "Leon Allucinos", over: 95, category: "dificil" },
  // Bosses Super Difíceis
  { name: "Dantiel Cerberos", over: 96, category: "super_dificil" },
  { name: "Qaelis Qayin", over: 98, category: "super_dificil" },
  { name: "Malacharion", over: 99, category: "super_dificil" },
  // Boss Final
  { name: "Caim", over: 110, category: "final" },
];

export const CAMPAIGN_CHARACTERS = [
  {
    name: "Alisson Lachowski",
    classification: "Ofensivo",
    specialty: "Força Física",
    skills: "Poderes de Terremotos",
    versions: [
      { year: "1990", over: 30 },
      { year: "1991", over: 65 },
      { year: "1992", over: 75 },
      { year: "1993", over: 82 },
      { year: "1995", over: 85 },
      { year: "1997", over: 90 },
    ]
  },
  {
    name: "Marie Jois",
    classification: "Tático",
    specialty: "Inteligência",
    skills: "Manipulação de Sangue",
    versions: [
      { year: "1991", over: 70 },
      { year: "1992", over: 78 },
      { year: "1993", over: 82 },
      { year: "1995", over: 84 },
    ]
  },
  {
    name: "Leonardo Capaldi",
    classification: "Ofensivo",
    specialty: "Equilibrado",
    skills: "Teleporte, Mistura de Poderes",
    versions: [
      { year: "1991", over: 67 },
      { year: "1992", over: 74 },
      { year: "1993", over: 85 },
      { year: "1995", over: 87 },
      { year: "1997", over: 91 },
    ]
  },
  {
    name: "Steve Blackthorn",
    classification: "Ofensivo",
    specialty: "Força Física",
    skills: "Identificação de Pontos Fracos",
    versions: [
      { year: "1993", over: 85 },
      { year: "1995", over: 88 },
      { year: "1997", over: 92 },
    ]
  },
  {
    name: "Alice Boulevard",
    classification: "Tático",
    specialty: "Inteligência",
    skills: "Manipulação de Concreto, Manifestação da Mãe",
    versions: [
      { year: "1993", over: 81 },
      { year: "1995", over: 87 },
      { year: "1997", over: 92 },
    ]
  },
  {
    name: "Nathan Bradshaw",
    classification: "Ofensivo",
    specialty: "Força Física",
    skills: "Poderes de Raiva",
    versions: [
      { year: "1993", over: 97 },
      { year: "1995", over: 98 },
      { year: "1997", over: 98 },
    ]
  }
];

export const CAMPAIGN_REWARDS = [
  { name: "Buff de Ataque Permanente", type: "buff_perm", description: "+5 em todos os ataques" },
  { name: "Buff de Defesa Permanente", type: "buff_perm", description: "+5 em todas as defesas" },
  { name: "Poção de Cura Total", type: "consumable", description: "Restaura HP de um aliado" },
  { name: "Reviver Combatente", type: "consumable", description: "Traz um aliado de volta com 50% HP" },
  { name: "Aumento de Over", type: "buff_perm", description: "+2 de Over para um aliado" },
  { name: "Redução de Dano Recebido", type: "buff_perm", description: "-10% de dano sofrido" },
  { name: "Recuperação de Energia", type: "consumable", description: "Restaura todos os recursos" },
  { name: "Melhoria de Habilidades", type: "buff_perm", description: "Aumenta eficácia das habilidades" },
  { name: "Resistência Elemental", type: "buff_perm", description: "+20% resistência a um elemento" },
  { name: "Golpe Crítico", type: "buff_perm", description: "+10% chance de crítico" },
];
