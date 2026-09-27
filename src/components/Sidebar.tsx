/**
 * LIFE OS — Desktop Sidebar Navigation
 * Refined iOS 26 frosted dock with dynamic active states and badges.
 */

import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  CheckSquare,
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
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  BookMarked,
  Milestone,
  Lightbulb,
  Briefcase,
  Activity,
} from 'lucide-react';
import { ModuleId } from '../types';
import { AppConfig } from '../config/appConfig';

interface SidebarProps {
  currentModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  config: AppConfig;
  collapsed: boolean;
  onToggleCollapse: () => void;
  counts?: {
    pendingTasks: number;
    pendingReviews: number;
    activeHabits: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  config,
  collapsed,
  onToggleCollapse,
  counts,
}) => {
  const navItems: { id: ModuleId; label: string; icon: React.ReactNode; badge?: number | string; highlight?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Início',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'assistente',
      label: 'Assistente',
      icon: <Bot className="w-4 h-4" />,
      badge: 'NLP',
      highlight: true,
    },
    {
      id: 'estudos',
      label: 'Estudos',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: counts?.pendingReviews ? `${counts.pendingReviews} rev` : 'Academy',
      highlight: true,
    },
    {
      id: 'tarefas',
      label: 'Tarefas',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: counts?.pendingTasks || undefined,
    },
    {
      id: 'habitos',
      label: 'Hábitos',
      icon: <Flame className="w-4 h-4" />,
      badge: counts?.activeHabits ? `${counts.activeHabits} ativos` : undefined,
    },
    {
      id: 'rotina',
      label: 'Rotina',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'projetos',
      label: 'Projetos',
      icon: <FolderKanban className="w-4 h-4" />,
    },
    {
      id: 'trabalho',
      label: 'Work',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'financas',
      label: 'Financeiro',
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      id: 'vendas',
      label: 'Vendas CRM',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'treinos',
      label: 'Treinos',
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      id: 'saude',
      label: 'Crescimento & Sono',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'galeria',
      label: 'Galeria da Vida',
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: 'diario',
      label: 'Diário',
      icon: <BookMarked className="w-4 h-4" />,
    },
    {
      id: 'timeline',
      label: 'Meu Ano / Timeline',
      icon: <Milestone className="w-4 h-4" />,
    },
    {
      id: 'inbox',
      label: 'Caixa de Ideias',
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: 'memoria',
      label: 'Memória',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'metas',
      label: 'Metas',
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: 'calendario',
      label: 'Calendário',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'ia',
      label: 'Life AI Tutor',
      icon: <Bot className="w-4 h-4" />,
      badge: 'IA',
    },
    {
      id: 'configuracoes',
      label: 'Ajustes',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  // Filter based on enabled modules in config
  const visibleItems = navItems.filter((item) => config.enabledModules[item.id] !== false);

  return (
    <aside
      className={`hidden md:flex flex-col h-[calc(100vh-65px)] sticky top-[65px] border-r border-white/10 ios-glass transition-all duration-300 z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {visibleItems.map((item) => {
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-500/10 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`transition-colors ${
                    isActive
                      ? 'text-indigo-400'
                      : item.highlight
                      ? 'text-amber-400 group-hover:text-amber-300'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="tracking-tight text-left truncate">{item.label}</span>
                )}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive
                      ? 'bg-indigo-500/40 text-indigo-200'
                      : item.highlight
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        {!collapsed && (
          <span className="text-[11px] font-mono text-slate-400">v{config.version}</span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-auto"
          title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
