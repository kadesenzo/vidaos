/**
 * LIFE OS — Vendas / CRM Module
 * Pipeline: Lead -> Abordado -> Respondeu -> Negociação -> Proposta -> Fechado.
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  ArrowRight,
  User,
  Phone,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { LeadDeal, LeadStage } from '../types';

export const VendasModule: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [product, setProduct] = useState('');
  const [value, setValue] = useState('');
  const [contact, setContact] = useState('');

  const leads = StorageService.getLeads();

  const stages: { id: LeadStage; label: string; color: string }[] = [
    { id: 'lead', label: 'Lead Inicial', color: 'text-slate-400' },
    { id: 'abordado', label: 'Abordado', color: 'text-sky-400' },
    { id: 'respondeu', label: 'Respondeu', color: 'text-indigo-400' },
    { id: 'negociacao', label: 'Em Negociação', color: 'text-amber-400' },
    { id: 'proposta', label: 'Proposta Enviada', color: 'text-purple-400' },
    { id: 'fechado', label: 'Fechado / Ganho', color: 'text-emerald-400' },
  ];

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const list = StorageService.getLeads();
    list.unshift({
      id: 'ld_' + Date.now(),
      clientName,
      contact: contact || 'Via WhatsApp',
      product: product || 'Consultoria / Software',
      value: parseFloat(value) || 3500,
      stage: 'lead',
      nextAction: 'Enviar mensagem de introdução',
      updatedAt: new Date().toISOString(),
    });
    StorageService.saveLeads(list);

    setClientName('');
    setProduct('');
    setValue('');
    setContact('');
  };

  const handleAdvanceStage = (leadId: string, currentStage: LeadStage) => {
    const stageOrder: LeadStage[] = [
      'lead',
      'abordado',
      'respondeu',
      'negociacao',
      'proposta',
      'fechado',
    ];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      const list = StorageService.getLeads();
      const item = list.find((l) => l.id === leadId);
      if (item) {
        item.stage = nextStage;
        item.updatedAt = new Date().toISOString();
        StorageService.saveLeads(list);
      }
    }
  };

  const totalEmNegociacao = leads
    .filter((l) => l.stage !== 'fechado')
    .reduce((acc, l) => acc + l.value, 0);

  const totalFechado = leads
    .filter((l) => l.stage === 'fechado')
    .reduce((acc, l) => acc + l.value, 0);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-semibold uppercase">
            <TrendingUp className="w-4 h-4" />
            <span>FUNIL DE VENDAS & PROSPECÇÃO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Pipeline Comercial
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhe contatos, propostas enviadas e receitas geradas por abordagens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Em Pipeline</span>
            <span className="text-sm font-bold font-mono text-amber-400">
              R$ {totalEmNegociacao.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-400 font-mono block">Fechado</span>
            <span className="text-sm font-bold font-mono text-emerald-300">
              R$ {totalFechado.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Add Deal Bar */}
      <form
        onSubmit={handleAddDeal}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nome do cliente ou empresa..."
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Produto / Serviço"
          className="w-full sm:w-40 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
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
          <span>Novo Lead</span>
        </button>
      </form>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="p-3.5 rounded-3xl ios-glass-card border border-white/10 space-y-3 min-h-[350px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className={`text-xs font-bold font-mono uppercase ${stage.color}`}>
                  {stage.label}
                </span>
                <span className="text-xs font-mono text-slate-400">{stageLeads.length}</span>
              </div>

              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{lead.clientName}</h4>
                      <span className="text-[10px] text-slate-400 block">{lead.product}</span>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-emerald-400">
                      R$ {lead.value.toLocaleString('pt-BR')}
                    </div>

                    {lead.stage !== 'fechado' && (
                      <button
                        onClick={() => handleAdvanceStage(lead.id, lead.stage)}
                        className="w-full pt-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-between"
                      >
                        <span>Avançar Etapa</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
