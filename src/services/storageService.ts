/**
 * LIFE OS — Local-First Storage & State Synchronization Service
 * Manages reactive data storage with JSON export/import and Firebase compatibility.
 */

import {
  UserProfile,
  Subject,
  Course,
  Lesson,
  Question,
  QuestionAnswerRecord,
  ErrorNotebookItem,
  Flashcard,
  Simulado,
  StudySession,
  StudyPlanItem,
  Task,
  Habit,
  RoutineBlock,
  Project,
  FinanceRecord,
  LeadDeal,
  WorkoutRecord,
  MealRecord,
  MemoryNote,
  LifeGoal,
  NotificationItem,
  GalleryItem,
  JournalEntry,
  TimelineEvent,
  SleepRecord,
  WorkDeal,
  LearnedClass,
} from '../types';
import { AppConfig, DEFAULT_APP_CONFIG } from '../config/appConfig';

const STORAGE_KEYS = {
  CONFIG: 'lifeos_config_v2',
  PROFILE: 'lifeos_profile_v2',
  SUBJECTS: 'lifeos_subjects_v2',
  COURSES: 'lifeos_courses_v2',
  LEARNED_CLASSES: 'lifeos_learned_classes_v2',
  QUESTIONS: 'lifeos_questions_v2',
  ANSWERS: 'lifeos_answers_v2',
  ERROR_NOTEBOOK: 'lifeos_errors_v2',
  FLASHCARDS: 'lifeos_flashcards_v2',
  SIMULADOS: 'lifeos_simulados_v2',
  STUDY_SESSIONS: 'lifeos_study_sessions_v2',
  STUDY_PLANS: 'lifeos_study_plans_v2',
  TASKS: 'lifeos_tasks_v2',
  HABITS: 'lifeos_habits_v2',
  ROUTINE: 'lifeos_routine_v2',
  PROJECTS: 'lifeos_projects_v2',
  FINANCES: 'lifeos_finances_v2',
  LEADS: 'lifeos_leads_v2',
  WORKOUTS: 'lifeos_workouts_v2',
  MEALS: 'lifeos_meals_v2',
  MEMORY: 'lifeos_memory_v2',
  GOALS: 'lifeos_goals_v2',
  NOTIFICATIONS: 'lifeos_notifications_v2',
  GALLERY: 'lifeos_gallery_v2',
  JOURNAL: 'lifeos_journal_v2',
  TIMELINE: 'lifeos_timeline_v2',
  SLEEP: 'lifeos_sleep_v2',
  WORK: 'lifeos_work_v2',
};

// Initial Sample Data Generation
const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_001',
  name: 'Enzo Rodrigues',
  nickname: 'Enzo',
  email: 'enzo@lifeos.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  wakeTime: '06:30',
  sleepTime: '23:00',
  age: 17,
  birthDate: '2009-04-12',
  heightCm: 178,
  heightHistory: [
    { date: '2026-03-15', heightCm: 175 },
    { date: '2026-06-20', heightCm: 177 },
    { date: '2026-09-27', heightCm: 178 },
  ],
  weightKg: 68.5,
  weightHistory: [
    { date: '2026-03-15', weightKg: 65.0 },
    { date: '2026-06-20', weightKg: 67.0 },
    { date: '2026-09-27', weightKg: 68.5 },
  ],
  growthNotes: 'Ganhos consistentes de massa magra com Jiu-Jitsu e musculação sem foco em dietas extremas.',
  isStudent: true,
  isWorker: true,
  hasPersonalProjects: true,
  primaryGoals: ['Estudos', 'Programação', 'Exercícios', 'Finanças', 'Projetos'],
  forgetReason: 'tenho muitas coisas para fazer',
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'sub_mat',
    name: 'Matemática',
    icon: 'Calculator',
    color: '#ef4444', // Vermelho
    totalSecondsStudied: 185040, // ~51h 24m
    masteryLevel: 'dominado',
    totalQuestionsAnswered: 240,
    totalQuestionsCorrect: 198,
  },
  {
    id: 'sub_hist',
    name: 'História',
    icon: 'Landmark',
    color: '#3b82f6', // Azul
    totalSecondsStudied: 64440, // ~17h 54m
    masteryLevel: 'em_desenvolvimento',
    totalQuestionsAnswered: 130,
    totalQuestionsCorrect: 96,
  },
  {
    id: 'sub_geo',
    name: 'Geografia',
    icon: 'Globe',
    color: '#a855f7', // Roxo
    totalSecondsStudied: 51780, // ~14h 23m
    masteryLevel: 'dominado',
    totalQuestionsAnswered: 95,
    totalQuestionsCorrect: 86,
  },
  {
    id: 'sub_port',
    name: 'Português',
    icon: 'BookOpen',
    color: '#10b981', // Verde
    totalSecondsStudied: 48600, // ~13h 30m
    masteryLevel: 'revisar',
    totalQuestionsAnswered: 160,
    totalQuestionsCorrect: 108,
  },
  {
    id: 'sub_prog',
    name: 'Programação & IA',
    icon: 'Code2',
    color: '#f59e0b', // Amarelo/Laranja
    totalSecondsStudied: 102600, // ~28h 30m
    masteryLevel: 'dominado',
    totalQuestionsAnswered: 110,
    totalQuestionsCorrect: 98,
  },
  {
    id: 'sub_fis',
    name: 'Física & Ciências',
    icon: 'Atom',
    color: '#06b6d4', // Ciano
    totalSecondsStudied: 33700, // ~9h 21m
    masteryLevel: 'em_desenvolvimento',
    totalQuestionsAnswered: 75,
    totalQuestionsCorrect: 52,
  },
];

const DEFAULT_LEARNED_CLASSES: LearnedClass[] = [
  {
    id: 'class_01',
    title: 'Funções do 2º Grau & Vértice da Parábola',
    subjectId: 'sub_mat',
    subjectName: 'Matemática',
    source: 'YouTube',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 45,
    whatILearned: 'Aprendi como encontrar o vértice da parábola através das fórmulas Xv = -b/(2a) e Yv = -Δ/(4a). Compreendi a aplicação prática em problemas de otimização de custo mínimo e faturamento máximo. Quando o coeficiente a > 0, o vértice é ponto de mínimo; quando a < 0, é ponto de máximo.',
    keyConcepts: [
      'Xv = -b / (2a)',
      'Yv = -Δ / (4a)',
      'Vértice da Parábola',
      'Ponto Máximo vs Mínimo',
      'Problemas de Otimização',
    ],
    questionsOrDoubts: 'Praticar mais exercícios com interpretação de gráficos de lucro.',
    status: 'concluida',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'class_02',
    title: 'Revolução Francesa — Fase do Terror e Reação Termidoriana',
    subjectId: 'sub_hist',
    subjectName: 'História',
    source: 'Curso Online',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    durationMinutes: 50,
    whatILearned: 'Entendi a divisão entre Jacobinos (Montanheses, radicais liderados por Robespierre) e Girondinos (alta burguesia moderada). A criação do Comitê de Salvação Pública, Tribunal Revolucionário e a Lei dos Suspeitos marcaram o Terror. Em 1794 ocorreu o Golpe do 9 Termidor, derrubando Robespierre e instituindo o Diretório.',
    keyConcepts: [
      'Jacobinos vs Girondinos',
      'Robespierre e Comitê de Salvação Pública',
      'Lei dos Suspeitos (1793)',
      'Reação Termidoriana (1794)',
      'Instalação do Diretório',
    ],
    questionsOrDoubts: 'Revisar as medidas econômicas da Lei do Máximo Tabelamento de Preços.',
    status: 'concluida',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'class_03',
    title: 'Leis de Newton & Dinâmica do Plano Inclinado',
    subjectId: 'sub_fis',
    subjectName: 'Física & Ciências',
    source: 'Escola / Presencial',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    durationMinutes: 60,
    whatILearned: 'Fixei a decomposição de forças no plano inclinado: o Peso se decompõe em Px (paralelo ao plano, Px = P·sen θ) e Py (perpendicular ao plano, Py = P·cos θ). A Força Normal equilibra Py (N = Py = P·cos θ). A força de atrito estático máxima é Fat = μe · N.',
    keyConcepts: [
      'Px = P · sen(θ)',
      'Py = P · cos(θ)',
      'Normal: N = P · cos(θ)',
      'Fat = μ · N',
      '2ª Lei: Fr = m · a',
    ],
    questionsOrDoubts: 'Fazer 10 questões da banca sobre atrito em planos inclinados com polias.',
    status: 'revisar',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'class_04',
    title: 'Arquitetura Limpa e Tipagem Estrita em TypeScript',
    subjectId: 'sub_prog',
    subjectName: 'Programação & IA',
    source: 'YouTube',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    durationMinutes: 40,
    whatILearned: 'Estudei como criar serviços modulares desacoplados da interface. Entendi o conceito de local-first storage, onde a aplicação funciona 100% offline salvando e recuperando estados locais e sincronizando com servidores quando disponível. Uso de union types para segurança em tempo de compilação.',
    keyConcepts: [
      'Local-First Architecture',
      'Discriminated Unions',
      'Single Responsibility Principle',
      'State Observers',
    ],
    questionsOrDoubts: 'Implementar exportação e importação de JSON estruturado.',
    status: 'concluida',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_COURSES: Course[] = [
  {
    id: 'crs_mat_essencial',
    title: 'Matemática Essencial & Raciocínio Lógico',
    instructor: 'Prof. Arthur Vasconcelos',
    instructorTitle: 'Especialista em Concursos & Exatas',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    description: 'Domine desde as propriedades fundamentais até potenciação avançada, frações, equações e resolução ágil de problemas.',
    category: 'Exatas & Concursos',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    progressPercentage: 72,
    totalLessons: 8,
    completedLessons: 5,
    modules: [
      {
        id: 'mod_01',
        title: 'Módulo 01 — Fundamentos & Números',
        lessons: [
          {
            id: 'les_01',
            courseId: 'crs_mat_essencial',
            moduleId: 'mod_01',
            title: 'Aula 01 — Números Naturais e Operações Elementares',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Conceito de conjuntos numéricos, propriedades de soma, subtração, multiplicação e divisão com técnica de cálculo rápido.',
            completed: true,
            currentTimestampSeconds: 1680,
            notes: [
              { id: 'n1', lessonId: 'les_01', timestampSeconds: 240, text: 'Propriedade distributiva economiza tempo em contas grandes.', createdAt: '2026-09-24T10:00:00Z' },
            ],
            attachments: [
              { id: 'att1', title: 'Apostila Teórica Módulo 01 (PDF)', type: 'pdf', url: '#', size: '2.4 MB' },
              { id: 'att2', title: 'Mapa Mental de Operações', type: 'imagem', url: '#', size: '850 KB' },
            ],
            summary: 'Revisão estruturada dos axiomas aritméticos essenciais e estratégias de fatoração mental.',
          },
          {
            id: 'les_02',
            courseId: 'crs_mat_essencial',
            moduleId: 'mod_01',
            title: 'Aula 02 — Números Inteiros e Regra de Sinais',
            durationMinutes: 32,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Trabalhando com números negativos, parênteses e expressões aritméticas complexas sem cometer deslizes conceituais.',
            completed: true,
            currentTimestampSeconds: 1920,
            notes: [],
            attachments: [
              { id: 'att3', title: 'Resumo Regra de Sinais', type: 'resumo', url: '#', size: '1.1 MB' },
            ],
          },
          {
            id: 'les_03',
            courseId: 'crs_mat_essencial',
            moduleId: 'mod_01',
            title: 'Aula 03 — Frações: MMC, MDC e Simplificação Ágil',
            durationMinutes: 45,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Como operar frações sem perder tempo, equivalência e conversão direta para números decimais.',
            completed: true,
            currentTimestampSeconds: 2700,
            notes: [
              { id: 'n2', lessonId: 'les_03', timestampSeconds: 780, text: 'Multiplicar em cruz funciona apenas em proporções com igualdade!', createdAt: '2026-09-25T14:30:00Z' },
            ],
            attachments: [
              { id: 'att4', title: 'Caderno de 40 Exercícios com Gabarito', type: 'pdf', url: '#', size: '3.8 MB' },
            ],
          },
          {
            id: 'les_04',
            courseId: 'crs_mat_essencial',
            moduleId: 'mod_01',
            title: 'Aula 04 — Potenciação e Notação Científica',
            durationMinutes: 38,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Propriedades de mesma base, expoentes negativos, potências fracionárias e macetes para provas de alto nível.',
            completed: false,
            currentTimestampSeconds: 1062, // 17:42
            notes: [
              { id: 'n3', lessonId: 'les_04', timestampSeconds: 1062, text: 'Importante: lembrar da fórmula a^(m/n) = raiz enésima de a^m!', createdAt: '2026-09-26T17:42:00Z' },
            ],
            attachments: [
              { id: 'att5', title: 'Fórmulas de Potenciação e Radiciação', type: 'pdf', url: '#', size: '1.5 MB' },
            ],
            summary: 'Compreensão aprofundada das 7 propriedades de potências e resolução comentada de 5 questões de concursos militares e vestibulares.',
          },
        ],
      },
      {
        id: 'mod_02',
        title: 'Módulo 02 — Equações & Proporcionalidade',
        lessons: [
          {
            id: 'les_05',
            courseId: 'crs_mat_essencial',
            moduleId: 'mod_02',
            title: 'Aula 05 — Equações de 1º Grau e Problemas Textuais',
            durationMinutes: 35,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Transformação de enunciados cotidianos em sentenças matemáticas claras.',
            completed: true,
            currentTimestampSeconds: 2100,
            notes: [],
            attachments: [],
          },
          {
            id: 'les_06',
            courseId: 'crs_mat_essencial',
            moduleId: 'mod_02',
            title: 'Aula 06 — Razão, Proporção e Regra de Três Composta',
            durationMinutes: 40,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            description: 'Método das causas e efeitos para nunca mais errar grandezas direta ou inversamente proporcionais.',
            completed: false,
            currentTimestampSeconds: 0,
            notes: [],
            attachments: [],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_hist_revolucoes',
    title: 'História Geral: Das Grandes Revoluções à Geopolítica Atual',
    instructor: 'Profª. Camila Duarte',
    instructorTitle: 'Mestre em Relações Internacionais',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    description: 'Uma imersão causal e cronológica pelos marcos que moldaram o pensamento e a economia do mundo ocidental.',
    category: 'Humanas & Geopolítica',
    coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    progressPercentage: 45,
    totalLessons: 6,
    completedLessons: 3,
    modules: [
      {
        id: 'mod_hist_01',
        title: 'Módulo 01 — Iluminismo e Revoluções Burguesas',
        lessons: [
          {
            id: 'les_h01',
            courseId: 'crs_hist_revolucoes',
            moduleId: 'mod_hist_01',
            title: 'Aula 01 — Pensamento Iluminista e Crise do Antigo Regime',
            durationMinutes: 42,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            description: 'Montesquieu, Locke, Voltaire e as raízes do liberalismo político.',
            completed: true,
            currentTimestampSeconds: 2520,
            notes: [],
            attachments: [],
          },
          {
            id: 'les_h02',
            courseId: 'crs_hist_revolucoes',
            moduleId: 'mod_hist_01',
            title: 'Aula 02 — Revolução Francesa: Fases e Impacto Global',
            durationMinutes: 50,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            description: 'Da Tomada da Bastilha ao Período do Terror e a ascensão de Napoleão Bonaparte.',
            completed: false,
            currentTimestampSeconds: 600,
            notes: [
              { id: 'nh1', lessonId: 'les_h02', timestampSeconds: 600, text: 'Girondinos (alta burguesia moderada) x Jacobinos (radicais populares).', createdAt: '2026-09-26T11:00:00Z' },
            ],
            attachments: [
              { id: 'att_h1', title: 'Linha do Tempo da Revolução Francesa', type: 'resumo', url: '#', size: '1.9 MB' },
            ],
          },
        ],
      },
    ],
  },
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q_01',
    subjectId: 'sub_mat',
    subjectName: 'Matemática',
    topic: 'Potenciação & Notação Científica',
    prompt: 'Qual é o valor numérico da expressão: (2³ × 2⁴) ÷ (2⁵) + 3² × 3⁻¹?',
    options: ['4', '5', '7', '11', '12'],
    correctOptionIndex: 2, // 7 -> (2^7 / 2^5) = 2^2 = 4; 3^(2-1) = 3; 4 + 3 = 7.
    explanation: 'Passo 1: Propriedade do produto de potências de mesma base no numerador: 2³ × 2⁴ = 2^(3+4) = 2⁷.\nPasso 2: Divisão de potências de mesma base: 2⁷ ÷ 2⁵ = 2^(7-5) = 2² = 4.\nPasso 3: Segunda parcela: 3² × 3⁻¹ = 3^(2-1) = 3¹ = 3.\nPasso 4: Somando os termos: 4 + 3 = 7. Resposta alternativa C.',
    difficulty: 'facil',
    year: 2024,
    source: 'EsPCEx / Concursos',
    isFavorite: true,
  },
  {
    id: 'q_02',
    subjectId: 'sub_mat',
    subjectName: 'Matemática',
    topic: 'Frações & Proporção',
    prompt: 'Um estudante concluiu 3/8 de uma lista de exercícios pela manhã e 2/5 do restante à tarde. Se ainda restam 30 exercícios para resolver, qual era o total de questões da lista?',
    options: ['60', '80', '100', '120', '150'],
    correctOptionIndex: 1, // 80 -> manhã = 3/8; resto = 5/8; tarde = 2/5 * 5/8 = 2/8 = 1/4; total feito = 3/8 + 2/8 = 5/8; sobram 3/8 = 30 -> 1/8 = 10 -> total = 80.
    explanation: '1. Pela manhã foi feito 3/8 da lista. O restante equivale a 1 - 3/8 = 5/8.\n2. À tarde foi feito 2/5 do restante: (2/5) × (5/8) = 2/8.\n3. Total já resolvido: 3/8 + 2/8 = 5/8.\n4. O que resta: 3/8 da lista.\n5. Se 3/8 = 30 questões, então 1/8 = 10 questões, logo a lista inteira (8/8) tem 80 questões.',
    difficulty: 'medio',
    year: 2023,
    source: 'Vunesp',
    isFavorite: false,
  },
  {
    id: 'q_03',
    subjectId: 'sub_hist',
    subjectName: 'História',
    topic: 'Revolução Francesa',
    prompt: 'Durante a Revolução Francesa, o período compreendido entre 1793 e 1794, conhecido como "O Terror", caracterizou-se principalmente pelo(a):',
    options: [
      'Retorno pacífico dos Bourbons ao trono sob mediação britânica.',
      'Governo da Convenção Jacobina liderado por Robespierre com perseguição política implacável.',
      'Adoção da monarquia constitucional baseada nas ideias de Montesquieu.',
      'Assinatura do Tratado de Versalhes que pôs fim à rivalidade com a Prússia.',
      'Vitória militar dos Girondinos e dissolução do Comitê de Salvação Pública.',
    ],
    correctOptionIndex: 1,
    explanation: 'A fase da Convenção Nacional Jacobina (1793–1794), sob comando de Robespierre e do Comitê de Salvação Pública, foi marcada pela Lei dos Suspeitos, guilhotinamento de opositores (O Terror), mas também por medidas populares como o voto universal masculino e a abolição da escravidão nas colônias.',
    difficulty: 'medio',
    year: 2024,
    source: 'Enem / FGV',
    isFavorite: true,
  },
  {
    id: 'q_04',
    subjectId: 'sub_port',
    subjectName: 'Português',
    topic: 'Concordância Verbal & Crase',
    prompt: 'Assinale a alternativa em que o uso do acento grave indicativo de crase está rigorosamente correto:',
    options: [
      'Entregamos o relatório à uma comissão técnica.',
      'O palestrante começou à falar com convicção.',
      'Refiro-me às diretrizes aprovadas na reunião anterior.',
      'Fizemos o trajeto à pé durante a manhã.',
      'O projeto foi encaminhado à qualquer interessado.',
    ],
    correctOptionIndex: 2,
    explanation: 'Na opção C ("Refiro-me às diretrizes"), quem se refere, refere-se A (preposição) + AS diretrizes (artigo feminino plural) = ÀS (ocorre fusão/crase correta). Em A, nunca há crase antes de "uma"; em B e D, não há crase antes de verbo ou palavra masculina; em E, não há antes de pronome indefinido "qualquer".',
    difficulty: 'facil',
    year: 2023,
    source: 'Cebraspe',
    isFavorite: false,
  },
  {
    id: 'q_05',
    subjectId: 'sub_geo',
    subjectName: 'Geografia',
    topic: 'Geopolítica & Globalização',
    prompt: 'O fenômeno conhecido como "Nearshoring", intensificado no cenário pós-pandemia e na guerra comercial entre potências, designa:',
    options: [
      'A terceirização da produção para países geograficamente próximos aos mercados consumidores finais.',
      'O cancelamento total do comércio exterior e retorno estrito à autossuficiência agrícola.',
      'A padronização das moedas de todos os países integrantes da OCDE.',
      'O transporte exclusivo de cargas por rotas fluviais intercontinentais.',
      'A transferência das fábricas exclusivamente para o sudeste asiático.',
    ],
    correctOptionIndex: 0,
    explanation: 'Nearshoring é a estratégia de cadeias globais de suprimento que consiste em realocar fábricas e centros logísticos para países vizinhos ou próximos dos mercados consumidores finais (como o México para os EUA), reduzindo riscos de desabastecimento, custos de frete e tensões geopolíticas.',
    difficulty: 'medio',
    year: 2024,
    source: 'Banca Própria',
    isFavorite: false,
  },
  {
    id: 'q_06',
    subjectId: 'sub_prog',
    subjectName: 'Programação & IA',
    topic: 'Estruturas de Dados & Complexidade',
    prompt: 'Qual é a complexidade temporal média no pior caso para busca de um elemento em uma Tabela Hash (Hash Table) bem distribuída?',
    options: ['O(n²)', 'O(n log n)', 'O(1)', 'O(log n)', 'O(n)'],
    correctOptionIndex: 2,
    explanation: 'Em uma Tabela Hash ideal com função de hash uniforme e fator de carga controlado, o tempo médio para inserção, busca e remoção é O(1) constante. Em caso de colisões degeneradas extremas sem redimensionamento pode decair para O(n), mas o comportamento médio projetado é O(1).',
    difficulty: 'facil',
    year: 2024,
    source: 'Tech Exam',
    isFavorite: true,
  },
];

const DEFAULT_ERROR_NOTEBOOK: ErrorNotebookItem[] = [
  {
    id: 'err_01',
    question: DEFAULT_QUESTIONS[1], // Questão de Frações
    mistakeCount: 2,
    lastAttemptAt: '2026-09-25T16:20:00Z',
    resolved: false,
    userNote: 'Atenção ao calcular fração DO RESTANTE! Multiplicar primeiro pelo que sobrou.',
  },
  {
    id: 'err_02',
    question: DEFAULT_QUESTIONS[3], // Crase
    mistakeCount: 1,
    lastAttemptAt: '2026-09-26T09:15:00Z',
    resolved: true,
    userNote: 'Relembrar que pronome indefinido não admite artigo.',
  },
];

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_01',
    subjectId: 'sub_mat',
    subjectName: 'Matemática',
    front: 'Qual é a propriedade de: (a^m)^n ?',
    back: 'Potência de potência: multiplicam-se os expoentes!\nResultado: a^(m × n)',
    difficulty: 'facil',
    nextReviewDate: '2026-09-27',
    repetitions: 3,
    intervalDays: 4,
    lastReviewedAt: '2026-09-23T11:00:00Z',
  },
  {
    id: 'fc_02',
    subjectId: 'sub_hist',
    subjectName: 'História',
    front: 'Quais eram os três estados da sociedade francesa pré-revolucionária?',
    back: '1º Estado: Clero\n2º Estado: Nobreza\n3º Estado: Povo e Burguesia (sustentavam a arrecadação de tributos)',
    difficulty: 'medio',
    nextReviewDate: '2026-09-27',
    repetitions: 2,
    intervalDays: 2,
    lastReviewedAt: '2026-09-25T15:00:00Z',
  },
  {
    id: 'fc_03',
    subjectId: 'sub_prog',
    subjectName: 'Programação & IA',
    front: 'O que define uma função pura (Pure Function)?',
    back: '1. Dado os mesmos argumentos, sempre retorna o mesmo resultado.\n2. Não produz efeitos colaterais observáveis (side-effects) fora do seu escopo.',
    difficulty: 'facil',
    nextReviewDate: '2026-09-28',
    repetitions: 4,
    intervalDays: 7,
    lastReviewedAt: '2026-09-21T08:30:00Z',
  },
  {
    id: 'fc_04',
    subjectId: 'sub_port',
    subjectName: 'Português',
    front: 'O verbo "Haver" no sentido de existir ou tempo decorrido é impessoal?',
    back: 'SIM! Fica sempre na 3ª pessoa do singular.\nExemplo: "Havia dez pessoas na sala", e NUNCA "Haviam".',
    difficulty: 'dificil',
    nextReviewDate: '2026-09-27',
    repetitions: 1,
    intervalDays: 1,
    lastReviewedAt: '2026-09-26T18:00:00Z',
  },
];

const DEFAULT_SIMULADOS: Simulado[] = [
  {
    id: 'sim_01',
    title: 'Simulado Diagnóstico Geral #01 — Raciocínio & Fundamentos',
    subject: 'Geral',
    durationMinutes: 45,
    totalQuestions: 6,
    correctAnswers: 5,
    completedAt: '2026-09-25T18:00:00Z',
    scorePercentage: 83.3,
    timeTakenMinutes: 34,
    questions: DEFAULT_QUESTIONS,
    subjectDiagnostic: {
      Matemática: { total: 2, correct: 2 },
      História: { total: 1, correct: 1 },
      Português: { total: 1, correct: 0 },
      Geografia: { total: 1, correct: 1 },
      'Programação & IA': { total: 1, correct: 1 },
    },
  },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 'tsk_01',
    title: 'Estudar Potenciação — Aula 04 e resolver 15 questões',
    description: 'Assistir a aula até o fim e treinar questões de concursos militares no caderno.',
    priority: 'alta',
    category: 'Estudos',
    date: '2026-09-27',
    time: '14:30',
    estimatedMinutes: 45,
    project: 'Preparação Acadêmica',
    tags: ['Matemática', 'Foco'],
    status: 'a_fazer',
    createdAt: '2026-09-26T19:00:00Z',
  },
  {
    id: 'tsk_02',
    title: 'Revisar flashcards pendentes do dia (Active Recall)',
    description: 'Fazer a bateria de 12 repetições espaçadas antes do jantar.',
    priority: 'alta',
    category: 'Estudos',
    date: '2026-09-27',
    time: '18:00',
    estimatedMinutes: 20,
    tags: ['Revisão', 'Memória'],
    status: 'a_fazer',
    createdAt: '2026-09-26T20:00:00Z',
  },
  {
    id: 'tsk_03',
    title: 'Enviar proposta comercial atualizada para KAEN',
    description: 'Ajustar escopo de manutenção preventiva e detalhamento de peças.',
    priority: 'media',
    category: 'Vendas CRM',
    date: '2026-09-27',
    time: '16:00',
    estimatedMinutes: 30,
    project: 'KAEN Motors',
    tags: ['Comercial'],
    status: 'em_andamento',
    createdAt: '2026-09-26T21:00:00Z',
  },
  {
    id: 'tsk_04',
    title: 'Treino de Jiu-jitsu — Passagem de Guarda',
    description: 'Treino das 19h com foco em estabilização lateral.',
    priority: 'media',
    category: 'Treinos',
    date: '2026-09-27',
    time: '19:00',
    estimatedMinutes: 75,
    status: 'a_fazer',
    createdAt: '2026-09-26T22:00:00Z',
  },
  {
    id: 'tsk_05',
    title: 'Revisão financeira semanal e conferência de entradas',
    description: 'Conciliar pagamentos recebidos via Pix e registrar despesas de infra.',
    priority: 'baixa',
    category: 'Financeiro',
    date: '2026-09-27',
    time: '21:00',
    estimatedMinutes: 20,
    status: 'concluida',
    completedAt: '2026-09-27T08:15:00Z',
    createdAt: '2026-09-26T22:30:00Z',
  },
];

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'hab_01',
    name: 'Beber 3L de Água',
    icon: 'Droplet',
    category: 'Saúde',
    frequency: 'diaria',
    targetTime: 'Ao longo do dia',
    completions: {
      '2026-09-21': true,
      '2026-09-22': true,
      '2026-09-23': true,
      '2026-09-24': true,
      '2026-09-25': true,
      '2026-09-26': true,
      '2026-09-27': true,
    },
    streak: 14,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'hab_02',
    name: 'Estudo Focado (mín. 1h30 líquidas)',
    icon: 'GraduationCap',
    category: 'Estudos',
    frequency: 'diaria',
    targetTime: '14:00',
    completions: {
      '2026-09-21': true,
      '2026-09-22': true,
      '2026-09-23': true,
      '2026-09-24': true,
      '2026-09-25': false,
      '2026-09-26': true,
      '2026-09-27': false,
    },
    streak: 2,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'hab_03',
    name: 'Praticar Programação / Codar',
    icon: 'Code',
    category: 'Projetos',
    frequency: 'dias_uteis',
    targetTime: '10:00',
    completions: {
      '2026-09-21': true,
      '2026-09-22': true,
      '2026-09-23': true,
      '2026-09-24': true,
      '2026-09-25': true,
      '2026-09-26': true,
      '2026-09-27': true,
    },
    streak: 9,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'hab_04',
    name: 'Treino Físico (Jiu-jitsu / Corrida / Musculação)',
    icon: 'Activity',
    category: 'Saúde',
    frequency: 'personalizada',
    targetTime: '19:00',
    completions: {
      '2026-09-21': true,
      '2026-09-22': true,
      '2026-09-23': false,
      '2026-09-24': true,
      '2026-09-25': true,
      '2026-09-26': false,
      '2026-09-27': false,
    },
    streak: 0,
    createdAt: '2026-09-01T00:00:00Z',
  },
];

const DEFAULT_ROUTINE: RoutineBlock[] = [
  {
    id: 'rt_01',
    time: '06:30',
    durationMinutes: 45,
    title: 'Acordar & Ritual Matinal',
    subtitle: 'Hidratação (500ml) + Café da manhã reforçado',
    category: 'Rotina',
    icon: 'Sun',
    status: 'concluido',
  },
  {
    id: 'rt_02',
    time: '07:30',
    durationMinutes: 60,
    title: 'Planejamento do Dia & Notificações',
    subtitle: 'Revisar tarefas, prioridades do Life OS',
    category: 'Organização',
    icon: 'Compass',
    status: 'concluido',
  },
  {
    id: 'rt_03',
    time: '08:45',
    durationMinutes: 90,
    title: 'Sessão 01 — Matemática & Resolução',
    subtitle: 'Potenciação, Módulo 01 Aula 04 + Questões',
    category: 'Estudos',
    icon: 'GraduationCap',
    status: 'em_andamento',
  },
  {
    id: 'rt_04',
    time: '10:30',
    durationMinutes: 90,
    title: 'Projetos — Desenvolvimento Fullstack',
    subtitle: 'Avançar funcionalidades do KVB System',
    category: 'Projetos',
    icon: 'Laptop',
    status: 'pendente',
  },
  {
    id: 'rt_05',
    time: '12:15',
    durationMinutes: 60,
    title: 'Almoço & Descanso Ativo',
    subtitle: 'Alimentação equilibrada e pausa de telas',
    category: 'Alimentação',
    icon: 'Coffee',
    status: 'pendente',
  },
  {
    id: 'rt_06',
    time: '14:00',
    durationMinutes: 90,
    title: 'Sessão 02 — História ou Redação',
    subtitle: 'Revolução Francesa + Anotações de síntese',
    category: 'Estudos',
    icon: 'BookOpen',
    status: 'pendente',
  },
  {
    id: 'rt_07',
    time: '16:00',
    durationMinutes: 60,
    title: 'Comercial & Propostas',
    subtitle: 'Follow-up de leads KAEN Motors',
    category: 'Vendas CRM',
    icon: 'TrendingUp',
    status: 'pendente',
  },
  {
    id: 'rt_08',
    time: '19:00',
    durationMinutes: 75,
    title: 'Treino de Jiu-Jitsu',
    subtitle: 'Treino técnico e rolas livres na academia',
    category: 'Treinos',
    icon: 'Dumbbell',
    status: 'pendente',
  },
  {
    id: 'rt_09',
    time: '21:30',
    durationMinutes: 45,
    title: 'Desaceleração & Leitura',
    subtitle: 'Sem telas azuis, 10 min de meditação',
    category: 'Noite',
    icon: 'Moon',
    status: 'pendente',
  },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'prj_01',
    name: 'KVB System',
    objective: 'Plataforma integrada de automação operacional e dados',
    description: 'Sistema modular para agilizar fluxos comerciais e operacionais de clientes com alta segurança.',
    deadline: '2026-11-30',
    budget: 15000,
    spent: 4200,
    revenue: 18000,
    progress: 68,
    status: 'ativo',
    nextSteps: [
      'Finalizar módulo de relatórios analíticos',
      'Integrar webhook de disparo de mensagens',
      'Homologar com primeiro cliente piloto',
    ],
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'prj_02',
    name: 'KAEN Motors',
    objective: 'Consultoria de gestão e CRM para oficina de alta performance',
    description: 'Estruturação de atendimento comercial, pós-venda e histórico digital dos veículos atendidos.',
    deadline: '2026-10-25',
    budget: 8000,
    spent: 2100,
    revenue: 12500,
    progress: 82,
    status: 'ativo',
    nextSteps: ['Apresentar protótipo de dashboard de ordens de serviço', 'Treinar equipe de recepção'],
    createdAt: '2026-08-15T00:00:00Z',
  },
];

const DEFAULT_FINANCES: FinanceRecord[] = [
  {
    id: 'fin_01',
    type: 'entrada',
    amount: 3500,
    date: '2026-09-25',
    category: 'Serviços',
    description: 'Parcela consultoria KAEN Motors',
    project: 'KAEN Motors',
    createdAt: '2026-09-25T10:00:00Z',
  },
  {
    id: 'fin_02',
    type: 'entrada',
    amount: 1200,
    date: '2026-09-22',
    category: 'Vendas',
    description: 'Licença software KVB System',
    project: 'KVB System',
    createdAt: '2026-09-22T14:00:00Z',
  },
  {
    id: 'fin_03',
    type: 'saida',
    amount: 290,
    date: '2026-09-26',
    category: 'Cursos & Livros',
    description: 'Material didático e simulados militares',
    createdAt: '2026-09-26T16:30:00Z',
  },
  {
    id: 'fin_04',
    type: 'saida',
    amount: 180,
    date: '2026-09-24',
    category: 'Equipamentos',
    description: 'Suporte ergonômico para monitor',
    createdAt: '2026-09-24T18:00:00Z',
  },
  {
    id: 'fin_05',
    type: 'a_receber',
    amount: 4500,
    date: '2026-10-05',
    category: 'Serviços',
    description: 'Entrega da Fase 2 KVB System',
    project: 'KVB System',
    createdAt: '2026-09-20T10:00:00Z',
  },
];

const DEFAULT_LEADS: LeadDeal[] = [
  {
    id: 'ld_01',
    clientName: 'Roberto Silveira',
    company: 'Auto Mecânica Express',
    contact: '(11) 98765-4321',
    product: 'Sistema Operacional KAEN',
    value: 6800,
    stage: 'negociacao',
    nextAction: 'Enviar demonstração interativa por vídeo na segunda',
    notes: 'Demonstrou alto interesse em organizar histórico de clientes e emitir orçamentos digitais.',
    updatedAt: '2026-09-26T15:00:00Z',
  },
  {
    id: 'ld_02',
    clientName: 'Mariana Fontes',
    company: 'Studio Gourmet',
    contact: 'mariana@gourmet.com',
    product: 'Consultoria de Processos',
    value: 4200,
    stage: 'proposta',
    nextAction: 'Aguardando validação da diretoria financeira',
    notes: 'Proposta encaminhada com validade até 30/09.',
    updatedAt: '2026-09-25T11:30:00Z',
  },
  {
    id: 'ld_03',
    clientName: 'Carlos Eduardo',
    company: 'Log Express',
    contact: '(21) 99881-2233',
    product: 'KVB Fleet Tracker',
    value: 9500,
    stage: 'fechado',
    nextAction: 'Iniciar onboarding técnico e emissão de nota',
    notes: 'Contrato assinado em 24/09.',
    updatedAt: '2026-09-24T17:00:00Z',
  },
];

const DEFAULT_WORKOUTS: WorkoutRecord[] = [
  {
    id: 'wo_01',
    activity: 'Jiu-jitsu',
    icon: 'Swords',
    date: '2026-09-25',
    durationMinutes: 75,
    intensity: 'intensa',
    notes: 'Foco em raspagem de meia guarda profunda e passagem emborcando.',
  },
  {
    id: 'wo_02',
    activity: 'Musculação — Superior & Core',
    icon: 'Dumbbell',
    date: '2026-09-24',
    durationMinutes: 55,
    intensity: 'moderada',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 10, weightKg: 70 },
      { name: 'Barra Fixa', sets: 4, reps: 8 },
      { name: 'Desenvolvimento Militar', sets: 3, reps: 10, weightKg: 40 },
    ],
  },
];

const DEFAULT_MEALS: MealRecord[] = [
  {
    id: 'ml_01',
    mealType: 'cafe',
    time: '07:00',
    foods: '3 ovos mexidos, 2 fatias de pão integral, café preto sem açúcar',
    waterMl: 600,
    notes: 'Ótima energia matinal.',
  },
  {
    id: 'ml_02',
    mealType: 'almoco',
    time: '12:30',
    foods: 'Arroz integral, feijão preto, filé de frango grelhado e salada verde variada',
    waterMl: 700,
  },
];

const DEFAULT_MEMORY: MemoryNote[] = [
  {
    id: 'mem_01',
    title: 'Ideia para módulo de revisão ativa',
    content: 'O teste de memória imediato logo após fechar o vídeo da aula aumenta a retenção em mais de 70% segundo a neurociência.',
    category: 'estudo',
    tags: ['neurociencia', 'estudos', 'aprendizado'],
    pinned: true,
    createdAt: '2026-09-26T14:00:00Z',
  },
  {
    id: 'mem_02',
    title: 'Comprar cabo HDMI 2.1 longo',
    content: 'Para ligar o notebook ao monitor secundário da mesa sem esticar fios.',
    category: 'lembrete',
    tags: ['compras', 'setup'],
    pinned: false,
    createdAt: '2026-09-25T18:20:00Z',
  },
  {
    id: 'mem_03',
    title: 'Métrica de conversão para vendas de software',
    content: 'Abordar com prova social concreta (prints de economia de tempo) dobra a taxa de resposta na etapa de negociação.',
    category: 'projeto',
    tags: ['vendas', 'estrategia'],
    pinned: true,
    createdAt: '2026-09-24T09:10:00Z',
  },
];

const DEFAULT_GOALS: LifeGoal[] = [
  {
    id: 'gl_01',
    title: 'Aprovação com 90%+ de aproveitamento em Matemática',
    category: 'Estudos',
    deadline: '2026-12-15',
    targetValue: 100,
    currentValue: 78,
    unit: '%',
    milestones: [
      { id: 'm1', title: 'Completar Módulo 01 Fundamentos', done: true },
      { id: 'm2', title: 'Completar Módulo 02 Equações', done: false },
      { id: 'm3', title: 'Resolver 500 questões no banco', done: true },
      { id: 'm4', title: 'Zerar caderno de erros', done: false },
    ],
  },
  {
    id: 'gl_02',
    title: 'Reserva Financeira de Emergência & Investimentos',
    category: 'Finanças',
    deadline: '2026-12-31',
    targetValue: 20000,
    currentValue: 13500,
    unit: 'R$',
    milestones: [
      { id: 'm5', title: 'Atingir primeiros R$ 5.000', done: true },
      { id: 'm6', title: 'Atingir R$ 10.000 de caixa líquido', done: true },
      { id: 'm7', title: 'Atingir meta final de R$ 20.000', done: false },
    ],
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: '🎯 Próxima Sessão Pronta',
    message: 'Matemática — Aula 04: Potenciação (17:42 restantes). Pronto para continuar?',
    type: 'estudo',
    timestamp: 'Há 15 min',
    read: false,
    actionModule: 'estudos',
  },
  {
    id: 'notif_02',
    title: '🧠 4 Flashcards para Revisão',
    message: 'O algoritmo de repetição espaçada separou seus cards de Matemática e História.',
    type: 'estudo',
    timestamp: 'Há 1 hora',
    read: false,
    actionModule: 'estudos',
  },
  {
    id: 'notif_03',
    title: '💰 Nova Entrada Registrada',
    message: 'R$ 3.500 recebidos do projeto KAEN Motors.',
    type: 'financeiro',
    timestamp: 'Ontem',
    read: true,
    actionModule: 'financas',
  },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal_01',
    title: 'Mapa Mental — Potenciação e Radiciação',
    category: 'estudos',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-25',
    description: 'Resumo visual com 7 regras fundamentais para provas de alto nível.',
    projectRelated: 'Matemática Essencial',
    tags: ['matemática', 'resumo', 'caderno'],
  },
  {
    id: 'gal_02',
    title: 'Graduação e Faixa no Jiu-Jitsu',
    category: 'treinos',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-20',
    description: 'Treino de graduação com equipe e rolas intensos de 1h30.',
    tags: ['jiu-jitsu', 'treino', 'evolução'],
  },
  {
    id: 'gal_03',
    title: 'Arquitetura do KVB System no iPad',
    category: 'projetos',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-22',
    description: 'Estruturação do fluxo de banco de dados e automações modulares.',
    projectRelated: 'KVB System',
    tags: ['kvb', 'arquitetura', 'software'],
  },
  {
    id: 'gal_04',
    title: 'Reunião de Diagnóstico Comercial KAEN',
    category: 'trabalho',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-24',
    description: 'Apresentação da proposta de automação de pós-venda para clientes da oficina.',
    projectRelated: 'KAEN Motors',
    tags: ['comercial', 'kaen', 'consultoria'],
  },
];

const DEFAULT_JOURNAL: JournalEntry[] = [
  {
    id: 'jrn_01',
    date: '2026-09-26',
    content: 'Hoje o dia rendeu muito bem. Acordei às 06:30, finalizei a Aula 03 de frações e consegui avançar na proposta da KAEN. À noite fiz treino de passagem de guarda no Jiu-jitsu.',
    mood: 'produtivo',
    tags: ['foco', 'estudos', 'jiu-jitsu'],
    createdAt: '2026-09-26T22:45:00Z',
  },
  {
    id: 'jrn_02',
    date: '2026-09-25',
    content: 'Dediquei 2 horas diretas na estruturação do banco de dados do KVB System. Resolvi 20 questões no banco de matemática com 85% de acertos.',
    mood: 'focado',
    tags: ['programação', 'kvb', 'matemática'],
    createdAt: '2026-09-25T23:10:00Z',
  },
];

const DEFAULT_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl_01',
    monthYear: 'Setembro 2026',
    date: '2026-09-25',
    title: 'Lançamento da V2 do KVB System',
    category: 'projeto',
    description: 'Arquitetura modular de dados entregue e aprovada para fase de testes.',
    icon: 'FolderKanban',
  },
  {
    id: 'tl_02',
    monthYear: 'Setembro 2026',
    date: '2026-09-22',
    title: 'Marco de 130 horas líquidas de estudo',
    category: 'estudo',
    description: 'Superou a meta mensal da Academy com foco em Exatas e Raciocínio Lógico.',
    icon: 'GraduationCap',
  },
  {
    id: 'tl_03',
    monthYear: 'Agosto 2026',
    date: '2026-08-15',
    title: 'Início da consultoria KAEN Motors',
    category: 'financeiro',
    description: 'Contrato comercial fechado e primeira parcela recebida.',
    icon: 'Wallet',
  },
  {
    id: 'tl_04',
    monthYear: 'Agosto 2026',
    date: '2026-08-01',
    title: 'Conquista de faixa & constância no Jiu-Jitsu',
    category: 'treino',
    description: 'Mais de 40 treinos consecutivos registrados sem faltas semanais.',
    icon: 'Dumbbell',
  },
];

const DEFAULT_SLEEP: SleepRecord[] = [
  {
    id: 'slp_01',
    date: '2026-09-26',
    sleepTime: '23:00',
    wakeTime: '06:30',
    durationHours: 7.5,
    quality: 'excelente',
    notes: 'Sono profundo, sem celular 30 min antes de deitar.',
  },
  {
    id: 'slp_02',
    date: '2026-09-25',
    sleepTime: '23:30',
    wakeTime: '06:30',
    durationHours: 7.0,
    quality: 'bom',
    notes: 'Boa recuperação muscular pós-treino.',
  },
];

const DEFAULT_WORK: WorkDeal[] = [
  {
    id: 'wrk_01',
    client: 'Oficina KAEN Motors',
    project: 'Sistema de Atendimento & CRM',
    status: 'em_andamento',
    value: 12500,
    deadline: '2026-10-25',
    nextAction: 'Enviar versão de testes do dashboard de ordens de serviço',
  },
  {
    id: 'wrk_02',
    client: 'Log Express Frota',
    project: 'KVB Fleet Tracker',
    status: 'proposta',
    value: 9500,
    deadline: '2026-11-10',
    nextAction: 'Reunião de apresentação técnica com diretor financeiro',
  },
];

// Memory Event Dispatcher for instantaneous cross-component updates
const listeners = new Set<() => void>();

function notifyChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Listener notify error', e);
    }
  });
}

export const StorageService = {
  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },

  // Config
  getConfig(): AppConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_APP_CONFIG;
    try {
      return { ...DEFAULT_APP_CONFIG, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_APP_CONFIG;
    }
  },

  saveConfig(config: AppConfig) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    notifyChange();
  },

  // Profile
  getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    try {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile) {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    notifyChange();
  },

  // Subjects
  getSubjects(): Subject[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) return DEFAULT_SUBJECTS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SUBJECTS;
    }
  },

  saveSubjects(subjects: Subject[]) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    notifyChange();
  },

  // Learned Classes (Suas Aulas Registradas & O Que Aprendeu - Sem Vídeo)
  getLearnedClasses(): LearnedClass[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LEARNED_CLASSES);
    if (!raw) return DEFAULT_LEARNED_CLASSES;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_LEARNED_CLASSES;
    }
  },

  saveLearnedClass(item: LearnedClass): void {
    const list = this.getLearnedClasses();
    const index = list.findIndex((c) => c.id === item.id);
    let updated: LearnedClass[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.LEARNED_CLASSES, JSON.stringify(updated));
    notifyChange();
  },

  deleteLearnedClass(id: string): void {
    const list = this.getLearnedClasses().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEARNED_CLASSES, JSON.stringify(list));
    notifyChange();
  },

  getLatestLearnedClass(): LearnedClass | undefined {
    const list = this.getLearnedClasses();
    return list.length > 0 ? list[0] : undefined;
  },

  // Courses
  getCourses(): Course[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) return DEFAULT_COURSES;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_COURSES;
    }
  },

  saveCourses(courses: Course[]) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    notifyChange();
  },

  updateLessonProgress(courseId: string, lessonId: string, timestampSeconds: number, completed?: boolean) {
    const courses = this.getCourses();
    let updated = false;

    courses.forEach((course) => {
      if (course.id === courseId) {
        course.modules.forEach((mod) => {
          mod.lessons.forEach((les) => {
            if (les.id === lessonId) {
              les.currentTimestampSeconds = timestampSeconds;
              if (completed !== undefined) {
                les.completed = completed;
              }
              updated = true;
            }
          });
        });

        // Recalculate progress
        let total = 0;
        let done = 0;
        course.modules.forEach((m) => {
          m.lessons.forEach((l) => {
            total++;
            if (l.completed) done++;
          });
        });
        course.totalLessons = total;
        course.completedLessons = done;
        course.progressPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
      }
    });

    if (updated) {
      this.saveCourses(courses);
    }
  },

  addLessonNote(courseId: string, lessonId: string, text: string, timestampSeconds: number) {
    const courses = this.getCourses();
    courses.forEach((c) => {
      if (c.id === courseId) {
        c.modules.forEach((m) => {
          m.lessons.forEach((l) => {
            if (l.id === lessonId) {
              l.notes.push({
                id: 'note_' + Date.now(),
                lessonId,
                timestampSeconds,
                text,
                createdAt: new Date().toISOString(),
              });
            }
          });
        });
      }
    });
    this.saveCourses(courses);
  },

  // Questions
  getQuestions(): Question[] {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) return DEFAULT_QUESTIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_QUESTIONS;
    }
  },

  saveQuestions(questions: Question[]) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    notifyChange();
  },

  toggleFavoriteQuestion(questionId: string) {
    const questions = this.getQuestions();
    const q = questions.find((item) => item.id === questionId);
    if (q) {
      q.isFavorite = !q.isFavorite;
      this.saveQuestions(questions);
    }
  },

  // Error Notebook
  getErrorNotebook(): ErrorNotebookItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ERROR_NOTEBOOK);
    if (!raw) return DEFAULT_ERROR_NOTEBOOK;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_ERROR_NOTEBOOK;
    }
  },

  saveErrorNotebook(items: ErrorNotebookItem[]) {
    localStorage.setItem(STORAGE_KEYS.ERROR_NOTEBOOK, JSON.stringify(items));
    notifyChange();
  },

  registerQuestionAnswer(questionId: string, selectedOptionIndex: number, timeSpentSeconds: number): { isCorrect: boolean } {
    const questions = this.getQuestions();
    const q = questions.find((item) => item.id === questionId);
    if (!q) return { isCorrect: false };

    const isCorrect = q.correctOptionIndex === selectedOptionIndex;

    // Update subject stats
    const subjects = this.getSubjects();
    const sub = subjects.find((s) => s.id === q.subjectId);
    if (sub) {
      sub.totalQuestionsAnswered = (sub.totalQuestionsAnswered || 0) + 1;
      if (isCorrect) {
        sub.totalQuestionsCorrect = (sub.totalQuestionsCorrect || 0) + 1;
      }
      this.saveSubjects(subjects);
    }

    // If incorrect, add/increment in Error Notebook
    const errors = this.getErrorNotebook();
    const existingErr = errors.find((e) => e.question.id === questionId);
    if (!isCorrect) {
      if (existingErr) {
        existingErr.mistakeCount++;
        existingErr.lastAttemptAt = new Date().toISOString();
        existingErr.resolved = false;
      } else {
        errors.unshift({
          id: 'err_' + Date.now(),
          question: q,
          mistakeCount: 1,
          lastAttemptAt: new Date().toISOString(),
          resolved: false,
        });
      }
      this.saveErrorNotebook(errors);
    } else if (existingErr) {
      // Marked as resolved if retried correctly
      existingErr.resolved = true;
      existingErr.lastAttemptAt = new Date().toISOString();
      this.saveErrorNotebook(errors);
    }

    return { isCorrect };
  },

  // Flashcards
  getFlashcards(): Flashcard[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (!raw) return DEFAULT_FLASHCARDS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_FLASHCARDS;
    }
  },

  saveFlashcards(flashcards: Flashcard[]) {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
    notifyChange();
  },

  reviewFlashcard(cardId: string, rating: 'facil' | 'medio' | 'dificil') {
    const cards = this.getFlashcards();
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    let daysToAdd = 1;
    if (rating === 'facil') {
      daysToAdd = (card.intervalDays || 1) * 2 + 2;
    } else if (rating === 'medio') {
      daysToAdd = Math.max(1, Math.round((card.intervalDays || 1) * 1.5));
    } else {
      daysToAdd = 1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    card.repetitions = (card.repetitions || 0) + 1;
    card.intervalDays = daysToAdd;
    card.nextReviewDate = nextDate.toISOString().split('T')[0];
    card.lastReviewedAt = new Date().toISOString();
    card.difficulty = rating;

    this.saveFlashcards(cards);
  },

  // Simulados
  getSimulados(): Simulado[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SIMULADOS);
    if (!raw) return DEFAULT_SIMULADOS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SIMULADOS;
    }
  },

  saveSimulado(simulado: Simulado) {
    const sims = this.getSimulados();
    sims.unshift(simulado);
    localStorage.setItem(STORAGE_KEYS.SIMULADOS, JSON.stringify(sims));
    notifyChange();
  },

  // Study Sessions
  getStudySessions(): StudySession[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addStudySession(session: Omit<StudySession, 'id'>) {
    const sessions = this.getStudySessions();
    const newSession: StudySession = {
      ...session,
      id: 'sess_' + Date.now(),
    };
    sessions.unshift(newSession);
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(sessions));

    // Update subject studied seconds
    const subjects = this.getSubjects();
    const sub = subjects.find((s) => s.id === session.subjectId);
    if (sub) {
      sub.totalSecondsStudied = (sub.totalSecondsStudied || 0) + session.durationSeconds;
      this.saveSubjects(subjects);
    }

    notifyChange();
    return newSession;
  },

  // Tasks
  getTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return DEFAULT_TASKS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    notifyChange();
  },

  addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: 'tsk_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  updateTaskStatus(taskId: string, status: Task['status']) {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      if (status === 'concluida') {
        task.completedAt = new Date().toISOString();
      } else {
        task.completedAt = undefined;
      }
      this.saveTasks(tasks);
    }
  },

  deleteTask(taskId: string) {
    // Soft delete
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.deletedAt = new Date().toISOString();
      this.saveTasks(tasks);
    }
  },

  // Habits
  getHabits(): Habit[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) return DEFAULT_HABITS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_HABITS;
    }
  },

  saveHabits(habits: Habit[]) {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    notifyChange();
  },

  toggleHabitDay(habitId: string, dateStr: string) {
    const habits = this.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      const current = !!habit.completions[dateStr];
      habit.completions[dateStr] = !current;
      if (!current) {
        habit.streak = (habit.streak || 0) + 1;
      } else {
        habit.streak = Math.max(0, (habit.streak || 1) - 1);
      }
      this.saveHabits(habits);
    }
  },

  // Routine
  getRoutine(): RoutineBlock[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINE);
    if (!raw) return DEFAULT_ROUTINE;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_ROUTINE;
    }
  },

  saveRoutine(routine: RoutineBlock[]) {
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routine));
    notifyChange();
  },

  updateRoutineStatus(blockId: string, status: RoutineBlock['status']) {
    const blocks = this.getRoutine();
    const block = blocks.find((b) => b.id === blockId);
    if (block) {
      block.status = status;
      this.saveRoutine(blocks);
    }
  },

  // Projects
  getProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return DEFAULT_PROJECTS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROJECTS;
    }
  },

  saveProjects(projects: Project[]) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyChange();
  },

  // Finances
  getFinances(): FinanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FINANCES);
    if (!raw) return DEFAULT_FINANCES;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_FINANCES;
    }
  },

  saveFinances(records: FinanceRecord[]) {
    localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(records));
    notifyChange();
  },

  addFinanceRecord(record: Omit<FinanceRecord, 'id' | 'createdAt'>) {
    const list = this.getFinances();
    const newRecord: FinanceRecord = {
      ...record,
      id: 'fin_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    list.unshift(newRecord);
    this.saveFinances(list);
    return newRecord;
  },

  // Leads
  getLeads(): LeadDeal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (!raw) return DEFAULT_LEADS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_LEADS;
    }
  },

  saveLeads(leads: LeadDeal[]) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    notifyChange();
  },

  // Workouts
  getWorkouts(): WorkoutRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (!raw) return DEFAULT_WORKOUTS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_WORKOUTS;
    }
  },

  addWorkout(wo: Omit<WorkoutRecord, 'id'>) {
    const list = this.getWorkouts();
    const newWo = { ...wo, id: 'wo_' + Date.now() };
    list.unshift(newWo);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(list));
    notifyChange();
    return newWo;
  },

  // Meals
  getMeals(): MealRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MEALS);
    if (!raw) return DEFAULT_MEALS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_MEALS;
    }
  },

  addMeal(meal: Omit<MealRecord, 'id'>) {
    const list = this.getMeals();
    const newMeal = { ...meal, id: 'ml_' + Date.now() };
    list.unshift(newMeal);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(list));
    notifyChange();
    return newMeal;
  },

  // Memory
  getMemoryNotes(): MemoryNote[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORY);
    if (!raw) return DEFAULT_MEMORY;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_MEMORY;
    }
  },

  saveMemoryNotes(notes: MemoryNote[]) {
    localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(notes));
    notifyChange();
  },

  addMemoryNote(note: Omit<MemoryNote, 'id' | 'createdAt'>) {
    const notes = this.getMemoryNotes();
    const newNote: MemoryNote = {
      ...note,
      id: 'mem_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    this.saveMemoryNotes(notes);
    return newNote;
  },

  // Goals
  getGoals(): LifeGoal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) return DEFAULT_GOALS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_GOALS;
    }
  },

  saveGoals(goals: LifeGoal[]) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    notifyChange();
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return DEFAULT_NOTIFICATIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  },

  markNotificationRead(id: string) {
    const notifs = this.getNotifications();
    const item = notifs.find((n) => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      notifyChange();
    }
  },

  markAllNotificationsRead() {
    const notifs = this.getNotifications();
    notifs.forEach((n) => (n.read = true));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    notifyChange();
  },

  // Gallery (Galeria da Vida)
  getGallery(): GalleryItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!raw) return DEFAULT_GALLERY;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_GALLERY;
    }
  },

  saveGallery(items: GalleryItem[]) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
    notifyChange();
  },

  addGalleryItem(item: Omit<GalleryItem, 'id'>) {
    const list = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: 'gal_' + Date.now(),
    };
    list.unshift(newItem);
    this.saveGallery(list);
    return newItem;
  },

  // Journal (Diário "Como foi seu dia?")
  getJournal(): JournalEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (!raw) return DEFAULT_JOURNAL;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_JOURNAL;
    }
  },

  saveJournal(entries: JournalEntry[]) {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
    notifyChange();
  },

  addJournalEntry(content: string, mood?: JournalEntry['mood'], tags: string[] = []) {
    const list = this.getJournal();
    const newEntry: JournalEntry = {
      id: 'jrn_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      content,
      mood: mood || 'produtivo',
      tags,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEntry);
    this.saveJournal(list);
    return newEntry;
  },

  // Timeline & Meu Ano
  getTimeline(): TimelineEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    if (!raw) return DEFAULT_TIMELINE;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TIMELINE;
    }
  },

  saveTimeline(events: TimelineEvent[]) {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(events));
    notifyChange();
  },

  addTimelineEvent(event: Omit<TimelineEvent, 'id'>) {
    const list = this.getTimeline();
    const newEvent: TimelineEvent = {
      ...event,
      id: 'tl_' + Date.now(),
    };
    list.unshift(newEvent);
    this.saveTimeline(list);
    return newEvent;
  },

  // Sleep Tracker (Sono)
  getSleepRecords(): SleepRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SLEEP);
    if (!raw) return DEFAULT_SLEEP;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SLEEP;
    }
  },

  saveSleepRecords(records: SleepRecord[]) {
    localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(records));
    notifyChange();
  },

  addSleepRecord(record: Omit<SleepRecord, 'id'>) {
    const list = this.getSleepRecords();
    const newRecord: SleepRecord = {
      ...record,
      id: 'slp_' + Date.now(),
    };
    list.unshift(newRecord);
    this.saveSleepRecords(list);
    return newRecord;
  },

  // Work (Espaço Profissional)
  getWorkDeals(): WorkDeal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WORK);
    if (!raw) return DEFAULT_WORK;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_WORK;
    }
  },

  saveWorkDeals(deals: WorkDeal[]) {
    localStorage.setItem(STORAGE_KEYS.WORK, JSON.stringify(deals));
    notifyChange();
  },

  addWorkDeal(deal: Omit<WorkDeal, 'id'>) {
    const list = this.getWorkDeals();
    const newDeal: WorkDeal = {
      ...deal,
      id: 'wrk_' + Date.now(),
    };
    list.unshift(newDeal);
    this.saveWorkDeals(list);
    return newDeal;
  },

  // Growth & Health Update
  updateProfileGrowth(heightCm?: number, weightKg?: number, growthNotes?: string) {
    const profile = this.getProfile();
    const today = new Date().toISOString().split('T')[0];

    if (heightCm) {
      profile.heightCm = heightCm;
      profile.heightHistory = profile.heightHistory || [];
      profile.heightHistory.push({ date: today, heightCm });
    }

    if (weightKg) {
      profile.weightKg = weightKg;
      profile.weightHistory = profile.weightHistory || [];
      profile.weightHistory.push({ date: today, weightKg });
    }

    if (growthNotes !== undefined) {
      profile.growthNotes = growthNotes;
    }

    this.saveProfile(profile);
  },

  // Export / Import Full Database Backup
  exportAllDataJSON(): string {
    const backup = {
      version: '2.6.0',
      exportedAt: new Date().toISOString(),
      config: this.getConfig(),
      profile: this.getProfile(),
      subjects: this.getSubjects(),
      courses: this.getCourses(),
      questions: this.getQuestions(),
      errorNotebook: this.getErrorNotebook(),
      flashcards: this.getFlashcards(),
      simulados: this.getSimulados(),
      studySessions: this.getStudySessions(),
      tasks: this.getTasks(),
      habits: this.getHabits(),
      routine: this.getRoutine(),
      projects: this.getProjects(),
      finances: this.getFinances(),
      leads: this.getLeads(),
      workouts: this.getWorkouts(),
      meals: this.getMeals(),
      memory: this.getMemoryNotes(),
      goals: this.getGoals(),
      notifications: this.getNotifications(),
      gallery: this.getGallery(),
      journal: this.getJournal(),
      timeline: this.getTimeline(),
      sleep: this.getSleepRecords(),
      work: this.getWorkDeals(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importDataJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.config) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
      if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.subjects) localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(data.subjects));
      if (data.courses) localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(data.courses));
      if (data.questions) localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(data.questions));
      if (data.errorNotebook) localStorage.setItem(STORAGE_KEYS.ERROR_NOTEBOOK, JSON.stringify(data.errorNotebook));
      if (data.flashcards) localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(data.flashcards));
      if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
      if (data.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
      if (data.routine) localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(data.routine));
      if (data.projects) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      if (data.finances) localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(data.finances));
      if (data.leads) localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(data.leads));
      if (data.memory) localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(data.memory));
      if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
      if (data.gallery) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
      if (data.journal) localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(data.journal));
      if (data.timeline) localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(data.timeline));
      if (data.sleep) localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(data.sleep));
      if (data.work) localStorage.setItem(STORAGE_KEYS.WORK, JSON.stringify(data.work));
      notifyChange();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  // Reset to demo data
  resetToFactoryDefaults() {
    localStorage.clear();
    notifyChange();
  },
};
