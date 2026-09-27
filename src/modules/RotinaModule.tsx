/**
 * LIFE OS — Rotina Module
 * Flexible time-blocking timeline allowing: Concluir, Pular, Adiar.
 */

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  SkipForward,
  Calendar,
  AlertCircle,
  Sun,
  Moon,
  Coffee,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { RoutineBlock, RoutineStatus } from '../types';

export const RotinaModule: React.FC = () => {
  const [newTime, setNewTime] = useState('08:00');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');

  const routine = StorageService.getRoutine();

  const handleUpdateStatus = (blockId: string, status: RoutineStatus) => {
    StorageService.updateRoutineStatus(blockId, status);
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const list = StorageService.getRoutine();
    list.push({
      id: 'rt_' + Date.now(),
      time: newTime,
      durationMinutes: 45,
      title: newTitle,
      subtitle: newSubtitle,
      category: 'Rotina',
      icon: 'Clock',
      status: 'pendente',
    });
    // Sort chronologically
    list.sort((a, b) => a.time.localeCompare(b.time));
    StorageService.saveRoutine(list);

    setNewTitle('');
    setNewSubtitle('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold uppercase">
            <Clock className="w-4 h-4" />
            <span>CRONOGRAMA & BLOCOS DE TEMPO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Rotina Diária
          </h1>
          <p className="text-xs text-slate-400">
            Estrutura flexível sem rigidez excessiva. Avance, conclua ou adie quando necessário.
          </p>
        </div>
      </div>

      {/* Add Routine Block */}
      <form
        onSubmit={handleAddBlock}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none"
        />
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Ex: 08:30 — Sessão de Estudo Focado"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          value={newSubtitle}
          onChange={(e) => setNewSubtitle(e.target.value)}
          placeholder="Subtítulo ou observação (opcional)"
          className="w-full sm:w-48 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </form>

      {/* Timeline List */}
      <div className="space-y-3">
        {routine.map((block) => (
          <div
            key={block.id}
            className={`p-4 md:p-5 rounded-3xl ios-glass-card border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              block.status === 'em_andamento'
                ? 'border-indigo-500/50 bg-indigo-950/20 shadow-lg'
                : block.status === 'concluido'
                ? 'border-emerald-500/20 opacity-60'
                : block.status === 'pulado'
                ? 'border-white/5 opacity-40 line-through'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 text-center">
                <span className="text-base font-extrabold font-mono text-white block">
                  {block.time}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {block.durationMinutes}m
                </span>
              </div>

              <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />

              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{block.title}</h4>
                {block.subtitle && (
                  <p className="text-xs text-slate-400 mt-0.5">{block.subtitle}</p>
                )}
              </div>
            </div>

            {/* Action Buttons: Concluir, Pular, Adiar */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleUpdateStatus(block.id, 'concluido')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                  block.status === 'concluido'
                    ? 'bg-emerald-500 text-black'
                    : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Concluir</span>
              </button>

              <button
                onClick={() => handleUpdateStatus(block.id, 'pulado')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Pular
              </button>

              <button
                onClick={() => handleUpdateStatus(block.id, 'adiado')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30"
              >
                Adiar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
