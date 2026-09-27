/**
 * LIFE OS — Linha do Tempo da Sua Vida & "Meu Ano"
 * Historical timeline tracking evolution across months: Estudos, Projetos, Treinos, Finanças e Conquistas.
 */

import React, { useState } from 'react';
import {
  Milestone,
  Calendar,
  GraduationCap,
  FolderKanban,
  Dumbbell,
  Wallet,
  Trophy,
  Plus,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { TimelineEvent } from '../types';

export const TimelineModule: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TimelineEvent['category']>('projeto');

  const timelineEvents = StorageService.getTimeline();

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    StorageService.addTimelineEvent({
      monthYear: 'Setembro 2026',
      date: new Date().toISOString().split('T')[0],
      title: newTitle,
      category: newCategory,
      description: newDesc,
      icon: 'Milestone',
    });

    setNewTitle('');
    setNewDesc('');
  };

  const months = [
    'todos',
    'Setembro 2026',
    'Agosto 2026',
    'Julho 2026',
    'Junho 2026',
    'Maio 2026',
  ];

  const filteredEvents = timelineEvents.filter((item) => {
    if (selectedMonth !== 'todos' && item.monthYear !== selectedMonth) return false;
    return true;
  });

  const getIcon = (cat: TimelineEvent['category']) => {
    switch (cat) {
      case 'estudo':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      case 'projeto':
        return <FolderKanban className="w-4 h-4 text-violet-400" />;
      case 'treino':
        return <Dumbbell className="w-4 h-4 text-rose-400" />;
      case 'financeiro':
        return <Wallet className="w-4 h-4 text-amber-400" />;
      default:
        return <Trophy className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase">
            <Milestone className="w-4 h-4" />
            <span>ARQUIVO DA SUA EVOLUÇÃO PESSOAL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Meu Ano & Linha do Tempo
          </h1>
          <p className="text-xs text-slate-400">
            Olhe para trás e veja o que você conquistou, estudou e construiu em cada mês.
          </p>
        </div>
      </div>

      {/* Month Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMonth === m
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {m === 'todos' ? 'Todo o Histórico' : m}
          </button>
        ))}
      </div>

      {/* Quick Add Milestone Form */}
      <form
        onSubmit={handleAddEvent}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Novo marco (ex: Concluiu módulo de Matemática, Lançou versão...)"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
        >
          <option value="projeto">🚀 Projeto</option>
          <option value="estudo">📚 Estudo</option>
          <option value="treino">🥋 Treino</option>
          <option value="financeiro">💰 Financeiro</option>
          <option value="conquista">🏆 Conquista</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Marco</span>
        </button>
      </form>

      {/* Vertical Timeline */}
      <div className="relative pl-6 md:pl-8 border-l-2 border-indigo-500/30 space-y-6 ml-4">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Bullet Pin */}
            <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#05070f] border-2 border-indigo-500 flex items-center justify-center shadow-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
            </div>

            <div className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-2 group-hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white/5">{getIcon(evt.category)}</div>
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                    {evt.monthYear}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{evt.date}</span>
              </div>

              <h3 className="text-base font-bold text-white tracking-tight">{evt.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
