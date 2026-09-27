/**
 * LIFE OS — Core Type Definitions
 * Scalable data models for all modules and personal operating system states.
 */

export type ModuleId =
  | 'dashboard'
  | 'assistente'
  | 'estudos'
  | 'tarefas'
  | 'habitos'
  | 'rotina'
  | 'projetos'
  | 'trabalho'
  | 'financas'
  | 'vendas'
  | 'treinos'
  | 'saude'
  | 'alimentacao'
  | 'galeria'
  | 'diario'
  | 'timeline'
  | 'inbox'
  | 'memoria'
  | 'metas'
  | 'calendario'
  | 'ia'
  | 'configuracoes';

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  email: string;
  avatarUrl?: string;
  language: string;
  timezone: string;
  currency: string;
  wakeTime: string;
  sleepTime: string;
  age?: number;
  birthDate?: string;
  heightCm?: number;
  heightHistory?: { date: string; heightCm: number }[];
  weightKg?: number;
  weightHistory?: { date: string; weightKg: number }[];
  growthNotes?: string;
  isStudent: boolean;
  isWorker: boolean;
  hasPersonalProjects: boolean;
  primaryGoals: string[];
  forgetReason: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SleepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  sleepTime: string; // "23:00"
  wakeTime: string; // "07:00"
  durationHours: number;
  quality: 'ruim' | 'regular' | 'bom' | 'excelente';
  notes?: string;
}

export type GalleryCategory = 'estudos' | 'treinos' | 'trabalho' | 'projetos' | 'memorias';

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  date: string;
  description: string;
  projectRelated?: string;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood?: 'produtivo' | 'focado' | 'cansado' | 'inspirado' | 'equilibrado';
  tags: string[];
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  monthYear: string; // "Setembro 2026"
  date: string;
  title: string;
  category: 'estudo' | 'projeto' | 'treino' | 'financeiro' | 'conquista';
  description: string;
  icon: string;
}

export interface WorkDeal {
  id: string;
  client: string;
  project: string;
  status: 'proposta' | 'em_andamento' | 'revisao' | 'concluido';
  value: number;
  deadline: string;
  nextAction: string;
  documents?: { name: string; url: string }[];
}

/* ==================== ESTUDOS (LIFE OS ACADEMY) ==================== */

export type StudySessionType =
  | 'aula'
  | 'leitura'
  | 'exercicios'
  | 'revisao'
  | 'flashcards'
  | 'simulado'
  | 'redacao'
  | 'livre';

export type QuestionDifficulty = 'facil' | 'medio' | 'dificil';
export type MasteryLevel = 'dominado' | 'em_desenvolvimento' | 'revisar';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalSecondsStudied: number;
  masteryLevel: MasteryLevel;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
}

export interface LearnedClass {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  source: string; // ex: "YouTube", "Curso Fênix", "Escola / Presencial", "Faculdade", "Apostila / Livro", "Outro"
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  whatILearned: string; // "O que você aprendeu"
  keyConcepts: string[]; // Conceitos-chave / Fórmulas
  questionsOrDoubts?: string; // Dúvidas e pontos de atenção
  status: 'concluida' | 'revisar' | 'duvida';
  reviewDate?: string;
  createdAt: string;
}

export interface LessonNote {
  id: string;
  lessonId: string;
  timestampSeconds: number;
  text: string;
  createdAt: string;
}

export interface LessonAttachment {
  id: string;
  title: string;
  type: 'pdf' | 'resumo' | 'link' | 'imagem';
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  videoUrl: string; // real video or interactive stream
  thumbnailUrl?: string;
  description: string;
  completed: boolean;
  currentTimestampSeconds: number;
  notes: LessonNote[];
  attachments: LessonAttachment[];
  summary?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  description: string;
  category: string;
  coverUrl: string;
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
  modules: CourseModule[];
}

export interface Question {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
  year?: number;
  source?: string; // banca ou origem
  isFavorite?: boolean;
}

export interface QuestionAnswerRecord {
  id: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  answeredAt: string;
  timeSpentSeconds: number;
}

export interface ErrorNotebookItem {
  id: string;
  question: Question;
  mistakeCount: number;
  lastAttemptAt: string;
  resolved: boolean;
  userNote?: string;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  subjectName: string;
  front: string;
  back: string;
  difficulty: QuestionDifficulty;
  nextReviewDate: string;
  repetitions: number;
  intervalDays: number;
  lastReviewedAt?: string;
}

export interface Simulado {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  questions: Question[];
  completedAt?: string;
  scorePercentage?: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenMinutes?: number;
  subjectDiagnostic?: Record<string, { total: number; correct: number }>;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  sessionType: StudySessionType;
  questionsAnswered?: number;
  questionsCorrect?: number;
}

export interface StudyPlanItem {
  id: string;
  dayOfWeek: number; // 0=Domingo, 1=Segunda, etc.
  time: string;
  subject: string;
  durationMinutes: number;
  priority: 'alta' | 'media' | 'baixa';
  completed: boolean;
}

/* ==================== TAREFAS ==================== */

export type TaskPriority = 'alta' | 'media' | 'baixa';
export type TaskStatus = 'a_fazer' | 'em_andamento' | 'concluida' | 'adiada' | 'cancelada';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  recurrence?: 'nenhuma' | 'diaria' | 'semanal' | 'mensal';
  estimatedMinutes?: number;
  project?: string;
  tags?: string[];
  status: TaskStatus;
  completedAt?: string;
  deletedAt?: string;
  createdAt: string;
}

/* ==================== HÁBITOS ==================== */

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  frequency: 'diaria' | 'dias_uteis' | 'personalizada';
  targetTime?: string;
  completions: Record<string, boolean>; // date string "YYYY-MM-DD": boolean
  streak: number;
  createdAt: string;
}

/* ==================== ROTINA ==================== */

export type RoutineStatus = 'pendente' | 'em_andamento' | 'concluido' | 'pulado' | 'adiado';

export interface RoutineBlock {
  id: string;
  time: string; // "08:00"
  durationMinutes: number;
  title: string;
  subtitle?: string;
  category: string;
  icon: string;
  status: RoutineStatus;
}

/* ==================== PROJETOS ==================== */

export interface Project {
  id: string;
  name: string;
  objective: string;
  description: string;
  deadline: string;
  budget: number;
  spent: number;
  revenue: number;
  progress: number; // 0-100
  status: 'planejamento' | 'ativo' | 'em_pausa' | 'concluido';
  nextSteps: string[];
  createdAt: string;
}

/* ==================== FINANCEIRO ==================== */

export type FinanceType = 'entrada' | 'saida' | 'a_receber';

export interface FinanceRecord {
  id: string;
  type: FinanceType;
  amount: number;
  date: string;
  category: string;
  description: string;
  project?: string;
  createdAt: string;
}

/* ==================== CRM / VENDAS ==================== */

export type LeadStage = 'lead' | 'abordado' | 'respondeu' | 'negociacao' | 'proposta' | 'fechado';

export interface LeadDeal {
  id: string;
  clientName: string;
  company?: string;
  contact: string;
  product: string;
  value: number;
  stage: LeadStage;
  nextAction: string;
  notes?: string;
  updatedAt: string;
}

/* ==================== TREINOS & ALIMENTAÇÃO ==================== */

export interface WorkoutRecord {
  id: string;
  activity: string;
  icon: string;
  date: string;
  durationMinutes: number;
  intensity: 'leve' | 'moderada' | 'intensa';
  notes?: string;
  exercises?: { name: string; sets: number; reps: number; weightKg?: number }[];
}

export interface MealRecord {
  id: string;
  mealType: 'cafe' | 'almoco' | 'lanche' | 'jantar';
  time: string;
  foods: string;
  waterMl: number;
  notes?: string;
}

/* ==================== MEMÓRIA & DIÁRIO ==================== */

export type MemoryCategory = 'ideia' | 'lembrete' | 'estudo' | 'projeto' | 'pessoal' | 'financeiro' | 'outro';

export interface MemoryNote {
  id: string;
  title: string;
  content: string;
  category: MemoryCategory;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  deletedAt?: string;
}

/* ==================== METAS ==================== */

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface LifeGoal {
  id: string;
  title: string;
  category: string;
  deadline: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  milestones: Milestone[];
}

/* ==================== NOTIFICAÇÕES ==================== */

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'estudo' | 'tarefa' | 'financeiro' | 'habito' | 'sistema';
  timestamp: string;
  read: boolean;
  actionModule?: ModuleId;
}
