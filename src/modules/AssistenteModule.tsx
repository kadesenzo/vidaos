/**
 * LIFE OS — Assistente Pessoal Digital
 * Interface de Linguagem Natural: Transforma frases corridas em ações reais nos módulos
 * e integra notificações reais do sistema operacional.
 */

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Bell,
  CheckCircle2,
  Dumbbell,
  GraduationCap,
  ArrowDownLeft,
  Coffee,
  CheckSquare,
  FolderKanban,
  Volume2,
  Flame,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionParserService, ParseResult } from '../services/actionParserService';
import { NotificationService } from '../services/notificationService';
import { StorageService } from '../services/storageService';

export const AssistenteModule: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [lastResult, setLastResult] = useState<ParseResult | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    NotificationService.getPermission()
  );
  const profile = StorageService.getProfile();

  const handleRequestPermission = async () => {
    const perm = await NotificationService.requestPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      NotificationService.sendRealNotification('🔔 Notificações do Life OS Ativadas!', {
        body: 'Você agora receberá alertas reais do sistema para treinos, estudos e lembretes.',
      });
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    }
  };

  const handleSendTestNotification = () => {
    NotificationService.sendRealNotification('🥋 Seu Treino de Jiu-Jitsu Começa em 15m', {
      body: 'Treino das 19:00 programado na academia. Hidratação e kimono prontos!',
      targetModule: 'treinos',
    });
  };

  const handleExecuteInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const result = ActionParserService.parseAndExecute(inputText);
    setLastResult(result);
    setInputText('');

    if (result.actions.length > 0) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }
  };

  const sampleCommands = [
    'Hoje fiz jiu-jitsu por 1h30, depois estudei matemática e gastei R$20 no almoço.',
    'Gastei 35 reais no almoço.',
    'Comi arroz, feijão, frango e salada.',
    'Amanhã tenho prova de matemática.',
    'Terminei a página inicial do KVB.',
    'Hoje treinei musculação por 50 minutos.',
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase">
            <Bot className="w-4 h-4" />
            <span>INTERFACE DE AÇÃO & LINGUAGEM NATURAL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Assistente do Life OS
          </h1>
          <p className="text-xs text-slate-300">
            Escreva o que aconteceu ou o que precisa fazer. O sistema interpreta e separa tudo automaticamente.
          </p>
        </div>

        {/* Real Device Notifications Status Card */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 bg-black/40 border border-white/10 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Bell
              className={`w-4 h-4 ${
                notificationPermission === 'granted' ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Notificações do SO</span>
              <span
                className={`text-xs font-bold font-mono ${
                  notificationPermission === 'granted' ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {notificationPermission === 'granted' ? 'Ativadas no Dispositivo' : 'Permissão Pendente'}
              </span>
            </div>
          </div>

          {notificationPermission !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
            >
              Ativar Alertas Reais
            </button>
          ) : (
            <button
              onClick={handleSendTestNotification}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Testar Alarme</span>
            </button>
          )}
        </div>
      </div>

      {/* Natural Language Command Bar */}
      <div className="p-6 rounded-3xl ios-glass-card border border-indigo-500/30 space-y-4 shadow-xl">
        <label className="block text-xs font-bold font-mono uppercase text-indigo-300">
          O que você fez ou precisa fazer hoje?
        </label>

        <form onSubmit={handleExecuteInput} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: Hoje fiz jiu-jitsu por 1h30, depois estudei matemática e gastei R$20..."
            className="flex-1 w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 font-medium"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Executar Ação</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Clickable Quick Examples */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] text-slate-400 font-medium block">
            Ou experimente comandos reais com 1 clique:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleCommands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => {
                  setInputText(cmd);
                }}
                className="text-[11px] text-left px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Parse Result & Action Breakdown */}
      {lastResult && (
        <div className="p-6 rounded-3xl ios-glass-card border border-emerald-500/40 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Processamento Concluído</span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            {lastResult.feedbackMessage}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {lastResult.actions.map((act, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${act.color}`}>{act.title}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                    {act.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{act.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capability Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-2">
          <Dumbbell className="w-5 h-5 text-rose-400" />
          <h4 className="text-xs font-bold text-white">Treinos & Atividade</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Diga quanto tempo treinou ou qual esporte praticou para registrar na sua constância.
          </p>
        </div>

        <div className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-2">
          <ArrowDownLeft className="w-5 h-5 text-amber-400" />
          <h4 className="text-xs font-bold text-white">Finanças Instantâneas</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            "Gastei X" ou "Recebi Y" alimenta o saldo e categorias sem preencher telas burocráticas.
          </p>
        </div>

        <div className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-2">
          <FolderKanban className="w-5 h-5 text-violet-400" />
          <h4 className="text-xs font-bold text-white">Avanço de Projetos</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Atualize o KVB System ou KAEN Motors apenas relatando o que finalizou no dia.
          </p>
        </div>
      </div>
    </div>
  );
};
