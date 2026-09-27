/**
 * LIFE OS — Notification Center Drawer
 * Real-time notifications for study sessions, task deadlines, and finance alerts.
 */

import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  GraduationCap,
  CheckSquare,
  DollarSign,
  Flame,
  Info,
  ArrowRight,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { NotificationItem, ModuleId } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (module: ModuleId) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToModule,
}) => {
  if (!isOpen) return null;

  const notifications = StorageService.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead();
  };

  const handleItemClick = (notif: NotificationItem) => {
    StorageService.markNotificationRead(notif.id);
    if (notif.actionModule) {
      onNavigateToModule(notif.actionModule);
      onClose();
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'estudo':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      case 'tarefa':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'financeiro':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'habito':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full ios-glass-sheet border-l border-white/10 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Notificações</h3>
              <p className="text-xs text-slate-400">
                {unreadCount > 0 ? `${unreadCount} não lidas` : 'Tudo atualizado'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header */}
        {unreadCount > 0 && (
          <div className="flex justify-end mb-3">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Marcar todas como lidas
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
              <Bell className="w-8 h-8 mb-2 opacity-30" />
              <span>Nenhuma notificação no momento.</span>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                  item.read
                    ? 'bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:bg-white/5'
                    : 'bg-white/[0.08] border-indigo-500/30 hover:bg-white/[0.12] shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 mt-0.5">{getIcon(item.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                    {item.actionModule && (
                      <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
                        <span>Acessar {item.actionModule}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
