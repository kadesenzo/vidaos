/**
 * LIFE OS — Global Configuration Layer (White-Label Architecture)
 * Modify this configuration to rebrand, rename, or reconfigure modules
 * without changing application logic.
 */

export interface AppConfig {
  appName: string;
  appShortName: string;
  tagline: string;
  version: string;
  primaryColor: string; // hex
  secondaryColor: string;
  accentGlow: string;
  themeMode: 'dark' | 'light' | 'auto';
  typography: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  timeFormat: '24h' | '12h';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  enabledModules: {
    dashboard: boolean;
    assistente: boolean;
    estudos: boolean;
    tarefas: boolean;
    habitos: boolean;
    rotina: boolean;
    projetos: boolean;
    trabalho: boolean;
    financas: boolean;
    vendas: boolean;
    treinos: boolean;
    saude: boolean;
    alimentacao: boolean;
    galeria: boolean;
    diario: boolean;
    timeline: boolean;
    inbox: boolean;
    memoria: boolean;
    metas: boolean;
    calendario: boolean;
    ia: boolean;
    configuracoes: boolean;
  };
  moduleLabels: Record<string, { label: string; icon: string; description: string }>;
  notificationSettings: {
    enabled: boolean;
    sound: boolean;
    studyReminders: boolean;
    taskDeadlines: boolean;
    financeAlerts: boolean;
  };
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: 'LIFE OS',
  appShortName: 'LIFE',
  tagline: 'Seu sistema operacional pessoal',
  version: '2.6.0',
  primaryColor: '#6366f1', // Indigo iOS
  secondaryColor: '#38bdf8', // Sky Blue
  accentGlow: 'rgba(99, 102, 241, 0.25)',
  themeMode: 'dark',
  typography: 'Plus Jakarta Sans',
  currency: 'BRL',
  currencySymbol: 'R$',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  language: 'pt-BR',
  enabledModules: {
    dashboard: true,
    assistente: true,
    estudos: true,
    tarefas: true,
    habitos: true,
    rotina: true,
    projetos: true,
    trabalho: true,
    financas: true,
    vendas: true,
    treinos: true,
    saude: true,
    alimentacao: true,
    galeria: true,
    diario: true,
    timeline: true,
    inbox: true,
    memoria: true,
    metas: true,
    calendario: true,
    ia: true,
    configuracoes: true,
  },
  moduleLabels: {
    dashboard: { label: 'Início', icon: 'LayoutDashboard', description: 'Visão geral do seu dia, prioridades e métricas' },
    assistente: { label: 'Assistente', icon: 'Bot', description: 'Interface de linguagem natural que transforma texto em ação real' },
    estudos: { label: 'Estudos', icon: 'GraduationCap', description: 'Life OS Academy: videoaulas, questões, simulados e estatísticas' },
    tarefas: { label: 'Tarefas', icon: 'CheckSquare', description: 'Gerenciador de tarefas, prioridades e prazos' },
    habitos: { label: 'Hábitos', icon: 'Flame', description: 'Acompanhamento de hábitos com streaks semanais' },
    rotina: { label: 'Rotina', icon: 'Clock', description: 'Blocos de tempo diários e planejamento estruturado' },
    projetos: { label: 'Projetos', icon: 'FolderKanban', description: 'Gestão de projetos pessoais e profissionais' },
    trabalho: { label: 'Work', icon: 'Briefcase', description: 'Espaço profissional, clientes, propostas e tarefas' },
    financas: { label: 'Financeiro', icon: 'Wallet', description: 'Controle de receitas, despesas, saldo e metas' },
    vendas: { label: 'Vendas CRM', icon: 'TrendingUp', description: 'Pipeline de abordagens, negociações e fechamentos' },
    treinos: { label: 'Treinos', icon: 'Dumbbell', description: 'Registro de atividades físicas, cargas e repetições' },
    saude: { label: 'Crescimento & Sono', icon: 'Activity', description: 'Registro de altura, peso saudável e qualidade de sono' },
    alimentacao: { label: 'Alimentação', icon: 'Apple', description: 'Diário alimentar leve e consumo de água' },
    galeria: { label: 'Galeria da Vida', icon: 'Image', description: 'Memória visual privada de estudos, treinos e projetos' },
    diario: { label: 'Diário', icon: 'BookMarked', description: 'Como foi seu dia? Histórico e memórias pesquisáveis' },
    timeline: { label: 'Meu Ano / Timeline', icon: 'Milestone', description: 'Linha do tempo histórica da sua evolução pessoal' },
    inbox: { label: 'Caixa de Ideias', icon: 'Lightbulb', description: 'Captura instantânea de ideias para transformar em projetos' },
    memoria: { label: 'Memória', icon: 'Sparkles', description: 'Segundo cérebro para ideias rápidas, notas e lembretes' },
    metas: { label: 'Metas', icon: 'Target', description: 'Grandes objetivos, progresso visual e marcos' },
    calendario: { label: 'Calendário', icon: 'CalendarDays', description: 'Agenda integrada de tarefas, estudos e compromissos' },
    ia: { label: 'Life AI Tutor', icon: 'BrainCircuit', description: 'Tutor educacional com dados reais' },
    configuracoes: { label: 'Ajustes', icon: 'Settings', description: 'Personalização, dados, exportação e lixeira' },
  },
  notificationSettings: {
    enabled: true,
    sound: true,
    studyReminders: true,
    taskDeadlines: true,
    financeAlerts: true,
  },
};
