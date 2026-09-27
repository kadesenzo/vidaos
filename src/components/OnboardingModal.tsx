/**
 * LIFE OS — Onboarding Inteligente de 8 Blocos
 * Configuração integral da sua vida: Você, Organização, Estudos, Atividade Física,
 * Alimentação, Vida Financeira, Projetos e Hábitos.
 */

import React, { useState } from 'react';
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
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserProfile } from '../types';
import { AppConfig } from '../config/appConfig';

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

  // Bloco 1: Você
  const [nickname, setNickname] = useState(currentProfile.nickname || 'Enzo');
  const [age, setAge] = useState(currentProfile.age ? String(currentProfile.age) : '17');
  const [wakeTime, setWakeTime] = useState(currentProfile.wakeTime || '06:30');
  const [sleepTime, setSleepTime] = useState(currentProfile.sleepTime || '23:00');
  const [isStudent, setIsStudent] = useState(currentProfile.isStudent ?? true);
  const [isWorker, setIsWorker] = useState(currentProfile.isWorker ?? true);

  // Bloco 2: Organização
  const [forgetReason, setForgetReason] = useState(
    currentProfile.forgetReason || 'tenho muitas coisas para fazer'
  );
  const [notificationTiming, setNotificationTiming] = useState('15');

  // Bloco 3: Estudos
  const [primarySubjects, setPrimarySubjects] = useState<string[]>([
    'Matemática',
    'História',
    'Programação & IA',
  ]);

  // Bloco 4: Atividade Física
  const [sports, setSports] = useState<string[]>(['Jiu-Jitsu', 'Musculação']);
  const [workoutDaysCount, setWorkoutDaysCount] = useState('4');

  // Bloco 5: Alimentação
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

  if (!isOpen) return null;

  const toggleArrayItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) setList(list.filter((x) => x !== item));
    else setList([...list, item]);
  };

  const handleFinish = () => {
    const updatedProfile: UserProfile = {
      ...currentProfile,
      nickname,
      name: nickname,
      age: parseInt(age) || 17,
      wakeTime,
      sleepTime,
      isStudent,
      isWorker,
      forgetReason,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveProfile(updatedProfile);
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070f]/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="ios-glass-sheet rounded-3xl w-full max-w-xl border border-white/20 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300 flex flex-col justify-between max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Configuração da Vida • Bloco {step} de {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* BLOCO 1: VOCÊ */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Bloco 1 — Você & Ritmo Diário
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Vamos configurar seu Life OS.
            </h2>

            {/* Banner de Explicação Crucial sobre o Quiz */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-sky-500/15 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>COMO FUNCIONA ESTE QUIZ (IMPORTANTE)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Este questionário serve <strong>apenas como um modelo e guia de exemplo</strong> para você estruturar o ponto de partida do seu Life OS. Não se preocupe em preencher tudo perfeitamente agora!
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                As respostas aqui servem para construir as informações iniciais. Depois, <strong>você mesmo vai colocando, alterando e gerenciando tudo no dia a dia diretamente pelas telas do aplicativo</strong> (suas aulas, tarefas, hábitos, finanças, treinos e projetos)!
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-indigo-300 font-medium">Quer ir direto ao app?</span>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all border border-white/15 cursor-pointer"
                >
                  Usar Modelo e Começar Já →
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Como quer ser chamado?</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold focus:outline-none"
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
            </div>
          </div>
        )}

        {/* BLOCO 2: ORGANIZAÇÃO */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Bloco 2 — Organização & Notificações
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
                  <option value="falta de rotina">Falta de uma rotina visual e horários</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Antecedência ideal para alertas reais no celular:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['5', '10', '15', '30'].map((mins) => (
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

        {/* BLOCO 3: ESTUDOS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Bloco 3 — Estudos & Caderno de Aulas
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais matérias você quer acompanhar?
            </h2>

            {/* Aviso sobre as Aulas sem Vídeo */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>SEM VÍDEOS: CADERNO DO QUE VOCÊ APRENDEU</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As videoaulas que você assiste são no YouTube, cursos ou na escola. No Life OS, você tem um <strong>Caderno de Aprendizado</strong> para registrar suas aulas assistidas, sintetizar <strong>o que você aprendeu</strong>, resolver bancos de questões e treinar revisões com flashcards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {['Matemática', 'História', 'Geografia', 'Português', 'Programação & IA', 'Física'].map((sub) => {
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

        {/* BLOCO 4: ATIVIDADE FÍSICA */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Bloco 4 — Atividade Física & Esporte
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais esportes você pratica?
            </h2>
            <p className="text-xs text-slate-400">
              Acompanhamento saudável de constância, sem metas extremas de peso.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {['Jiu-Jitsu', 'Musculação', 'Ciclismo / Bike', 'Corrida', 'Funcional'].map((sp) => {
                const active = sports.includes(sp);
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => toggleArrayItem(sports, setSports, sp)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      active
                        ? 'bg-rose-600/30 border-rose-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{sp}</span>
                    {active && <Check className="w-4 h-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BLOCO 5: ALIMENTAÇÃO */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Bloco 5 — Alimentação & Hidratação
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Meta saudável de água e energia
            </h2>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Meta diária de água (Litros):
                </label>
                <input
                  type="text"
                  value={waterGoalLiters}
                  onChange={(e) => setWaterGoalLiters(e.target.value)}
                  placeholder="3.0"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                O Life OS não impõe déficit calórico ou dietas restritivas. O objetivo é manter sua energia estável ao longo do dia.
              </p>
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
              Metas e fontes de recursos
            </h2>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Principais fontes de entrada:</label>
                <input
                  type="text"
                  value={incomeSources}
                  onChange={(e) => setIncomeSources(e.target.value)}
                  placeholder="Serviços, projetos, mesada..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meta de reserva (R$):</label>
                <input
                  type="number"
                  value={financialGoal}
                  onChange={(e) => setFinancialGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 7: PROJETOS */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Bloco 7 — Projetos em Construção
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              O que você está construindo atualmente?
            </h2>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Projetos Ativos:</label>
                <textarea
                  rows={2}
                  value={activeProjectsText}
                  onChange={(e) => setActiveProjectsText(e.target.value)}
                  placeholder="Ex: KVB System, KAEN Motors, Cursos..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 8: HÁBITOS */}
        {step === 8 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Bloco 8 — Hábitos & Constância
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Quais hábitos deseja manter no painel?
            </h2>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                'Beber 3L de Água',
                'Estudo Focado',
                'Praticar Jiu-Jitsu',
                'Programar',
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold shadow-lg"
            >
              <span>Avançar Bloco</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Configurar Meu Life OS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
