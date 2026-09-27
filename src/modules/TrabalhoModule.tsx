/**
 * LIFE OS — Trabalho & Negócios Module (WORK)
 * Dedicated workspace for clients, proposals, deliverables, and contractual deadlines.
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  ArrowRight,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { WorkDeal } from '../types';

export const TrabalhoModule: React.FC = () => {
  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [value, setValue] = useState('');
  const [nextAction, setNextAction] = useState('');

  const deals = StorageService.getWorkDeals();

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim()) return;

    StorageService.addWorkDeal({
      client,
      project: project || 'Consultoria Técnica',
      status: 'proposta',
      value: parseFloat(value) || 5000,
      deadline: '2026-11-30',
      nextAction: nextAction || 'Enviar briefing detalhado',
    });

    setClient('');
    setProject('');
    setValue('');
    setNextAction('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase">
            <Briefcase className="w-4 h-4" />
            <span>ESPAÇO PROFISSIONAL & CLIENTES</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Trabalho & Entregas
          </h1>
          <p className="text-xs text-slate-400">
            Controle projetos comerciais, clientes, propostas financeiras e próximas entregas.
          </p>
        </div>
      </div>

      {/* Add Deal Bar */}
      <form
        onSubmit={handleAddDeal}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Cliente ou Empresa (ex: KAEN Motors, KVB Pilot...)"
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="Projeto / Escopo"
          className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Valor (R$)"
          className="w-full sm:w-28 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar</span>
        </button>
      </form>

      {/* Deals List */}
      <div className="space-y-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  {deal.status.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mt-1">{deal.client}</h3>
                <span className="text-xs text-slate-400">{deal.project}</span>
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold font-mono text-emerald-400 block">
                  R$ {deal.value.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Prazo: {deal.deadline}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Próxima ação: {deal.nextAction}</span>
              </div>
              <button
                onClick={() => alert(`Ação "${deal.nextAction}" marcada como concluída!`)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Concluir Etapa ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
