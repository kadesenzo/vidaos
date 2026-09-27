/**
 * LIFE OS — Diário Module ("Como foi seu dia?")
 * Daily narrative reflections and historical search across days and months.
 */

import React, { useState } from 'react';
import {
  BookMarked,
  Calendar,
  Search,
  Sparkles,
  Plus,
  Smile,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { JournalEntry } from '../types';

export const DiarioModule: React.FC = () => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('produtivo');
  const [searchQuery, setSearchQuery] = useState('');

  const entries = StorageService.getJournal();

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    StorageService.addJournalEntry(content, mood);
    setContent('');
  };

  const filteredEntries = entries.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.content.toLowerCase().includes(q) || item.date.includes(q);
  });

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase">
            <BookMarked className="w-4 h-4" />
            <span>DIÁRIO PESSOAL & MEMÓRIA DIÁRIA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Como foi seu dia?
          </h1>
          <p className="text-xs text-slate-400">
            Escreva o resumo do que você viveu, sentiu ou produziu. Pesquise quando quiser.
          </p>
        </div>
      </div>

      {/* Write Today's Entry */}
      <form
        onSubmit={handleSaveEntry}
        className="p-6 rounded-3xl ios-glass-card border border-indigo-500/30 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-indigo-300 uppercase font-bold">
            Registro de Hoje • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>

          <div className="flex items-center gap-1.5">
            {(['produtivo', 'focado', 'equilibrado', 'cansado'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono capitalize transition-all ${
                  mood === m
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ex: Hoje fui para o treino de jiu-jitsu, avancei no projeto KVB e resolvi questões de matemática..."
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-6 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold disabled:opacity-50"
          >
            Salvar no Diário
          </button>
        </div>
      </form>

      {/* Historical Search */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-white tracking-tight">Entradas Anteriores</h3>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar dia ou palavra-chave..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">
                📅 {entry.date}
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                {entry.mood}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {entry.content}
            </p>

            {entry.tags && entry.tags.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-1">
                {entry.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
