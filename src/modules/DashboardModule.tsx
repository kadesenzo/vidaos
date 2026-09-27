/**
 * LIFE OS — Central de Comando (Dashboard Principal)
 * O QUE ESTÁ ACONTECENDO NA SUA VIDA?
 * ⚡ AGORA | 📅 HOJE | 🎯 OBJETIVOS | 🔥 HÁBITOS | 📚 ESTUDOS | 🥋 ATIVIDADE | 💰 DINHEIRO | 🚀 PROJETOS | 🧠 MEMÓRIA
 * Inclui campo de comando de linguagem natural integrado diretamente na home!
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  GraduationCap,
  CheckSquare,
  Flame,
  Wallet,
  Clock,
  Dumbbell,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Calendar,
  Send,
  Bell,
  Volume2,
  FolderKanban,
  Target,
  Image as ImageIcon,
  BookMarked,
  BookOpen,
  Milestone,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import { UserProfile, ModuleId, Task, RoutineBlock, Course } from '../types';
import { AppConfig } from '../config/appConfig';
import { ActionParserService, ParseResult } from '../services/actionParserService';
import { NotificationService } from '../services/notificationService';

interface DashboardModuleProps {
  profile: UserProfile;
  config: AppConfig;
  onNavigateToModule: (module: ModuleId, contextId?: string) => void;
  onStartStudyLesson: (courseId: string, lessonId: string) => void;
  onOpenQuickCapture: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  profile,
  config,
  onNavigateToModule,
  onStartStudyLesson,
  onOpenQuickCapture,
}) => {
  const [actionCompleted, setActionCompleted] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  const [nlpResult, setNlpResult] = useState<ParseResult | null>(null);

  const tasks = StorageService.getTasks();
  const subjects = StorageService.getSubjects();
  const courses = StorageService.getCourses();
  const habits = StorageService.getHabits();
  const routine = StorageService.getRoutine();
  const finances = StorageService.getFinances();
  const workouts = StorageService.getWorkouts();
  const flashcards = StorageService.getFlashcards();
  const projects = StorageService.getProjects();
  const goals = StorageService.getGoals();

  const pendingTasks = tasks.filter((t) => t.status === 'a_fazer' || t.status === 'em_andamento');
  const completedTasks = tasks.filter((t) => t.status === 'concluida');
  const totalTasks = tasks.length || 1;
  const dayProgressPercentage = Math.round((completedTasks.length / totalTasks) * 100);

  const primaryTask = pendingTasks.find((t) => t.priority === 'alta') || pendingTasks[0];
  const latestClass = StorageService.getLatestLearnedClass();

  const handleCompletePrimaryAction = () => {
    setActionCompleted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b'],
    });

    if (primaryTask) {
      StorageService.updateTaskStatus(primaryTask.id, 'concluida');
    }
  };

  const handleExecuteNlp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpInput.trim()) return;

    const res = ActionParserService.parseAndExecute(nlpInput);
    setNlpResult(res);
    setNlpInput('');
    confetti({ particleCount: 65, spread: 60, origin: { y: 0.7 } });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const todayStr = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* 1. Header Hero Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl ios-glass-card border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-600/20 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono tracking-wider uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SISTEMA OPERACIONAL PESSOAL • CENTRAL DE COMANDO</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {profile.nickname || profile.name || 'Enzo'}.
          </h1>
          <p className="text-sm text-slate-400 capitalize">
            {todayStr} • O que está acontecendo na sua vida hoje?
          </p>
        </div>

        {/* Quick Day Progress Gauge */}
        <div className="relative z-10 flex items-center gap-4 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base font-mono">
            {dayProgressPercentage}%
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Progresso do Dia</span>
            <span className="text-xs font-semibold text-white">
              {completedTasks.length} de {tasks.length} tarefas feitas
            </span>
          </div>
        </div>
      </div>

      {/* 2. Assistente Rápido em Linguagem Natural */}
      <div className="p-5 md:p-6 rounded-3xl ios-glass-card border border-indigo-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold font-mono uppercase">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Assistente de Ação Instantânea</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Ex: "Treinei jiu-jitsu 1h30, estudei matemática e gastei R$25"
          </span>
        </div>

        <form onSubmit={handleExecuteNlp} className="flex items-center gap-2">
          <input
            type="text"
            value={nlpInput}
            onChange={(e) => setNlpInput(e.target.value)}
            placeholder="Digite qualquer acontecimento, gasto, treino ou tarefa do seu dia..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl ios-button-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-md flex-shrink-0"
          >
            <span>Registrar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {nlpResult && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
            <span>✓ {nlpResult.feedbackMessage}</span>
            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded">
              {nlpResult.actions.length} ações
            </span>
          </div>
        )}
      </div>

      {/* 3. ⚡ AGORA (PRÓXIMA AÇÃO) */}
      <div className="p-6 md:p-7 rounded-3xl ios-glass-card border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-400">
              ⚡ AGORA — FOCO IMEDIATO
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Prioridade Máxima</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {actionCompleted
                ? 'Próxima: Continuar Módulo 01 — Potenciação (Aula 04)'
                : primaryTask
                ? primaryTask.title
                : 'Estudar Matemática Essencial — 35 minutos'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {actionCompleted
                ? 'Excelente trabalho! Você concluiu a tarefa principal. Agora continue sua sessão de estudos.'
                : primaryTask?.description ||
                  'Foco profundo sem distrações. Revisar fórmulas e resolver questões de fixação.'}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">
                {primaryTask?.category || 'Estudos'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ⏱️ ~{primaryTask?.estimatedMinutes || 35} minutos estimados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!actionCompleted ? (
              <>
                <button
                  onClick={() => onNavigateToModule('estudos')}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl ios-button-primary text-white text-xs font-bold shadow-lg"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>COMEÇAR AGORA</span>
                </button>
                <button
                  onClick={handleCompletePrimaryAction}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✓ Concluir</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✓ Concluída com sucesso!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. 📅 CENTRAL DE COMANDO — O QUE ESTÁ ACONTECENDO NA SUA VIDA? */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
            PAINEL GERAL DA VIDA
          </h2>
          <span className="text-xs text-slate-500">Acesse qualquer área diretamente</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {/* 📚 ESTUDOS */}
          <div
            onClick={() => onNavigateToModule('estudos')}
            className="p-4 rounded-3xl ios-glass-card ios-glass-card-hover cursor-pointer border border-white/10 space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">135h estudadas</span>
              <span className="text-[11px] text-slate-400">📚 Academy & Aulas</span>
            </div>
          </div>

          {/* 🥋 ATIVIDADE & TREINOS */}
          <div
            onClick={() => onNavigateToModule('treinos')}
            className="p-4 rounded-3xl ios-glass-card ios-glass-card-hover cursor-pointer border border-white/10 space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">Jiu-Jitsu 19h</span>
              <span className="text-[11px] text-slate-400">🥋 Treino programado</span>
            </div>
          </div>

          {/* 💰 DINHEIRO */}
          <div
            onClick={() => onNavigateToModule('financas')}
            className="p-4 rounded-3xl ios-glass-card ios-glass-card-hover cursor-pointer border border-white/10 space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-emerald-400 block">+R$ 3.5k recebidos</span>
              <span className="text-[11px] text-slate-400">💰 Fluxo financeiro</span>
            </div>
          </div>

          {/* 🚀 PROJETOS */}
          <div
            onClick={() => onNavigateToModule('projetos')}
            className="p-4 rounded-3xl ios-glass-card ios-glass-card-hover cursor-pointer border border-white/10 space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">KVB & KAEN</span>
              <span className="text-[11px] text-slate-400">🚀 Projetos ativos</span>
            </div>
          </div>

          {/* 🔥 HÁBITOS */}
          <div
            onClick={() => onNavigateToModule('habitos')}
            className="p-4 rounded-3xl ios-glass-card ios-glass-card-hover cursor-pointer border border-white/10 space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">14 dias streak</span>
              <span className="text-[11px] text-slate-400">🔥 Constância</span>
            </div>
          </div>

          {/* 🎯 OBJETIVOS & METAS */}
          <div
            onClick={() => onNavigateToModule('metas')}
            className="p-4 rounded-3xl ios-glass-card border border-white/10 cursor-pointer space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">78% progresso</span>
              <span className="text-[11px] text-slate-400">🎯 Meta acadêmica</span>
            </div>
          </div>

          {/* 📸 GALERIA DA VIDA */}
          <div
            onClick={() => onNavigateToModule('galeria')}
            className="p-4 rounded-3xl ios-glass-card border border-white/10 cursor-pointer space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">4 fotos</span>
              <span className="text-[11px] text-slate-400">📸 Memória visual</span>
            </div>
          </div>

          {/* 📖 DIÁRIO */}
          <div
            onClick={() => onNavigateToModule('diario')}
            className="p-4 rounded-3xl ios-glass-card border border-white/10 cursor-pointer space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">Hoje registrado</span>
              <span className="text-[11px] text-slate-400">📖 Diário do dia</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Última Aula & O Que Você Aprendeu & Rotina */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl ios-glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono uppercase text-indigo-400">
                ÚLTIMA AULA ASSISTIDA
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {latestClass?.source || 'YouTube'}
              </span>
            </div>

            {latestClass ? (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    {latestClass.subjectName}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {latestClass.date} • {latestClass.durationMinutes} min
                  </span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  {latestClass.title}
                </h4>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide block">
                    O que aprendi:
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    {latestClass.whatILearned}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Nenhuma aula registrada ainda.</p>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">Caderno de estudos</span>
            <button
              onClick={() => onNavigateToModule('estudos')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Caderno de Aulas</span>
            </button>
          </div>
        </div>

        <div className="p-6 rounded-3xl ios-glass-card border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono uppercase text-sky-400">
                ROTINA DE HOJE
              </span>
              <button
                onClick={() => onNavigateToModule('rotina')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <span>Ver cronograma</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {routine.slice(1, 5).map((block) => (
                <div
                  key={block.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                    block.status === 'em_andamento'
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white font-semibold'
                      : block.status === 'concluido'
                      ? 'bg-white/[0.02] border-white/5 text-slate-500 line-through'
                      : 'bg-white/5 border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400 w-12 text-[11px]">{block.time}</span>
                    <span>{block.title}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      block.status === 'em_andamento'
                        ? 'bg-indigo-500/40 text-indigo-200 animate-pulse'
                        : block.status === 'concluido'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {block.status === 'em_andamento' ? 'Agora' : block.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 mt-3 text-right">
            <button
              onClick={onOpenQuickCapture}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
            >
              <span>+ Capturar Registro Rápido</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
