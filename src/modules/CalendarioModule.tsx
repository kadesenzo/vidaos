/**
 * LIFE OS — Calendário Module
 * Unified calendar view combining Tasks, Study sessions, Routine, and Workouts.
 */

import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  CheckSquare,
  Dumbbell,
  Clock,
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export const CalendarioModule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'mes' | 'semana'>('mes');

  const tasks = StorageService.getTasks();
  const workouts = StorageService.getWorkouts();
  const routine = StorageService.getRoutine();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase">
            <CalendarDays className="w-4 h-4" />
            <span>AGENDA INTEGRADA & PLANEJAMENTO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Calendário do Life OS
          </h1>
          <p className="text-xs text-slate-400">
            Visão unificada das suas tarefas, estudos programados e treinos.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-base font-bold text-white font-mono min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6 rounded-3xl ios-glass-card border border-white/10 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-400 pb-4 border-b border-white/10 mb-4">
          <div>DOM</div>
          <div>SEG</div>
          <div>TER</div>
          <div>QUA</div>
          <div>QUI</div>
          <div>SEX</div>
          <div>SÁB</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((i) => (
            <div key={`empty_${i}`} className="h-24 p-2 rounded-2xl bg-transparent" />
          ))}

          {daysArray.map((day) => {
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            // Check events on this day
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
              .toString()
              .padStart(2, '0')}`;
            const dayTasks = tasks.filter((t) => t.date === dateStr);
            const dayWorkouts = workouts.filter((w) => w.date === dateStr);

            return (
              <div
                key={day}
                className={`min-h-[90px] p-2.5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isToday
                    ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isToday ? 'text-indigo-400' : 'text-slate-300'
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  )}
                </div>

                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className="text-[10px] truncate px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium"
                    >
                      ✓ {t.title}
                    </div>
                  ))}
                  {dayWorkouts.map((w) => (
                    <div
                      key={w.id}
                      className="text-[10px] truncate px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium"
                    >
                      🥋 {w.activity}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
