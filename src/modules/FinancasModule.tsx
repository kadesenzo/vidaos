/**
 * LIFE OS — Financeiro Module
 * Personal financial dashboard: Saldo, Entradas, Saídas, A Receber, Transações e Metas.
 */

import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Plus,
  TrendingUp,
  Tag,
  Calendar,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { FinanceRecord, FinanceType } from '../types';

export const FinancasModule: React.FC = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<FinanceType>('saida');
  const [category, setCategory] = useState('Geral');

  const records = StorageService.getFinances();

  const totalEntradas = records
    .filter((r) => r.type === 'entrada')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalSaidas = records
    .filter((r) => r.type === 'saida')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalAReceber = records
    .filter((r) => r.type === 'a_receber')
    .reduce((acc, r) => acc + r.amount, 0);

  const saldoLiquido = totalEntradas - totalSaidas;

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(val)) return;

    StorageService.addFinanceRecord({
      description,
      amount: val,
      type,
      category: category || 'Geral',
      date: new Date().toISOString().split('T')[0],
    });

    setDescription('');
    setAmount('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase">
            <Wallet className="w-4 h-4" />
            <span>FINANCEIRO PESSOAL & FLUXO DE CAIXA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Controle Financeiro
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhe receitas, custos com estudos, equipamentos e valores previstos.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Saldo Líquido */}
        <div className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-mono uppercase block">Saldo Atual</span>
          <span
            className={`text-2xl md:text-3xl font-extrabold font-mono tracking-tight block ${
              saldoLiquido >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-500 block">Disponibilidade líquida</span>
        </div>

        {/* Entradas */}
        <div className="p-5 rounded-3xl ios-glass-card border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-mono uppercase block">Entradas</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white block">
            R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-400/80 block">Serviços e vendas</span>
        </div>

        {/* Saídas */}
        <div className="p-5 rounded-3xl ios-glass-card border border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-400 font-mono uppercase block">Saídas</span>
            <ArrowDownLeft className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-rose-300 block">
            R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-rose-400/80 block">Cursos e equipamentos</span>
        </div>

        {/* A Receber */}
        <div className="p-5 rounded-3xl ios-glass-card border border-sky-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-400 font-mono uppercase block">A Receber</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-sky-300 block">
            R$ {totalAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-sky-400/80 block">Contratos futuros</span>
        </div>
      </div>

      {/* Quick Add Form */}
      <form
        onSubmit={handleAddRecord}
        className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-3"
      >
        <span className="text-xs font-bold text-white uppercase font-mono block">
          + Lançamento Rápido
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (ex: Consultoria ou Livro...)"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Valor (R$)"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FinanceType)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="saida">🔴 Saída / Despesa</option>
            <option value="entrada">🟢 Entrada / Receita</option>
            <option value="a_receber">🔵 A Receber (Previsto)</option>
          </select>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold shadow-md"
          >
            Salvar Lançamento
          </button>
        </div>
      </form>

      {/* Recent Transactions List */}
      <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight">Histórico de Transações</h3>

        <div className="space-y-2">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    rec.type === 'entrada'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : rec.type === 'saida'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-sky-500/20 text-sky-400'
                  }`}
                >
                  {rec.type === 'entrada' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : rec.type === 'saida' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{rec.description}</h4>
                  <span className="text-[10px] text-slate-400">
                    {rec.category} • {rec.date}
                  </span>
                </div>
              </div>

              <span
                className={`text-sm font-bold font-mono ${
                  rec.type === 'entrada'
                    ? 'text-emerald-400'
                    : rec.type === 'saida'
                    ? 'text-rose-400'
                    : 'text-sky-400'
                }`}
              >
                {rec.type === 'saida' ? '- ' : '+ '}
                R$ {rec.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
