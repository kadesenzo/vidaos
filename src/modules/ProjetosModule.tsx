/**
 * LIFE OS — Projetos Module
 * Personal & commercial projects tracker with budget, revenue, and milestones.
 */

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Project } from '../types';

export const ProjetosModule: React.FC = () => {
  const [newProjectName, setNewProjectName] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const projects = StorageService.getProjects();

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const list = StorageService.getProjects();
    list.unshift({
      id: 'prj_' + Date.now(),
      name: newProjectName,
      objective: newObjective,
      description: newObjective,
      deadline: '2026-12-31',
      budget: parseFloat(newBudget) || 5000,
      spent: 0,
      revenue: 0,
      progress: 15,
      status: 'ativo',
      nextSteps: ['Definir escopo detalhado', 'Criar primeiras tarefas'],
      createdAt: new Date().toISOString(),
    });
    StorageService.saveProjects(list);

    setNewProjectName('');
    setNewObjective('');
    setNewBudget('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-semibold uppercase">
            <FolderKanban className="w-4 h-4" />
            <span>GESTÃO DE PROJETOS & INICIATIVAS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Projetos Ativos
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhe o objetivo, orçamento, faturamento e progresso visual de cada projeto.
          </p>
        </div>
      </div>

      {/* Add Project Form */}
      <form
        onSubmit={handleCreateProject}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Nome do projeto (ex: KVB Gourmet, App Mobile...)"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          placeholder="Objetivo principal"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none"
        />
        <input
          type="number"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
          placeholder="Orçamento (R$)"
          className="w-full sm:w-32 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none font-mono"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Projeto</span>
        </button>
      </form>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-3xl ios-glass-card border border-white/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono px-3 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {proj.status.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Prazo: {new Date(proj.deadline).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{proj.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{proj.objective}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Progresso Geral</span>
                  <span className="text-white font-bold">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* Financial Box */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-mono block">Orçamento</span>
                  <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                    R$ {proj.budget.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-mono block">Custos</span>
                  <span className="text-xs font-bold text-rose-300 font-mono mt-0.5 block">
                    R$ {proj.spent.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-center">
                  <span className="text-[10px] text-emerald-400 font-mono block">Receita</span>
                  <span className="text-xs font-bold text-emerald-300 font-mono mt-0.5 block">
                    R$ {proj.revenue.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Next steps list */}
              {proj.nextSteps && proj.nextSteps.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 block">Próximos Passos:</span>
                  {proj.nextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-400 bg-white/[0.02] p-2 rounded-xl"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
