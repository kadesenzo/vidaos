/**
 * LIFE OS — Metas Module
 * High-level goal tracking with milestones and visual progress bars.
 */

import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import { LifeGoal } from '../types';

export const MetasModule: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newTargetValue, setNewTargetValue] = useState('');
  const [newUnit, setNewUnit] = useState('R$');
  const [newCategory, setNewCategory] = useState('Finanças');

  const goals = StorageService.getGoals();

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const list = StorageService.getGoals();
    const g = list.find((item) => item.id === goalId);
    if (g) {
      const ms = g.milestones.find((m) => m.id === milestoneId);
      if (ms) {
        ms.done = !ms.done;
        StorageService.saveGoals(list);
        if (ms.done) {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        }
      }
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const list = StorageService.getGoals();
    list.unshift({
      id: 'gl_' + Date.now(),
      title: newTitle,
      category: newCategory,
      deadline: '2026-12-31',
      targetValue: parseFloat(newTargetValue) || 100,
      currentValue: 0,
      unit: newUnit,
      milestones: [
        { id: 'm_' + Date.now() + '_1', title: 'Primeira fase do plano', done: false },
        { id: 'm_' + Date.now() + '_2', title: 'Consistência intermediária', done: false },
        { id: 'm_' + Date.now() + '_3', title: 'Conclusão e conquista', done: false },
      ],
    });
    StorageService.saveGoals(list);

    setNewTitle('');
    setNewTargetValue('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase">
            <Target className="w-4 h-4" />
            <span>OBJETIVOS PRINCIPAIS & MARCOS DE CONQUISTA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Metas de Longo Prazo
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhe o que você está tentando alcançar visualmente por etapas.
          </p>
        </div>
      </div>

      {/* Add Goal Bar */}
      <form
        onSubmit={handleCreateGoal}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Ex: Comprar MacBook M4, Obter 95% em Matemática..."
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="number"
          value={newTargetValue}
          onChange={(e) => setNewTargetValue(e.target.value)}
          placeholder="Alvo (ex: 15000)"
          className="w-full sm:w-28 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none font-mono"
        />
        <input
          type="text"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          placeholder="Unidade (R$, %, pts)"
          className="w-full sm:w-28 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Meta</span>
        </button>
      </form>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const percentage = Math.min(
            100,
            Math.round((goal.currentValue / (goal.targetValue || 1)) * 100)
          );

          return (
            <div
              key={goal.id}
              className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {goal.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{goal.title}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">
                    {goal.unit} {goal.currentValue.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    de {goal.unit} {goal.targetValue.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Progresso</span>
                  <span className="text-white font-bold">{percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-slate-300 block">Etapas & Marcos:</span>
                {goal.milestones.map((ms) => (
                  <button
                    key={ms.id}
                    onClick={() => handleToggleMilestone(goal.id, ms.id)}
                    className="w-full flex items-center gap-2.5 text-left text-xs p-2 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                        ms.done
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-white/20'
                      }`}
                    >
                      {ms.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-slate-200 group-hover:text-white ${
                        ms.done ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {ms.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
