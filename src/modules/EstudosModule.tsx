/**
 * LIFE OS ACADEMY — Módulo de Estudos Completo
 * Plataforma educacional integrada focada em:
 * 1. Caderno de Aulas & Aprendizado (Sem vídeos embutidos — registre suas aulas do YouTube, cursinhos ou escola e o que aprendeu)
 * 2. Estatísticas Detalhadas (Dia / Semana / Mês / Ano / Tudo) com horas e acertos por matéria
 * 3. Banco de Questões com Filtros Avançados (Banca, Ano, Matéria, Dificuldade)
 * 4. Modo Resolver com Gabarito Fundamentado e Cronômetro
 * 5. Caderno de Erros para fixação de pontos fracos
 * 6. Flashcards com Repetição Espaçada
 * 7. Simulados Modo Prova
 * 8. Cronômetro & Pomodoro de Estudo Integrado
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  RotateCcw,
  BookOpen,
  HelpCircle,
  BrainCircuit,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  Plus,
  ArrowRight,
  Filter,
  Check,
  Flame,
  Award,
  Search,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  Tag,
  BookMarked,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import {
  Subject,
  LearnedClass,
  Question,
  ErrorNotebookItem,
  Flashcard,
  Simulado,
  StudySessionType,
} from '../types';
import { AppConfig } from '../config/appConfig';

interface EstudosModuleProps {
  config: AppConfig;
  initialCourseId?: string;
  initialLessonId?: string;
  activeStudySeconds?: number;
  onUpdateActiveStudySeconds?: (secs: number) => void;
}

type AcademyTab =
  | 'inicio'
  | 'aulas'
  | 'estatisticas'
  | 'questoes'
  | 'resolver'
  | 'caderno_erros'
  | 'simulados'
  | 'flashcards'
  | 'cronometro';

export const EstudosModule: React.FC<EstudosModuleProps> = ({
  config,
  activeStudySeconds = 0,
  onUpdateActiveStudySeconds,
}) => {
  const [currentTab, setCurrentTab] = useState<AcademyTab>('inicio');

  // Data states
  const [learnedClasses, setLearnedClasses] = useState<LearnedClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [errorNotebook, setErrorNotebook] = useState<ErrorNotebookItem[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [simulados, setSimulados] = useState<Simulado[]>([]);

  // Filter & Search states for Learned Classes
  const [classSearch, setClassSearch] = useState('');
  const [classFilterSubject, setClassFilterSubject] = useState<string>('todas');
  const [classFilterSource, setClassFilterSource] = useState<string>('todas');
  const [classFilterStatus, setClassFilterStatus] = useState<string>('todas');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<LearnedClass | null>(null);

  // New/Edit Class Form State
  const [classTitle, setClassTitle] = useState('');
  const [classSubjectId, setClassSubjectId] = useState('sub_mat');
  const [classSource, setClassSource] = useState('YouTube');
  const [classDuration, setClassDuration] = useState('45');
  const [classDate, setClassDate] = useState(new Date().toISOString().split('T')[0]);
  const [classWhatILearned, setClassWhatILearned] = useState('');
  const [classKeyConcepts, setClassKeyConcepts] = useState('');
  const [classDoubts, setClassDoubts] = useState('');
  const [classStatus, setClassStatus] = useState<'concluida' | 'revisar' | 'duvida'>('concluida');

  // Question Runner states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>('todas');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('todas');
  const [filterBanca, setFilterBanca] = useState<string>('todas');

  // Flashcards state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [recallAnswer, setRecallAnswer] = useState('');

  // Statistics period filter
  const [statsPeriod, setStatsPeriod] = useState<'dia' | 'semana' | 'mes' | 'ano' | 'tudo'>('tudo');

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(activeStudySeconds || 0);
  const [timerSessionType, setTimerSessionType] = useState<StudySessionType>('aula');
  const [timerSubject, setTimerSubject] = useState<string>('sub_mat');

  // Load initial data
  const loadData = () => {
    setLearnedClasses(StorageService.getLearnedClasses());
    setSubjects(StorageService.getSubjects());
    setQuestions(StorageService.getQuestions());
    setErrorNotebook(StorageService.getErrorNotebook());
    setFlashcards(StorageService.getFlashcards());
    setSimulados(StorageService.getSimulados());
  };

  useEffect(() => {
    loadData();
    const unsub = StorageService.subscribe(loadData);
    return unsub;
  }, []);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          if (onUpdateActiveStudySeconds) onUpdateActiveStudySeconds(next);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, onUpdateActiveStudySeconds]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  const handleSaveTimerSession = () => {
    if (timerSeconds < 30) return;
    const subj = subjects.find((s) => s.id === timerSubject);
    StorageService.addStudySession({
      subjectId: timerSubject,
      subjectName: subj?.name || 'Geral',
      topic: 'Sessão de Foco',
      sessionType: timerSessionType,
      durationSeconds: timerSeconds,
      startedAt: new Date(Date.now() - timerSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
    });
    setTimerSeconds(0);
    setIsTimerRunning(false);
    if (onUpdateActiveStudySeconds) onUpdateActiveStudySeconds(0);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
  };

  // Open modal to create or edit class
  const handleOpenClassModal = (cls?: LearnedClass) => {
    if (cls) {
      setEditingClass(cls);
      setClassTitle(cls.title);
      setClassSubjectId(cls.subjectId);
      setClassSource(cls.source);
      setClassDuration(String(cls.durationMinutes));
      setClassDate(cls.date);
      setClassWhatILearned(cls.whatILearned);
      setClassKeyConcepts(cls.keyConcepts.join(', '));
      setClassDoubts(cls.questionsOrDoubts || '');
      setClassStatus(cls.status);
    } else {
      setEditingClass(null);
      setClassTitle('');
      setClassSubjectId('sub_mat');
      setClassSource('YouTube');
      setClassDuration('45');
      setClassDate(new Date().toISOString().split('T')[0]);
      setClassWhatILearned('');
      setClassKeyConcepts('');
      setClassDoubts('');
      setClassStatus('concluida');
    }
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classTitle.trim() || !classWhatILearned.trim()) return;

    const subjectObj = subjects.find((s) => s.id === classSubjectId);
    const conceptsArray = classKeyConcepts
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const classItem: LearnedClass = {
      id: editingClass ? editingClass.id : `class_${Date.now()}`,
      title: classTitle.trim(),
      subjectId: classSubjectId,
      subjectName: subjectObj?.name || 'Matemática',
      source: classSource,
      date: classDate,
      durationMinutes: parseInt(classDuration) || 45,
      whatILearned: classWhatILearned.trim(),
      keyConcepts: conceptsArray,
      questionsOrDoubts: classDoubts.trim() || undefined,
      status: classStatus,
      createdAt: editingClass ? editingClass.createdAt : new Date().toISOString(),
    };

    StorageService.saveLearnedClass(classItem);

    // Also record as study session
    StorageService.addStudySession({
      subjectId: classItem.subjectId,
      subjectName: classItem.subjectName,
      topic: classItem.title,
      sessionType: 'aula',
      durationSeconds: classItem.durationMinutes * 60,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
    });

    setIsClassModalOpen(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#38bdf8', '#10b981'],
    });
  };

  const handleDeleteClass = (id: string) => {
    StorageService.deleteLearnedClass(id);
  };

  // Filtered learned classes
  const filteredClasses = learnedClasses.filter((c) => {
    if (classFilterSubject !== 'todas' && c.subjectId !== classFilterSubject) return false;
    if (classFilterSource !== 'todas' && c.source !== classFilterSource) return false;
    if (classFilterStatus !== 'todas' && c.status !== classFilterStatus) return false;
    if (classSearch.trim()) {
      const q = classSearch.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchLearned = c.whatILearned.toLowerCase().includes(q);
      const matchConcepts = c.keyConcepts.some((k) => k.toLowerCase().includes(q));
      if (!matchTitle && !matchLearned && !matchConcepts) return false;
    }
    return true;
  });

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    if (filterSubject !== 'todas' && q.subjectId !== filterSubject) return false;
    if (filterDifficulty !== 'todas' && q.difficulty !== filterDifficulty) return false;
    if (filterBanca !== 'todas' && q.source !== filterBanca) return false;
    return true;
  });

  const activeQuestion = filteredQuestions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (answerSubmitted) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || answerSubmitted || !activeQuestion) return;
    const correct = selectedOption === activeQuestion.correctOptionIndex;
    setIsAnswerCorrect(correct);
    setAnswerSubmitted(true);

    StorageService.registerQuestionAnswer(activeQuestion.id, selectedOption, 45);

    if (correct) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerSubmitted(false);
    } else {
      setCurrentTab('questoes');
    }
  };

  // Stats calculation
  const totalSecondsAllSubjects = subjects.reduce((acc, s) => acc + s.totalSecondsStudied, 0);
  const totalHours = Math.round(totalSecondsAllSubjects / 3600);
  const totalQuestions = subjects.reduce((acc, s) => acc + s.totalQuestionsAnswered, 0);
  const totalCorrect = subjects.reduce((acc, s) => acc + s.totalQuestionsCorrect, 0);
  const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const latestClass = learnedClasses[0];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* 1. Header Bar with Tabs */}
      <div className="p-6 md:p-8 rounded-3xl ios-glass-card border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-600/20 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono tracking-wider uppercase font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>LIFE OS ACADEMY • AMBIENTE DE APRENDIZAGEM</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Estudos & Caderno de Aulas
            </h1>
            <p className="text-xs text-slate-400">
              Planeje, registre suas aulas assistidas (YouTube, cursos e escola), anote o que aprendeu, resolva questões e meça sua evolução.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenClassModal()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Aula</span>
            </button>

            <button
              onClick={() => setCurrentTab('cronometro')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all"
            >
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="font-mono">{formatTimer(timerSeconds)}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 custom-scrollbar border-t border-white/10 pt-4">
          {[
            { id: 'inicio', label: 'Início', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'aulas', label: 'Minhas Aulas & Aprendizado', icon: <BookMarked className="w-3.5 h-3.5" />, badge: `${learnedClasses.length}` },
            { id: 'estatisticas', label: 'Estatísticas', icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: 'questoes', label: 'Banco de Questões', icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { id: 'caderno_erros', label: 'Caderno de Erros', icon: <AlertCircle className="w-3.5 h-3.5" />, badge: `${errorNotebook.length}` },
            { id: 'flashcards', label: 'Flashcards', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
            { id: 'simulados', label: 'Simulados', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'cronometro', label: 'Cronômetro', icon: <Clock className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as AcademyTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB: INÍCIO */}
      {currentTab === 'inicio' && (
        <div className="space-y-6">
          {/* Hero Row: Última Aula Registrada & Próxima Revisão */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Última Aula & O que aprendeu */}
            <div className="lg:col-span-2 p-6 rounded-3xl ios-glass-card border border-white/10 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono uppercase text-indigo-400 tracking-wider">
                      ÚLTIMA AULA ASSISTIDA
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                      {latestClass?.source || 'YouTube'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {latestClass ? `${latestClass.durationMinutes} min` : '0 min'}
                  </span>
                </div>

                {latestClass ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                        {latestClass.subjectName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">• {latestClass.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {latestClass.title}
                    </h3>
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide block">
                        O que você aprendeu:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {latestClass.whatILearned}
                      </p>
                    </div>

                    {latestClass.keyConcepts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {latestClass.keyConcepts.slice(0, 4).map((concept, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Nenhuma aula registrada ainda.</p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentTab('aulas')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  <span>Ver todas as aulas ({learnedClasses.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenClassModal()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Aula</span>
                </button>
              </div>
            </div>

            {/* Seu Dia nos Estudos */}
            <div className="p-6 rounded-3xl ios-glass-card border border-white/10 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold font-mono uppercase text-sky-400 tracking-wider block mb-3">
                  SEU DIA DE ESTUDOS
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-xs text-slate-400">Tempo Estudado Hoje</span>
                    <span className="text-sm font-bold text-white font-mono">1h 45m</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-xs text-slate-400">Meta Diária (4h)</span>
                    <span className="text-sm font-bold text-sky-400 font-mono">44%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-xs text-slate-400">Questões Hoje</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">18 / 20</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('cronometro')}
                className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Iniciar Sessão com Cronômetro</span>
              </button>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setCurrentTab('aulas')}
              className="p-4 rounded-3xl ios-glass-card border border-white/10 cursor-pointer space-y-2 hover:border-indigo-500/40 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BookMarked className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-white block">{learnedClasses.length} Aulas</span>
              <span className="text-[11px] text-slate-400">Caderno de Aprendizado</span>
            </div>

            <div
              onClick={() => setCurrentTab('questoes')}
              className="p-4 rounded-3xl ios-glass-card border border-white/10 cursor-pointer space-y-2 hover:border-sky-500/40 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-white block">{questions.length} Questões</span>
              <span className="text-[11px] text-slate-400">Banco com Filtros</span>
            </div>

            <div
              onClick={() => setCurrentTab('caderno_erros')}
              className="p-4 rounded-3xl ios-glass-card border border-white/10 cursor-pointer space-y-2 hover:border-rose-500/40 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-white block">{errorNotebook.length} no Erro</span>
              <span className="text-[11px] text-slate-400">Revisão de Falhas</span>
            </div>

            <div
              onClick={() => setCurrentTab('flashcards')}
              className="p-4 rounded-3xl ios-glass-card border border-white/10 cursor-pointer space-y-2 hover:border-amber-500/40 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-white block">{flashcards.length} Cards</span>
              <span className="text-[11px] text-slate-400">Repetição Espaçada</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: MINHAS AULAS & APRENDIZADO (CADERNO DO QUE VOCÊ APRENDEU) */}
      {currentTab === 'aulas' && (
        <div className="space-y-6">
          {/* Header & Filters */}
          <div className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Caderno de Aulas & Aprendizado</h3>
                <p className="text-xs text-slate-400">
                  Sem videoaulas dentro do app: assista no YouTube, cursinhos ou escola e anote aqui o que você aprendeu.
                </p>
              </div>
              <button
                onClick={() => handleOpenClassModal()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nova Aula</span>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar aula ou conceito..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <select
                  value={classFilterSubject}
                  onChange={(e) => setClassFilterSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="todas">Todas as Matérias</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={classFilterSource}
                  onChange={(e) => setClassFilterSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="todas">Todas as Fontes</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Curso Online">Curso Online</option>
                  <option value="Escola / Presencial">Escola / Presencial</option>
                  <option value="Faculdade">Faculdade</option>
                  <option value="Apostila / Livro">Apostila / Livro</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <select
                  value={classFilterStatus}
                  onChange={(e) => setClassFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="todas">Todos os Status</option>
                  <option value="concluida">Concluída</option>
                  <option value="revisar">Precisa de Revisão</option>
                  <option value="duvida">Com Dúvidas</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Learned Classes */}
          {filteredClasses.length === 0 ? (
            <div className="p-12 text-center rounded-3xl ios-glass-card border border-white/10 space-y-3">
              <BookMarked className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Nenhuma aula encontrada com esses filtros.</p>
              <button
                onClick={() => handleOpenClassModal()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Cadastrar Primeira Aula
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-5 rounded-3xl ios-glass-card border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                          {cls.subjectName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                          {cls.source}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {cls.date} • {cls.durationMinutes} min
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white tracking-tight">{cls.title}</h4>

                    {/* O que aprendeu */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        O que aprendi:
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                        {cls.whatILearned}
                      </p>
                    </div>

                    {/* Conceitos-chave / Fórmulas */}
                    {cls.keyConcepts && cls.keyConcepts.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Conceitos & Fórmulas:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cls.keyConcepts.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 font-mono"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dúvidas */}
                    {cls.questionsOrDoubts && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] text-amber-200">{cls.questionsOrDoubts}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                        cls.status === 'concluida'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : cls.status === 'revisar'
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {cls.status === 'concluida'
                        ? 'Concluída'
                        : cls.status === 'revisar'
                        ? 'Revisar amanhã'
                        : 'Com dúvidas'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenClassModal(cls)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Editar aula"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                        title="Excluir aula"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: ESTATÍSTICAS (DIA / SEMANA / MÊS / ANO / TUDO) */}
      {currentTab === 'estatisticas' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Estatísticas de Aprendizagem</h3>
                <p className="text-xs text-slate-400">
                  Distribuição de horas estudadas e aproveitamento em questões.
                </p>
              </div>

              {/* Period Selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
                {(['dia', 'semana', 'mes', 'ano', 'tudo'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setStatsPeriod(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statsPeriod === p
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-xs text-slate-400">Total Estudado</span>
                <span className="text-2xl font-extrabold text-white block font-mono">
                  {totalHours}h
                </span>
                <span className="text-[11px] text-emerald-400">Constância diária</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-xs text-slate-400">Questões Respondidas</span>
                <span className="text-2xl font-extrabold text-sky-400 block font-mono">
                  {totalQuestions}
                </span>
                <span className="text-[11px] text-slate-400">{totalCorrect} acertos</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-xs text-slate-400">Taxa de Acerto Geral</span>
                <span className="text-2xl font-extrabold text-emerald-400 block font-mono">
                  {globalAccuracy}%
                </span>
                <span className="text-[11px] text-slate-400">Excelente aproveitamento</span>
              </div>
            </div>
          </div>

          {/* Subjects Breakdown */}
          <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Horas & Questões por Matéria</h3>

            <div className="space-y-4">
              {subjects.map((sub) => {
                const hours = Math.round(sub.totalSecondsStudied / 3600);
                const perc = totalSecondsAllSubjects > 0
                  ? Math.round((sub.totalSecondsStudied / totalSecondsAllSubjects) * 100)
                  : 0;
                const accuracy = sub.totalQuestionsAnswered > 0
                  ? Math.round((sub.totalQuestionsCorrect / sub.totalQuestionsAnswered) * 100)
                  : 0;

                return (
                  <div key={sub.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                        <span className="font-bold text-white">{sub.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-300 font-mono">
                        <span>{hours}h ({perc}%)</span>
                        <span className="text-emerald-400">{accuracy}% acerto</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${perc}%`, backgroundColor: sub.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: BANCO DE QUESTÕES & RESOLVER */}
      {currentTab === 'questoes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Banco de Questões</h3>
                <p className="text-xs text-slate-400">
                  Filtre por banca, matéria, ano e nível de dificuldade para treinar como na prova real.
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setAnswerSubmitted(false);
                  setCurrentTab('resolver');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Iniciar Resolução ({filteredQuestions.length} questões)</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Matéria:</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="todas">Todas as Matérias</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Dificuldade:</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="todas">Todas</option>
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Banca / Origem:</label>
                <select
                  value={filterBanca}
                  onChange={(e) => setFilterBanca(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="todas">Todas as Bancas</option>
                  <option value="Exército Brasileiro">Exército / EsPCEx</option>
                  <option value="Colégio Naval">Colégio Naval</option>
                  <option value="ESA">ESA</option>
                  <option value="Tech Exam">Tech Exam</option>
                  <option value="ENEM">ENEM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions List preview */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setSelectedOption(null);
                  setAnswerSubmitted(false);
                  setCurrentTab('resolver');
                }}
                className="p-4 rounded-2xl ios-glass-card border border-white/10 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                      {q.source || 'Simulado'} {q.year ? `• ${q.year}` : ''}
                    </span>
                    <span className="text-xs font-semibold text-indigo-400">{q.subjectName}</span>
                    <span className="text-[11px] text-slate-400">• {q.topic}</span>
                  </div>
                  <p className="text-xs text-white line-clamp-1">{q.prompt}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB: RESOLVER QUESTÃO INTERATIVO */}
      {currentTab === 'resolver' && activeQuestion && (
        <div className="p-6 md:p-8 rounded-3xl ios-glass-card border border-white/10 space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                {activeQuestion.subjectName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeQuestion.source} • {activeQuestion.topic}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Questão {currentQuestionIndex + 1} de {filteredQuestions.length}
            </span>
          </div>

          <div className="text-sm md:text-base font-medium text-white leading-relaxed">
            {activeQuestion.prompt}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {activeQuestion.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === activeQuestion.correctOptionIndex;

              let style = 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10';
              if (answerSubmitted) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrectOpt) {
                  style = 'bg-rose-500/20 border-rose-500/50 text-rose-200';
                }
              } else if (isSelected) {
                style = 'bg-indigo-600/30 border-indigo-400 text-white font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm flex items-center gap-3 transition-all ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs font-mono">
                    {letter}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {answerSubmitted && (
            <div
              className={`p-4 rounded-2xl border space-y-2 animate-in fade-in duration-200 ${
                isAnswerCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
                {isAnswerCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Resposta Correta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Resposta Incorreta — Adicionada ao Caderno de Erros</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Gabarito Fundamentado:</strong> {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentTab('questoes')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Voltar à lista
            </button>

            {!answerSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Próxima Questão</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 7. TAB: CADERNO DE ERROS */}
      {currentTab === 'caderno_erros' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-2">
            <h3 className="text-base font-bold text-white">Caderno de Erros</h3>
            <p className="text-xs text-slate-400">
              Questões que você errou nos simulados e baterias de estudo. Revise os conceitos até fixar o conteúdo.
            </p>
          </div>

          {errorNotebook.length === 0 ? (
            <div className="p-8 text-center rounded-3xl ios-glass-card border border-white/10">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Caderno de Erros Zerado!</p>
              <p className="text-xs text-slate-400">Você não tem erros pendentes para revisar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {errorNotebook.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">
                      {item.question.subjectName} • {item.mistakeCount} erros
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Última tentativa: {item.lastAttemptAt.split('T')[0]}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white">{item.question.prompt}</p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                    <span className="font-semibold text-indigo-300 block mb-1">Explicação:</span>
                    {item.question.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. TAB: FLASHCARDS COM REPETIÇÃO ESPAÇADA */}
      {currentTab === 'flashcards' && flashcards.length > 0 && (
        <div className="p-6 md:p-8 rounded-3xl ios-glass-card border border-white/10 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                {flashcards[activeCardIndex].subjectName}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Card {activeCardIndex + 1} de {flashcards.length}
            </span>
          </div>

          {/* Flashcard 3D Card */}
          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/30 via-slate-900/60 to-slate-950/80 border border-white/15 min-h-[220px] flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 transition-all select-none shadow-2xl"
          >
            <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider">
              {isCardFlipped ? 'VERSO (RESPOSTA / EXPLICAÇÃO)' : 'FRENTE (CONCEITO / PERGUNTA)'}
            </span>

            <div className="my-auto text-center py-4">
              <p className="text-base md:text-lg font-bold text-white">
                {isCardFlipped
                  ? flashcards[activeCardIndex].back
                  : flashcards[activeCardIndex].front}
              </p>
            </div>

            <span className="text-[10px] text-center text-slate-400 block">
              Toque no cartão para virar ↺
            </span>
          </div>

          {/* Rating Buttons */}
          {isCardFlipped && (
            <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-200">
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setActiveCardIndex((prev) => (prev + 1) % flashcards.length);
                }}
                className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold"
              >
                Difícil
              </button>
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setActiveCardIndex((prev) => (prev + 1) % flashcards.length);
                }}
                className="py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold"
              >
                Médio
              </button>
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setActiveCardIndex((prev) => (prev + 1) % flashcards.length);
                  confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                }}
                className="py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
              >
                Fácil
              </button>
            </div>
          )}
        </div>
      )}

      {/* 9. TAB: SIMULADOS */}
      {currentTab === 'simulados' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-2">
            <h3 className="text-base font-bold text-white">Simulados Oficiais</h3>
            <p className="text-xs text-slate-400">
              Provas cronometradas no modelo exato das bancas militares e vestibulares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulados.map((sim) => (
              <div
                key={sim.id}
                className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 uppercase font-mono">
                    {sim.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {sim.durationMinutes} min • {sim.questions?.length || sim.totalQuestions} questões
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{sim.title}</h4>
                <p className="text-xs text-slate-300">Simulado cronometrado no modelo de prova.</p>
                <button
                  onClick={() => {
                    setCurrentTab('resolver');
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Iniciar Simulado Modo Prova</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. TAB: CRONÔMETRO DE ESTUDO */}
      {currentTab === 'cronometro' && (
        <div className="p-8 md:p-12 rounded-3xl ios-glass-card border border-white/10 max-w-lg mx-auto text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">
              CRONÔMETRO & FOCO LIFE OS
            </span>
            <h3 className="text-2xl font-extrabold text-white">Sessão de Foco</h3>
          </div>

          {/* Big Digital Display */}
          <div className="text-5xl md:text-6xl font-black font-mono text-white tracking-widest py-4 bg-white/5 rounded-3xl border border-white/10">
            {formatTimer(timerSeconds)}
          </div>

          {/* Subject & Session Type Selection */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Matéria:</label>
              <select
                value={timerSubject}
                onChange={(e) => setTimerSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipo:</label>
              <select
                value={timerSessionType}
                onChange={(e) => setTimerSessionType(e.target.value as StudySessionType)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs"
              >
                <option value="aula">Aula Assistida</option>
                <option value="exercicios">Exercícios</option>
                <option value="revisao">Revisão</option>
                <option value="flashcards">Flashcards</option>
                <option value="leitura">Leitura Teórica</option>
              </select>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-8 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'ios-button-primary text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isTimerRunning ? 'Pausar' : 'Iniciar Foco'}</span>
            </button>

            {timerSeconds > 0 && (
              <button
                onClick={handleSaveTimerSession}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Sessão</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 11. MODAL: REGISTRAR / EDITAR AULA ASSISTIDA (O QUE APRENDEU) */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="ios-glass-sheet rounded-3xl w-full max-w-lg border border-white/20 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingClass ? 'Editar Registro de Aula' : 'Registrar Aula Assistida'}
                </h3>
              </div>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título da Aula / Assunto Estudado *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Funções do 2º Grau & Vértice da Parábola"
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Matéria *</label>
                  <select
                    value={classSubjectId}
                    onChange={(e) => setClassSubjectId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Onde assistiu / Fonte *</label>
                  <select
                    value={classSource}
                    onChange={(e) => setClassSource(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Curso Online">Curso Online (ex: Fênix)</option>
                    <option value="Escola / Presencial">Escola / Presencial</option>
                    <option value="Faculdade">Faculdade</option>
                    <option value="Apostila / Livro">Apostila / Livro</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data da aula:</label>
                  <input
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tempo estudado (minutos):</label>
                  <input
                    type="number"
                    value={classDuration}
                    onChange={(e) => setClassDuration(e.target.value)}
                    min={1}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* O que você aprendeu */}
              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">
                  O que você aprendeu nesta aula? (Resumo essencial) *
                </label>
                <textarea
                  rows={4}
                  placeholder="Escreva em suas próprias palavras as explicações, raciocínios e conclusões que você absorveu..."
                  value={classWhatILearned}
                  onChange={(e) => setClassWhatILearned(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500/50 leading-relaxed"
                />
              </div>

              {/* Conceitos-chave e Fórmulas */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Conceitos-chave ou Fórmulas (separados por vírgula):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Xv = -b/(2a), Yv = -Δ/(4a), Vértice mínimo"
                  value={classKeyConcepts}
                  onChange={(e) => setClassKeyConcepts(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              {/* Dúvidas e Pontos de Atenção */}
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Dúvidas ou Pontos para Revisar depois (opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fazer 10 exercícios da banca sobre lançamentos oblíquos"
                  value={classDoubts}
                  onChange={(e) => setClassDoubts(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status de assimilação:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'concluida', label: 'Concluída' },
                    { id: 'revisar', label: 'Revisar' },
                    { id: 'duvida', label: 'Com Dúvidas' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setClassStatus(s.id as any)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        classStatus === s.id
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {editingClass ? 'Salvar Alterações' : 'Salvar no Caderno de Aulas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
