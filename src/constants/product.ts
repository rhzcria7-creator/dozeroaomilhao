// ============================================================
// PRODUTO ÚNICO — DO ZERO AO MILHÃO
// Fonte única de verdade. Alterar aqui propaga para todo o site.
// ============================================================

export const PRODUCT = {
  name: "Do Zero ao Milhão",
  subtitle: "O Guia Definitivo para Construir Riqueza",
  shortName: "Ebook Premium: Do Zero ao Milhão",
  fullName: "Ebook Do Zero ao Milhão",
  pages: 50,
  format: "PDF",
  price: {
    current: "129,90",
    currentNumber: 129.9,
    original: "297,00",
    originalNumber: 297.0,
    discountPct: 56,
    currency: "BRL",
    installments: "ou 12x de R$ 12,89 no cartão",
  },
  guaranteeDays: 7,
} as const;

// ============================================================
// CAPÍTULOS — Os 50 capítulos do ebook único
// ============================================================
export interface Chapter {
  n: string;
  t: string;
  sub: string;
  d: string;
  highlight?: boolean;
}

export const CHAPTERS: Chapter[] = [
  {
    n: "01",
    t: "O Mapa da Riqueza",
    sub: "Os 5 Pilares",
    d: "A arquitetura completa que sustenta toda grande fortuna.",
    highlight: true,
  },
  {
    n: "02",
    t: "Mentalidade Milionária",
    sub: "Hábitos que multiplicam",
    d: "Os padrões mentais e rotinas diárias de quem constrói patrimônio.",
  },
  {
    n: "03",
    t: "Controle Financeiro",
    sub: "Método dos Baldes",
    d: "O sistema simples e visual para organizar suas finanças.",
  },
  {
    n: "04",
    t: "Aumento de Renda",
    sub: "Primeiro R$ 1.000 extra",
    d: "O caminho mais curto para gerar sua primeira renda complementar.",
  },
  {
    n: "05",
    t: "Negócios e Vendas",
    sub: "A Oferta Irresistível",
    d: "A anatomia de uma oferta que vende sozinha.",
  },
  {
    n: "06",
    t: "Investimentos Inteligentes",
    sub: "Juros Compostos na prática",
    d: "Do zero até a primeira carteira diversificada.",
  },
  {
    n: "07",
    t: "Sistema de Execução",
    sub: "Plano de 90 Dias",
    d: "O cronograma definitivo para transformar conhecimento em resultado.",
  },
];
