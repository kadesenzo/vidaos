/**
 * LIFE OS — Global Quick Capture Modal (+ REGISTRAR)
 * Supports natural language multi-action commands OR granular manual logging.
 */

import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Sparkles,
  GraduationCap,
  Flame,
  DollarSign,
  Dumbbell,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  Moon,
  Image as ImageIcon,
  FolderKanban,
  Send,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import { ActionParserService, ParseResult } from '../services/actionParserService';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudyTimer?: () => void;
}

type CaptureTab = 'nlp' | 'class' | 'task' | 'workout' | 'meal' | 'expense' | 'income' | 'note';

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onOpenStudyTimer,
}) => {
  const [activeTab, setActiveTab] = useState<CaptureTab>('nlp');
  const [nlpInput, setNlpInput] = useState('');
  const [nlpResult, setNlpResult] = useState<ParseResult | null>(null);

  // Manual form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  if (!isOpen) return null;

  const handleNlpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpInput.trim()) return;

    const res = ActionParserService.parseAndExecute(nlpInput);
    setNlpResult(res);
    setNlpInput('');
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    setTimeout(() => {
      onClose();
      setNlpResult(null);
    }, 1800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && activeTab !== 'workout') return;

    if (activeTab === 'class') {
      StorageService.saveLearnedClass({
        id: `class_${Date.now()}`,
        title,
        subjectId: 'sub_mat',
        subjectName: category || 'Matemática',
        source: 'YouTube',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 45,
        whatILearned: content || title,
        keyConcepts: [],
        status: 'concluida',
        createdAt: new Date().toISOString(),
      });
    } else if (activeTab === 'task') {
      StorageService.addTask({
        title,
        description: content,
        priority: 'media',
        category: category || 'Geral',
        date: new Date().toISOString().split('T')[0],
        status: 'a_fazer',
      });
    } else if (activeTab === 'workout') {
      StorageService.addWorkout({
        activity: title || 'Jiu-Jitsu',
        icon: 'Dumbbell',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 60,
        intensity: 'intensa',
        notes: content,
      });
    } else if (activeTab === 'meal') {
      StorageService.addMeal({
        mealType: 'almoco',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        foods: title,
        waterMl: 500,
      });
    } else if (activeTab === 'expense' || activeTab === 'income') {
      const val = parseFloat(amount.replace(',', '.')) || 0;
      StorageService.addFinanceRecord({
        description: title,
        amount: val,
        type: activeTab === 'income' ? 'entrada' : 'saida',
        category: category || (activeTab === 'income' ? 'Serviços' : 'Geral'),
        date: new Date().toISOString().split('T')[0],
      });
    } else if (activeTab === 'note') {
      StorageService.addMemoryNote({
        title,
        content,
        category: 'ideia',
        tags: ['rapida'],
        pinned: false,
      });
    }

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    setTitle('');
    setContent('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="ios-glass-sheet rounded-3xl w-full max-w-lg p-6 border border-white/20 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">+ REGISTRAR</h2>
              <p className="text-xs text-slate-400">Escreva tudo numa frase ou escolha a categoria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-4 p-1 rounded-2xl bg-black/40 border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('nlp')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'nlp'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ Assistente
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('class')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'class' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Aula
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'task' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✅ Tarefa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workout')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'workout' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🥋 Treino
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meal')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'meal' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🍽️ Comida
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expense')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'expense' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            💰 Gasto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'income' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            💵 Entrada
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('note')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === 'note' ? 'bg-yellow-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            💡 Ideia
          </button>
        </div>

        {/* NLP Mode */}
        {activeTab === 'nlp' ? (
          <form onSubmit={handleNlpSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Escreva naturalmente o que aconteceu:
              </label>
              <textarea
                rows={3}
                autoFocus
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                placeholder='Ex: "Hoje fiz jiu-jitsu por 1h30, depois estudei matemática e gastei R$20 no almoço"'
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
              />
              <span className="text-[10px] text-slate-400 block">
                O assistente analisa e distribui as ações nos módulos correspondentes de forma automática.
              </span>
            </div>

            {nlpResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                ✓ {nlpResult.feedbackMessage}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!nlpInput.trim()}
                className="px-6 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold disabled:opacity-50"
              >
                Processar e Registrar
              </button>
            </div>
          </form>
        ) : (
          /* Manual Form */
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {activeTab === 'class' && 'Título da aula ou tema estudado (ex: YouTube, Curso ou Escola):'}
                {activeTab === 'task' && 'O que você precisa fazer?'}
                {activeTab === 'workout' && 'Qual atividade você realizou?'}
                {activeTab === 'meal' && 'Quais alimentos você consumiu?'}
                {(activeTab === 'expense' || activeTab === 'income') && 'Descrição da transação:'}
                {activeTab === 'note' && 'Título da ideia ou anotação:'}
              </label>
              <input
                type="text"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Treino de Jiu-Jitsu, Almoço de R$35, etc."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {(activeTab === 'expense' || activeTab === 'income') && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valor (R$):</label>
                  <input
                    type="text"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="35,00"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria:</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Alimentação, Cursos..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {activeTab === 'class' ? 'O que você aprendeu nesta aula:' : 'Observações (opcional):'}
              </label>
              <textarea
                rows={activeTab === 'class' ? 3 : 2}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={activeTab === 'class' ? 'Resuma os principais aprendizados, raciocínios e fórmulas...' : 'Detalhes ou passos adicionais...'}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold"
              >
                Salvar Registro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
