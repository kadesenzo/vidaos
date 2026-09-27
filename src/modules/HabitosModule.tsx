/**
 * LIFE OS — Hábitos Module
 * Habit tracker with 7-day streak grid (Seg a Dom), streak counter, and celebratory feedback.
 */

import React, { useState } from 'react';
import { Flame, Plus, Check, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import { Habit } from '../types';

export const HabitosModule: React.FC = () => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Saúde');
  const habits = StorageService.getHabits();

  // Generate 7 days of current week (Monday to Sunday)
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(today.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i],
        dayNumber: d.getDate(),
      });
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const handleToggleHabit = (habitId: string, dateStr: string) => {
    StorageService.toggleHabitDay(habitId, dateStr);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const list = StorageService.getHabits();
    list.unshift({
      id: 'hab_' + Date.now(),
      name: newHabitName,
      icon: 'Flame',
      category: newHabitCategory,
      frequency: 'diaria',
      completions: {},
      streak: 0,
      createdAt: new Date().toISOString(),
    });
    StorageService.saveHabits(list);
    setNewHabitName('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-orange-400 text-xs font-mono font-semibold uppercase">
            <Flame className="w-4 h-4" />
            <span>CONSTRUÇÃO DE CONSTÂNCIA & STREAKS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Hábitos Diários
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhe o preenchimento semanal sem quebrar o ritmo.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-amber-300 uppercase font-mono block">Maior Sequência</span>
            <span className="text-sm font-extrabold text-white font-mono">14 Dias Ininterruptos</span>
          </div>
        </div>
      </div>

      {/* Add Habit Bar */}
      <form
        onSubmit={handleAddHabit}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Ex: Ler 20 minutos, Beber 3L de água, Praticar meditação..."
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={newHabitCategory}
          onChange={(e) => setNewHabitCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
        >
          <option value="Saúde">Saúde</option>
          <option value="Estudos">Estudos</option>
          <option value="Projetos">Projetos</option>
          <option value="Mente">Mente</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Hábito</span>
        </button>
      </form>

      {/* Weekly Habits Table */}
      <div className="p-6 rounded-3xl ios-glass-card border border-white/10 overflow-x-auto">
        <div className="min-w-[600px] space-y-4">
          {/* Header Days Row */}
          <div className="grid grid-cols-12 gap-2 text-center text-xs font-mono font-bold text-slate-400 pb-3 border-b border-white/10">
            <div className="col-span-5 text-left pl-2">HÁBITO</div>
            {weekDates.map((d) => (
              <div key={d.dateStr} className="col-span-1">
                <span className="block text-[10px] text-slate-500 uppercase">{d.dayName}</span>
                <span className="text-white text-xs">{d.dayNumber}</span>
              </div>
            ))}
          </div>

          {/* Habit Rows */}
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="grid grid-cols-12 gap-2 items-center p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors"
            >
              <div className="col-span-5 pl-2 flex items-center justify-between pr-4">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">{habit.name}</h4>
                  <span className="text-[10px] text-slate-400">{habit.category}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-400 font-mono text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{habit.streak}d</span>
                </div>
              </div>

              {weekDates.map((d) => {
                const isChecked = !!habit.completions[d.dateStr];
                return (
                  <div key={d.dateStr} className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleToggleHabit(habit.id, d.dateStr)}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-400 text-black shadow-md shadow-emerald-500/20 scale-105'
                          : 'border-white/10 text-slate-600 hover:border-white/30'
                      }`}
                    >
                      {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : '·'}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
