/**
 * LIFE OS — Mobile Bottom Navigation Dock (iOS 26 Style)
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  CheckSquare,
  MoreHorizontal,
  Flame,
  Clock,
  FolderKanban,
  Wallet,
  TrendingUp,
  Dumbbell,
  Sparkles,
  Target,
  CalendarDays,
  Bot,
  Settings,
  X,
  Briefcase,
  Activity,
  Image as ImageIcon,
  BookMarked,
  Milestone,
  Lightbulb,
} from 'lucide-react';
import { ModuleId } from '../types';
import { AppConfig } from '../config/appConfig';

interface BottomNavProps {
  currentModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  config: AppConfig;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentModule,
  onSelectModule,
  config,
}) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const mainTabs: { id: ModuleId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'estudos', label: 'Estudos', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'tarefas', label: 'Tarefas', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'projetos', label: 'Projetos', icon: <FolderKanban className="w-5 h-5" /> },
  ];

  const moreItems: { id: ModuleId; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'assistente', label: 'Assistente NLP', icon: <Bot className="w-5 h-5" />, color: 'from-blue-600/30 to-indigo-600/20' },
    { id: 'habitos', label: 'Hábitos', icon: <Flame className="w-5 h-5" />, color: 'from-amber-500/20 to-orange-500/10' },
    { id: 'rotina', label: 'Rotina', icon: <Clock className="w-5 h-5" />, color: 'from-sky-500/20 to-blue-500/10' },
    { id: 'trabalho', label: 'Work & Clientes', icon: <Briefcase className="w-5 h-5" />, color: 'from-slate-500/20 to-zinc-600/20' },
    { id: 'financas', label: 'Financeiro', icon: <Wallet className="w-5 h-5" />, color: 'from-emerald-500/20 to-teal-500/10' },
    { id: 'vendas', label: 'Vendas CRM', icon: <TrendingUp className="w-5 h-5" />, color: 'from-violet-500/20 to-purple-500/10' },
    { id: 'treinos', label: 'Treinos', icon: <Dumbbell className="w-5 h-5" />, color: 'from-rose-500/20 to-pink-500/10' },
    { id: 'saude', label: 'Crescimento & Sono', icon: <Activity className="w-5 h-5" />, color: 'from-teal-500/20 to-emerald-500/10' },
    { id: 'galeria', label: 'Galeria da Vida', icon: <ImageIcon className="w-5 h-5" />, color: 'from-pink-500/20 to-rose-500/10' },
    { id: 'diario', label: 'Diário & Reflexão', icon: <BookMarked className="w-5 h-5" />, color: 'from-amber-600/20 to-yellow-500/10' },
    { id: 'timeline', label: 'Linha do Tempo', icon: <Milestone className="w-5 h-5" />, color: 'from-cyan-600/20 to-sky-500/10' },
    { id: 'inbox', label: 'Caixa de Ideias', icon: <Lightbulb className="w-5 h-5" />, color: 'from-yellow-500/20 to-amber-500/10' },
    { id: 'memoria', label: 'Memória & Notas', icon: <Sparkles className="w-5 h-5" />, color: 'from-yellow-500/20 to-amber-500/10' },
    { id: 'metas', label: 'Metas', icon: <Target className="w-5 h-5" />, color: 'from-indigo-500/20 to-blue-500/10' },
    { id: 'calendario', label: 'Calendário', icon: <CalendarDays className="w-5 h-5" />, color: 'from-cyan-500/20 to-sky-500/10' },
    { id: 'ia', label: 'Life AI Tutor', icon: <Bot className="w-5 h-5" />, color: 'from-fuchsia-500/20 to-indigo-500/10' },
    { id: 'configuracoes', label: 'Ajustes', icon: <Settings className="w-5 h-5" />, color: 'from-slate-500/20 to-slate-500/10' },
  ];

  const handleSelectMore = (id: ModuleId) => {
    onSelectModule(id);
    setShowMoreSheet(false);
  };

  return (
    <>
      {/* Floating Bottom Dock */}
      <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 ios-glass border border-white/15 rounded-3xl p-1.5 shadow-2xl flex items-center justify-around">
        {mainTabs.map((tab) => {
          const isActive = currentModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectModule(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-indigo-400 bg-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
            </button>
          );
        })}

        {/* More Options Tab */}
        <button
          onClick={() => setShowMoreSheet(true)}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            showMoreSheet || !mainTabs.some((t) => t.id === currentModule)
              ? 'text-indigo-400 bg-white/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Mais</span>
        </button>
      </nav>

      {/* "Mais" Modal Sheet */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end p-4 md:hidden">
          <div className="ios-glass-sheet rounded-3xl p-5 border border-white/20 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Todos os Módulos</h3>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="p-1 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectMore(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} text-left hover:scale-[1.02] active:scale-[0.98] transition-all`}
                >
                  <span className="text-slate-200">{item.icon}</span>
                  <span className="text-xs font-semibold text-slate-100">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
