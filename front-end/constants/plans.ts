import type { SubscriptionPlan } from '@/domain/models';

export interface PlanOption {
  id: SubscriptionPlan;
  name: string;
  price: string;
  tagline: string;
  badge?: string;
  features: string[];
}

export const planOptions: PlanOption[] = [
  {
    id: 'free',
    name: 'Grátis',
    price: 'R$ 0',
    tagline: 'Começar o dia',
    features: [
      'Notas, tarefas, agenda e projetos básicos',
      'Até 30 notas e 20 tarefas ativas',
      '1 projeto com progresso',
      '1 lembrete por evento',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 19,90/mês',
    tagline: 'Organizar de verdade',
    badge: 'Recomendado',
    features: [
      'Notas, tarefas e eventos ilimitados',
      'Até 10 projetos com progresso',
      'Vários lembretes por evento',
      'Categorias, filtros e busca avançada',
      'Anexos leves e exportação',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    price: 'R$ 39,90/mês',
    tagline: 'Central da vida',
    features: [
      'Tudo do Pro',
      'Projetos ilimitados',
      'Compartilhar com até 3 pessoas',
      'Templates de rotina e estudos',
      'Relatórios semanais e backup',
    ],
  },
];

export const planLabels: Record<SubscriptionPlan, string> = {
  free: 'Grátis',
  pro: 'Pro',
  max: 'Max',
};

export function isSubscriptionPlan(
  value: unknown
): value is SubscriptionPlan {
  return value === 'free' || value === 'pro' || value === 'max';
}
