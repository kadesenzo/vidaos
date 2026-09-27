/**
 * LIFE OS — Memória Module (Segundo Cérebro)
 * Quick capture of thoughts, ideas, study insights, and reminders with search and categories.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Pin,
  Tag,
  Trash2,
  Calendar,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { MemoryNote, MemoryCategory } from '../types';

export const MemoriaModule: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('ideia');
  const [tagsInput, setTagsInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todas');

  const notes = StorageService.getMemoryNotes().filter((n) => !n.deletedAt);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    StorageService.addMemoryNote({
      title: title || 'Nota sem título',
      content,
      category,
      tags,
      pinned: false,
    });

    setTitle('');
    setContent('');
    setTagsInput('');
  };

  const handleTogglePin = (noteId: string) => {
    const list = StorageService.getMemoryNotes();
    const item = list.find((n) => n.id === noteId);
    if (item) {
      item.pinned = !item.pinned;
      StorageService.saveMemoryNotes(list);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const list = StorageService.getMemoryNotes();
    const item = list.find((n) => n.id === noteId);
    if (item) {
      item.deletedAt = new Date().toISOString();
      StorageService.saveMemoryNotes(list);
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (filterCategory !== 'todas' && n.category !== filterCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchTags = n.tags.some((t) => t.includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>SEGUNDO CÉREBRO & CAPTURA DE PENSAMENTOS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Memória & Ideias
          </h1>
          <p className="text-xs text-slate-400">
            "Eu não preciso lembrar de tudo. Meu sistema lembra por mim."
          </p>
        </div>
      </div>

      {/* Quick Add Memory Box */}
      <form
        onSubmit={handleAddNote}
        className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-3"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da ideia, insight ou lembrete..."
            className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MemoryCategory)}
            className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="ideia">💡 Ideia</option>
            <option value="lembrete">⏰ Lembrete</option>
            <option value="estudo">📚 Estudo</option>
            <option value="projeto">🚀 Projeto</option>
            <option value="financeiro">💰 Financeiro</option>
            <option value="pessoal">👤 Pessoal</option>
            <option value="outro">📦 Outro</option>
          </select>
        </div>

        <textarea
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva livremente qualquer coisa sem atrito mental..."
          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Tags separadas por vírgula (ex: neurociência, startup, livro)..."
            className="w-full sm:w-80 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 rounded-xl ios-button-primary text-white text-xs font-bold"
          >
            Salvar na Memória
          </button>
        </div>
      </form>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['todas', 'ideia', 'estudo', 'lembrete', 'projeto'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs capitalize ${
                filterCategory === cat
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar notas..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Notes Masonry / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`p-5 rounded-3xl ios-glass-card border flex flex-col justify-between space-y-3 transition-all ${
              note.pinned ? 'border-amber-500/40 bg-amber-950/10' : 'border-white/10'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {note.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className={`p-1 rounded-lg ${
                      note.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white tracking-tight">{note.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {note.content}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
