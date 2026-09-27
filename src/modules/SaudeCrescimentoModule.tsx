/**
 * LIFE OS — Saúde, Crescimento & Sono Module
 * Natural growth tracking (height & weight progression without extreme diets) + Sleep quality tracker.
 */

import React, { useState } from 'react';
import {
  Activity,
  Moon,
  Ruler,
  TrendingUp,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { SleepRecord } from '../types';

export const SaudeCrescimentoModule: React.FC = () => {
  const profile = StorageService.getProfile();
  const sleepRecords = StorageService.getSleepRecords();

  // Growth form
  const [newHeight, setNewHeight] = useState(profile.heightCm ? String(profile.heightCm) : '178');
  const [newWeight, setNewWeight] = useState(profile.weightKg ? String(profile.weightKg) : '68.5');
  const [growthNote, setGrowthNote] = useState(profile.growthNotes || '');

  // Sleep form
  const [sleepTime, setSleepTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [sleepQuality, setSleepQuality] = useState<SleepRecord['quality']>('excelente');
  const [sleepNotes, setSleepNotes] = useState('');

  const handleUpdateGrowth = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateProfileGrowth(
      parseFloat(newHeight) || undefined,
      parseFloat(newWeight) || undefined,
      growthNote
    );
    alert('Dados de crescimento atualizados com sucesso!');
  };

  const handleAddSleep = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate approximate duration
    const [sH, sM] = sleepTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let diffHours = wH - sH + (wM - sM) / 60;
    if (diffHours < 0) diffHours += 24;

    StorageService.addSleepRecord({
      date: new Date().toISOString().split('T')[0],
      sleepTime,
      wakeTime,
      durationHours: Math.round(diffHours * 10) / 10,
      quality: sleepQuality,
      notes: sleepNotes,
    });

    setSleepNotes('');
  };

  const qualityIcons = {
    ruim: '😴 Ruim',
    regular: '😐 Regular',
    bom: '😊 Bom',
    excelente: '⚡ Excelente',
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold uppercase">
            <Activity className="w-4 h-4" />
            <span>SAÚDE INTEGRAL & RECUPERAÇÃO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Crescimento & Sono
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhamento saudável de evolução física e descanso restaurador sem cobranças extremas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Crescimento & Desenvolvimento */}
        <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Ruler className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Registro de Crescimento</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Altura Atual</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-300 mt-1 block">
                {profile.heightCm || 178} cm
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">1,78m</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Peso Atual</span>
              <span className="text-2xl font-extrabold font-mono text-sky-300 mt-1 block">
                {profile.weightKg || 68.5} kg
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Desenvolvimento natural</span>
            </div>
          </div>

          {/* Evolution over months */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-300 block">Histórico de Medições:</span>
            <div className="space-y-1.5 text-xs font-mono">
              {(profile.heightHistory || []).map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]"
                >
                  <span className="text-slate-400">{h.date}</span>
                  <span className="text-emerald-400 font-bold">{h.heightCm} cm</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleUpdateGrowth} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={newHeight}
                onChange={(e) => setNewHeight(e.target.value)}
                placeholder="Altura (cm)"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Peso (kg)"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
            <input
              type="text"
              value={growthNote}
              onChange={(e) => setGrowthNote(e.target.value)}
              placeholder="Observações de evolução física..."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold"
            >
              Salvar Medição
            </button>
          </form>
        </div>

        {/* 2. Diário de Sono */}
        <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Moon className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Qualidade de Sono</h3>
          </div>

          {/* Last Night Quick Highlight */}
          {sleepRecords[0] && (
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-300">🌙 Última Noite</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200">
                  {qualityIcons[sleepRecords[0].quality]}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                Dormiu {sleepRecords[0].sleepTime} → Acordou {sleepRecords[0].wakeTime}
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {sleepRecords[0].durationHours} horas de descanso
              </span>
            </div>
          )}

          {/* New Sleep Entry */}
          <form onSubmit={handleAddSleep} className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-300 block">Registrar Sono:</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block font-mono mb-1">Dormiu às:</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono mb-1">Acordou às:</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block font-mono mb-1">Qualidade Percebida:</label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="excelente">⚡ Excelente (acordou com energia total)</option>
                <option value="bom">😊 Bom (bem descansado)</option>
                <option value="regular">😐 Regular</option>
                <option value="ruim">😴 Ruim (interrompido)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold"
            >
              Registrar Noite de Sono
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
