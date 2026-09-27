/**
 * LIFE OS — Onboarding Inteligente & Quiz Guiado
 * Coleta preferências do usuário, rotinas biológicas e objetivos de vida.
 * Popula o perfil, personaliza os módulos habilitados do sistema e
 * persiste tudo no Firestore para garantir que o quiz só ocorra no primeiro login.
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  Clock,
  Target,
  Dumbbell,
  Coffee,
  Wallet,
  FolderKanban,
  Flame,
  CheckCircle2,
  Cloud,
  Layers,
  Briefcase,
  BookMarked,
  Image as ImageIcon,
  CheckSquare,
  Utensils,
  Lightbulb,
  LogIn,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import { UserProfile, ModuleId } from '../types';
import { AppConfig } from '../config/appConfig';
import {
  auth,
  loginWithGoogle,
  saveUserProfileToFirestore,
  saveUserSettingsToFirestore,
} from '../services/firebase';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
  config: AppConfig;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinish,
  config,
}) => {
  const currentProfile = StorageService.getProfile();
  const [step, setStep] = useState(1);
  const totalSteps = 8;
  const [isSaving, setIsSaving] = useState(false);
  const [authEmail, setAuthEmail] = useState<string | null>(auth.currentUser?.email || null);

  // Bloco 1: Você & Ritmo Biológico
  const [nickname, setNickname] = useState(
    currentProfile.nickname || auth.currentUser?.displayName?.split(' ')[0] || 'Enzo'
  );
  const [age, setAge] = useState(currentProfile.age ? String(currentProfile.age) : '18');
  const [wakeTime, setWakeTime] = useState(currentProfile.wakeTime || '06:30');
  const [sleepTime, setSleepTime] = useState(currentProfile.sleepTime || '23:00');
  const [isStudent, setIsStudent] = useState(currentProfile.isStudent ?? true);
  const [isWorker, setIsWorker] = useState(currentProfile.isWorker ?? true);

  // Bloco 2: Módulos Habilitados / Personalização do Sistema
  const [enabledModulesMap, setEnabledModulesMap] = useState<Record<string, boolean>>({
    dashboard: true,
    assistente: true,
    tarefas: true,
    habitos: true,
    rotina: true,
    estudos: config.enabledModules?.estudos ?? true,
    treinos: config.enabledModules?.treinos ?? true,
    saude: config.enabledModules?.saude ?? true,
    financas: config.enabledModules?.financas ?? true,
    projetos: config.enabledModules?.projetos ?? true,
    trabalho: config.enabledModules?.trabalho ?? true,
    vendas: config.enabledModules?.vendas ?? true,
    alimentacao: config.enabledModules?.alimentacao ?? true,
    diario: config.enabledModules?.diario ?? true,
    galeria: config.enabledModules?.galeria ?? true,
    timeline: config.enabledModules?.timeline ?? true,
    inbox: config.enabledModules?.inbox ?? true,
    memoria: config.enabledModules?.memoria ?? true,
    metas: config.enabledModules?.metas ?? true,
    calendario: config.enabledModules?.calendario ?? true,
    ia: config.enabledModules?.ia ?? true,
    configuracoes: true,
  });

  // Bloco 3: Organização & Notificações
  const [forgetReason, setForgetReason] = useState(
    currentProfile.forgetReason || 'tenho muitas coisas para fazer'
  );
  const [notificationTiming, setNotificationTiming] = useState('15');

  // Bloco 4: Estudos
  const [primarySubjects, setPrimarySubjects] = useState<string[]>([
    'Matemática',
    'História',
    'Programação & IA',
    'Física',
  ]);

  // Bloco 5: Atividade Física
  const [sports, setSports] = useState<string[]>(['Jiu-Jitsu', 'Musculação']);
  const [workoutDaysCount, setWorkoutDaysCount] = useState('4');
  const [waterGoalLiters, setWaterGoalLiters] = useState('3.0');

  // Bloco 6: Vida Financeira
  const [incomeSources, setIncomeSources] = useState('Projetos e Consultoria');
  const [financialGoal, setFinancialGoal] = useState('20000');

  // Bloco 7: Projetos
  const [activeProjectsText, setActiveProjectsText] = useState('KVB System, KAEN Motors');

  // Bloco 8: Hábitos
  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    'Beber 3L de Água',
    'Estudo Focado',
    'Praticar Jiu-Jitsu',
    'Programar',
  ]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthEmail(user.email);
        if (!nickname || nickname === 'Enzo') {
          setNickname(user.displayName?.split(' ')[0] || 'Usuário');
        }
      } else {
        setAuthEmail(null);
      }
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const toggleArrayItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) setList(list.filter((x) => x !== item));
    else setList([...list, item]);
  };

  const toggleModule = (modKey: string) => {
    setEnabledModulesMap((prev) => ({
      ...prev,
      [modKey]: !prev[modKey],
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        setAuthEmail(user.email);
        setNickname(user.displayName?.split(' ')[0] || nickname);
        confetti({ particleCount: 50, spread: 50 });
      }
    } catch (e) {
      console.error('Failed to sign in:', e);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    const userId = auth.currentUser?.uid || currentProfile.userId || currentProfile.id || 'usr_001';

    // 1. Array of enabled module IDs
    const chosenModuleIds = Object.keys(enabledModulesMap).filter(
      (k) => enabledModulesMap[k]
    ) as ModuleId[];

    // 2. Updated user profile
    const updatedProfile: UserProfile = {
      ...currentProfile,
      id: userId,
      userId,
      nickname,
      name: nickname,
      email: auth.currentUser?.email || currentProfile.email || '',
      avatarUrl: auth.currentUser?.photoURL || currentProfile.avatarUrl,
      age: parseInt(age) || 18,
      wakeTime,
      sleepTime,
      isStudent,
      isWorker,
      forgetReason,
      primarySubjects,
      sports,
      workoutDaysCount,
      waterGoalLiters,
      incomeSources,
      financialGoal,
      activeProjectsText,
      selectedHabits,
      enabledModules: chosenModuleIds,
      onboardingCompleted: true, // Marked true so it never triggers automatically again!
      updatedAt: new Date().toISOString(),
    };

    // 3. Updated AppConfig with user's selected modules
    const updatedConfig: AppConfig = {
      ...config,
      enabledModules: {
        ...config.enabledModules,
        ...(enabledModulesMap as any),
        dashboard: true,
        configuracoes: true,
      },
    };

    // 4. Save locally first for instant reactivity & offline resilience
    StorageService.saveProfile(updatedProfile);
    StorageService.saveConfig(updatedConfig);

    // 5. Persist to Firestore if user is authenticated
    try {
      await saveUserProfileToFirestore(updatedProfile);
      await saveUserSettingsToFirestore(userId, {
        enabledModules: chosenModuleIds,
        notificationTiming,
      });
      console.log('✅ Dados do Onboarding persistidos no Firestore com sucesso!');
    } catch (error) {
      console.warn('Persistência no Firestore aguardando login ou offline:', error);
    }

    setIsSaving(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b'],
    });

    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070f]/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="ios-glass-sheet rounded-3xl w-full max-w-xl border border-white/20 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300 flex flex-col justify-between max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Progress & Cloud Status Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Quiz de Personalização</span>
              <span>• Bloco {step} de {totalSteps}</span>
            </div>
            <div className="flex items-center gap-2">
              {authEmail ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Cloud className="w-3 h-3" />
                  <span>Firestore Conectado</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 cursor-pointer transition-all"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Entrar com Google</span>
                </button>
              )}
              <span className="font-bold">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* BLOCO 1: VOCÊ & RITMO BIOLÓGICO */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Bloco 1 — Você & Ritmo Biológico
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Vamos configurar seu Life OS.
            </h2>

            {/* Banner de Explicação sobre o Quiz e Firestore */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-sky-500/15 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>CONFIGURAÇÃO GUIADA INICIAL</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Este quiz é realizado <strong>apenas na primeira vez que você entra</strong> no Life OS para estruturar suas preferências, rotinas e objetivos no banco de dados Firestore.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suas respostas serão salvas na nuvem para <strong>personalizar o Dashboard e ativar exatamente os módulos que você precisa</strong>.
              </p>
              {!authEmail && (
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-[11px] text-slate-300">Quer vincular com sua conta Google?</span>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Conectar Google</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Como quer ser chamado?</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sua idade:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora que acorda:</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora que dorme:</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsStudent(!isStudent)}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isStudent
                      ? 'bg-indigo-600/30 border-indigo-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span>Sou Estudante / Concursos</span>
                  </div>
                  {isStudent && <Check className="w-4 h-4 text-indigo-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsWorker(!isWorker)}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isWorker
                      ? 'bg-sky-600/30 border-sky-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sky-400" />
                    <span>Trabalho / Empreendo</span>
                  </div>
                  {isWorker && <Check className="w-4 h-4 text-sky-400" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 2: MÓDULOS HABILITADOS (PERSONALIZAÇÃO DO SISTEMA) */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Bloco 2 — Personalização do Sistema & Módulos
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais áreas da vida você quer ativar?
            </h2>
            <p className="text-xs text-slate-300">
              Personalize sua barra de navegação e os cards do Dashboard. Você poderá ativar ou desativar qualquer módulo depois.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
              {[
                { id: 'estudos', label: 'Estudos & Academy', desc: 'Caderno de aulas, questões e revisões', icon: <GraduationCap className="w-4 h-4 text-indigo-400" /> },
                { id: 'trabalho', label: 'Trabalho & Clientes', desc: 'Controle de negócios e propostas', icon: <Briefcase className="w-4 h-4 text-sky-400" /> },
                { id: 'projetos', label: 'Projetos Pessoais', desc: 'Metas, entregáveis e Kanban', icon: <FolderKanban className="w-4 h-4 text-purple-400" /> },
                { id: 'financas', label: 'Vida Financeira', desc: 'Controle de gastos, entradas e metas', icon: <Wallet className="w-4 h-4 text-emerald-400" /> },
                { id: 'treinos', label: 'Treinos & Esportes', desc: 'Diário de treinos e constância física', icon: <Dumbbell className="w-4 h-4 text-rose-400" /> },
                { id: 'alimentacao', label: 'Alimentação & Água', desc: 'Registro de refeições e hidratação', icon: <Utensils className="w-4 h-4 text-amber-400" /> },
                { id: 'diario', label: 'Diário Pessoal', desc: 'Reflexões e sentimentos do dia', icon: <BookMarked className="w-4 h-4 text-teal-400" /> },
                { id: 'galeria', label: 'Galeria da Vida', desc: 'Fotos e memória visual de conquistas', icon: <ImageIcon className="w-4 h-4 text-fuchsia-400" /> },
                { id: 'inbox', label: 'Caixa de Ideias', desc: 'Captura rápida de pensamentos', icon: <Lightbulb className="w-4 h-4 text-yellow-400" /> },
                { id: 'metas', label: 'Metas de Vida', desc: 'Objetivos anuais e de longo prazo', icon: <Target className="w-4 h-4 text-red-400" /> },
              ].map((mod) => {
                const active = !!enabledModulesMap[mod.id];
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      active
                        ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        {mod.icon}
                        <span>{mod.label}</span>
                      </div>
                      {active && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400">{mod.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BLOCO 3: ORGANIZAÇÃO & NOTIFICAÇÕES */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Bloco 3 — Organização & Notificações
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Como você prefere ser avisado?
            </h2>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  O que mais costuma fazer você esquecer tarefas?
                </label>
                <select
                  value={forgetReason}
                  onChange={(e) => setForgetReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="tenho muitas coisas para fazer">Tenho muitas coisas para fazer e me perco</option>
                  <option value="esqueço rapidamente">Esqueço rapidamente com a correria</option>
                  <option value="não sei por onde começar">Não sei por onde começar</option>
                  <option value="falta de rotina">Falta de uma rotina visual e horários definidos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Antecedência ideal para alertas:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['5', '15', '30', '60'].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setNotificationTiming(mins)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        notificationTiming === mins
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 border border-white/10 text-slate-400'
                      }`}
                    >
                      {mins} min antes
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 4: ESTUDOS */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Bloco 4 — Estudos & Caderno de Aulas
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais matérias você quer acompanhar?
            </h2>

            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>CADERNO DE APRENDIZADO (SEM VÍDEOS EMBUTIDOS)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você assiste suas aulas no YouTube, cursinhos online ou na escola, e registra no Life OS o que aprendeu, fórmulas e dúvidas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                'Matemática',
                'História',
                'Geografia',
                'Português',
                'Programação & IA',
                'Física',
                'Química',
                'Biologia',
                'Inglês',
                'Filosofia & Sociologia',
              ].map((sub) => {
                const active = primarySubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleArrayItem(primarySubjects, setPrimarySubjects, sub)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      active
                        ? 'bg-indigo-600/30 border-indigo-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{sub}</span>
                    {active && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BLOCO 5: ATIVIDADE FÍSICA & SAÚDE */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Bloco 5 — Atividade Física & Hidratação
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais esportes você pratica?
            </h2>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {['Jiu-Jitsu', 'Musculação', 'Corrida', 'Ciclismo', 'Natação', 'Futebol'].map((sp) => {
                const active = sports.includes(sp);
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => toggleArrayItem(sports, setSports, sp)}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      active
                        ? 'bg-rose-600/30 border-rose-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{sp}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dias de treino / semana:</label>
                <select
                  value={workoutDaysCount}
                  onChange={(e) => setWorkoutDaysCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white"
                >
                  <option value="2">2 dias por semana</option>
                  <option value="3">3 dias por semana</option>
                  <option value="4">4 dias por semana</option>
                  <option value="5">5 dias por semana</option>
                  <option value="6">6 dias por semana</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meta de água diária (L):</label>
                <select
                  value={waterGoalLiters}
                  onChange={(e) => setWaterGoalLiters(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white"
                >
                  <option value="2.0">2.0 Litros</option>
                  <option value="2.5">2.5 Litros</option>
                  <option value="3.0">3.0 Litros (Recomendado)</option>
                  <option value="3.5">3.5 Litros</option>
                  <option value="4.0">4.0 Litros</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 6: VIDA FINANCEIRA */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Bloco 6 — Vida Financeira
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Metas de faturamento e renda.
            </h2>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Suas principais fontes de renda ou atividades:
                </label>
                <input
                  type="text"
                  value={incomeSources}
                  onChange={(e) => setIncomeSources(e.target.value)}
                  placeholder="Ex: Projetos, Freelancer, Estágio, Empresa..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Meta financeira mensal ou reserva (R$):
                </label>
                <input
                  type="text"
                  value={financialGoal}
                  onChange={(e) => setFinancialGoal(e.target.value)}
                  placeholder="Ex: 10000, 20000..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 7: PROJETOS */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Bloco 7 — Projetos Ativos
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais projetos você está construindo?
            </h2>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomes dos seus projetos (separados por vírgula):
                </label>
                <input
                  type="text"
                  value={activeProjectsText}
                  onChange={(e) => setActiveProjectsText(e.target.value)}
                  placeholder="Ex: KVB System, KAEN Motors, Aplicativo X..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 8: HÁBITOS & SALVAR NO FIRESTORE */}
        {step === 8 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Bloco 8 — Hábitos & Finalização
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais hábitos você quer cultivar?
            </h2>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                'Beber 3L de Água',
                'Estudo Focado',
                'Praticar Jiu-Jitsu',
                'Programar',
                'Acordar no Horário',
                'Sem Telas Antes de Dormir',
                'Leitura 20 min',
                'Organizar Espaço',
              ].map((hab) => {
                const active = selectedHabits.includes(hab);
                return (
                  <button
                    key={hab}
                    type="button"
                    onClick={() => toggleArrayItem(selectedHabits, setSelectedHabits, hab)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      active
                        ? 'bg-orange-600/30 border-orange-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{hab}</span>
                    {active && <Check className="w-4 h-4 text-orange-400" />}
                  </button>
                );
              })}
            </div>

            {/* Status de Nuvem Firestore */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  {authEmail ? `Conectado como: ${authEmail}` : 'Salvamento no Firestore habilitado'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">100% SEGURO</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold shadow-lg cursor-pointer"
            >
              <span>Avançar Bloco</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Salvando no Firestore...' : 'Concluir e Abrir Meu Life OS'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
