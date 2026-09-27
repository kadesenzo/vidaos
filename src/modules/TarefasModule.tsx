/**
 * LIFE OS — Tarefas Module
 * Complete task manager with status filters, Kanban / List view toggle, priorities, and project tags.
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Columns,
  List,
  CheckCircle2,
  Clock,
  Trash2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storageService';
import { Task, TaskPriority, TaskStatus } from '../types';

export const TarefasModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterPriority, setFilterPriority] = useState<string>('todas');
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [search, setSearch] = useState('');

  // Quick Add State
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('media');
  const [newCategory, setNewCategory] = useState('Geral');
  const [newEstimatedMinutes, setNewEstimatedMinutes] = useState(30);

  const tasks = StorageService.getTasks().filter((t) => !t.deletedAt);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    StorageService.addTask({
      title: newTitle,
      priority: newPriority,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      estimatedMinutes: Number(newEstimatedMinutes) || 30,
      status: 'a_fazer',
    });

    setNewTitle('');
  };

  const handleToggleComplete = (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus = currentStatus === 'concluida' ? 'a_fazer' : 'concluida';
    StorageService.updateTaskStatus(taskId, nextStatus);
    if (nextStatus === 'concluida') {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'todas' && t.priority !== filterPriority) return false;
    if (filterCategory !== 'todas' && t.category !== filterCategory) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'a_fazer', label: 'A Fazer', color: 'border-slate-500' },
    { id: 'em_andamento', label: 'Em Andamento', color: 'border-indigo-500' },
    { id: 'concluida', label: 'Concluídas', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase">
            <CheckSquare className="w-4 h-4" />
            <span>GERENCIADOR DE TAREFAS & PRIORIDADES</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Tarefas Pessoais
          </h1>
          <p className="text-xs text-slate-400">
            Organize afazeres por prioridade, categoria e status com clareza mental.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleAddTask}
        className="p-4 rounded-3xl ios-glass-card border border-white/10 flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Adicionar nova tarefa rápida..."
          className="flex-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
          className="px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
        >
          <option value="alta">🔴 Alta</option>
          <option value="media">🟡 Média</option>
          <option value="baixa">🟢 Baixa</option>
        </select>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Categoria"
          className="w-full sm:w-28 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar</span>
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar por texto..."
          className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none"
        />
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Prioridade:</span>
          {(['todas', 'alta', 'media', 'baixa'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded-lg capitalize ${
                filterPriority === p ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs ios-glass-card rounded-3xl">
              Nenhuma tarefa encontrada com estes filtros.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-2xl ios-glass-card border transition-all ${
                  task.status === 'concluida'
                    ? 'border-emerald-500/20 opacity-60'
                    : task.priority === 'alta'
                    ? 'border-rose-500/30'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <button
                    onClick={() => handleToggleComplete(task.id, task.status)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      task.status === 'concluida'
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'border-white/20 hover:border-indigo-400'
                    }`}
                  >
                    {task.status === 'concluida' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="truncate">
                    <span
                      className={`text-sm font-semibold text-white block truncate ${
                        task.status === 'concluida' ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-mono text-indigo-300">{task.category}</span>
                      {task.time && <span>• {task.time}</span>}
                      {task.estimatedMinutes && (
                        <span>• ~{task.estimatedMinutes} min</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      task.priority === 'alta'
                        ? 'bg-rose-500/20 text-rose-300'
                        : task.priority === 'media'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                  <button
                    onClick={() => StorageService.deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    title="Excluir tarefa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="p-4 rounded-3xl ios-glass-card border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white font-mono uppercase">
                    {col.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{colTasks.length}</span>
                </div>

                <div className="space-y-2.5 min-h-[300px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-white leading-snug">
                          {task.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            task.priority === 'alta'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>{task.category}</span>
                        <div className="flex items-center gap-1">
                          {col.id !== 'concluida' ? (
                            <button
                              onClick={() => handleToggleComplete(task.id, task.status)}
                              className="text-emerald-400 hover:text-emerald-300"
                            >
                              ✓ Concluir
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleComplete(task.id, task.status)}
                              className="text-slate-400 hover:text-white"
                            >
                              Reabrir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
