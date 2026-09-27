/**
 * LIFE OS — Caixa de Ideias & Inbox Module
 * Flow: Inbox -> Ideia Validada -> Projeto -> Em Andamento -> Concluído
 */

import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trash2,
  MoveRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import { MemoryNote } from '../types';

export const IdeiasInboxModule: React.FC = () => {
  const [newIdeaText, setNewIdeaText] = useState('');
  const [activeStage, setActiveStage] = useState<'inbox' | 'ideia' | 'projeto' | 'concluido'>('inbox');

  const notes = StorageService.getMemoryNotes().filter((n) => !n.deletedAt);

  const handleCaptureIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim()) return;

    StorageService.addMemoryNote({
      title: newIdeaText.slice(0, 40),
      content: newIdeaText,
      category: 'ideia',
      tags: ['inbox', 'novo'],
      pinned: false,
    });

    setNewIdeaText('');
    confetti({ particleCount: 45, spread: 50, origin: { y: 0.7 } });
  };

  const handlePromoteToProject = (note: MemoryNote) => {
    const projects = StorageService.getProjects();
    projects.unshift({
      id: 'prj_' + Date.now(),
      name: note.title,
      objective: note.content,
      description: note.content,
      deadline: '2026-12-31',
      budget: 3000,
      spent: 0,
      revenue: 0,
      progress: 10,
      status: 'planejamento',
      nextSteps: ['Validar viabilidade técnica', 'Criar protótipo inicial'],
      createdAt: new Date().toISOString(),
    });
    StorageService.saveProjects(projects);
    alert(`A ideia "${note.title}" foi promovida para a área de Projetos!`);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono font-semibold uppercase">
            <Lightbulb className="w-4 h-4" />
            <span>CAPTURA DE INSIGHTS & PIPELINE DE IDEIAS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Caixa de Ideias
          </h1>
          <p className="text-xs text-slate-400">
            Fluxo estruturado: <strong>Inbox → Ideia → Projeto → Em Andamento → Concluído</strong>.
          </p>
        </div>
      </div>

      {/* Giant Capture Box */}
      <form
        onSubmit={handleCaptureIdea}
        className="p-6 rounded-3xl ios-glass-card border border-yellow-500/30 space-y-3 shadow-xl"
      >
        <span className="text-xs font-bold font-mono uppercase text-yellow-300 block">
          Teve uma ideia agora? Despeje aqui sem pensar duas vezes:
        </span>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newIdeaText}
            onChange={(e) => setNewIdeaText(e.target.value)}
            placeholder="Ex: Ideia de aplicativo de treinos para atletas de Jiu-Jitsu..."
            className="flex-1 w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-yellow-400 font-medium"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Capturar</span>
          </button>
        </div>
      </form>

      {/* Ideas List with Promotion to Project */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight">Ideias no Inbox</h3>
        {notes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs ios-glass-card rounded-3xl">
            Nenhuma ideia no inbox no momento. Use o campo acima para capturar.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <h4 className="text-sm font-bold text-white tracking-tight">{note.title}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
              </div>

              <button
                onClick={() => handlePromoteToProject(note)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-yellow-300 text-xs font-semibold self-start sm:self-center transition-colors flex-shrink-0"
              >
                <span>Promover a Projeto</span>
                <MoveRight className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
