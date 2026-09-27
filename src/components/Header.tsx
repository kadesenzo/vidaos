/**
 * LIFE OS — Header Component (iOS 26 Frosted Navigation Bar)
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Timer,
  Plus,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { AppConfig } from '../config/appConfig';
import { UserProfile, NotificationItem } from '../types';

interface HeaderProps {
  config: AppConfig;
  profile: UserProfile;
  activeStudyTime?: number; // seconds
  onOpenSearch: () => void;
  onOpenQuickCapture: () => void;
  onOpenNotifications: () => void;
  onNavigateToModule: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  profile,
  activeStudyTime,
  onOpenSearch,
  onOpenQuickCapture,
  onOpenNotifications,
  onNavigateToModule,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = () => {
      setNotifications(StorageService.getNotifications());
    };
    load();
    const unsub = StorageService.subscribe(load);
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 w-full ios-glass border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Dynamic Island Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigateToModule('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090d16] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {config.appName}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-medium border border-indigo-500/30">
                OS 26
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[190px]">
              {config.tagline}
            </p>
          </div>
        </button>

        {/* Active Study Session Widget */}
        {activeStudyTime !== undefined && activeStudyTime > 0 && (
          <div
            onClick={() => onNavigateToModule('estudos')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono cursor-pointer hover:bg-emerald-500/20 transition-all"
            title="Sessão de estudos em andamento"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Timer className="w-3.5 h-3.5" />
            <span>Estudando: {formatTimer(activeStudyTime)}</span>
          </div>
        )}
      </div>

      {/* Global Search Bar (Trigger for ⌘K) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl ios-glass-subtle hover:bg-white/[0.06] text-slate-400 text-xs transition-all border border-white/5 shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Buscar tarefas, matérias, aulas, notas...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Global Quick Capture Button */}
        <button
          onClick={onOpenQuickCapture}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl ios-button-primary text-white text-xs font-medium cursor-pointer shadow-md"
          title="Captura rápida (Nova tarefa, nota, estudo...)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Criar</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Central de Notificações"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#05070f] animate-pulse" />
          )}
        </button>

        {/* Date and Time Clock Widget */}
        <div className="hidden xl:flex flex-col text-right pl-2 border-l border-white/10">
          <span className="text-xs font-bold text-slate-200 tracking-tight">{timeStr}</span>
          <span className="text-[10px] text-slate-400 capitalize">{dateStr}</span>
        </div>

        {/* User Avatar */}
        <button
          onClick={() => onNavigateToModule('configuracoes')}
          className="flex items-center gap-2 p-1 rounded-2xl hover:bg-white/5 transition-all group"
          title="Perfil e Configurações"
        >
          <img
            src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={profile.nickname}
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/20 group-hover:ring-indigo-400 transition-all"
          />
        </button>
      </div>
    </header>
  );
};
