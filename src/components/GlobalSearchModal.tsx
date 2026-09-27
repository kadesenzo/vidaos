/**
 * LIFE OS — Global Search Modal (⌘K Omnisearch)
 * Instantaneous fuzzy lookup across all personal operating system records.
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  CheckSquare,
  GraduationCap,
  Sparkles,
  FolderKanban,
  Target,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { ModuleId } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (module: ModuleId, contextId?: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'tarefa' | 'estudo' | 'questao' | 'nota' | 'projeto' | 'meta';
  targetModule: ModuleId;
  badge: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToModule,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open handled outside
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const hits: SearchResult[] = [];

    // Search Tasks
    const tasks = StorageService.getTasks();
    tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) {
        hits.push({
          id: t.id,
          title: t.title,
          subtitle: `Status: ${t.status.replace('_', ' ')} • Prioridade: ${t.priority}`,
          type: 'tarefa',
          targetModule: 'tarefas',
          badge: 'Tarefa',
        });
      }
    });

    // Search Courses & Lessons
    const courses = StorageService.getCourses();
    courses.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
        hits.push({
          id: c.id,
          title: c.title,
          subtitle: `Curso • ${c.instructor} (${c.progressPercentage}% concluído)`,
          type: 'estudo',
          targetModule: 'estudos',
          badge: 'Curso',
        });
      }
      c.modules.forEach((m) => {
        m.lessons.forEach((l) => {
          if (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) {
            hits.push({
              id: l.id,
              title: l.title,
              subtitle: `${c.title} • ${l.durationMinutes} min`,
              type: 'estudo',
              targetModule: 'estudos',
              badge: 'Aula',
            });
          }
        });
      });
    });

    // Search Learned Classes & Notes
    const learnedClasses = StorageService.getLearnedClasses();
    learnedClasses.forEach((lc) => {
      if (
        lc.title.toLowerCase().includes(q) ||
        lc.whatILearned.toLowerCase().includes(q) ||
        lc.subjectName.toLowerCase().includes(q) ||
        lc.keyConcepts.some((k) => k.toLowerCase().includes(q))
      ) {
        hits.push({
          id: lc.id,
          title: lc.title,
          subtitle: `${lc.subjectName} • ${lc.source} • Aprendizado: ${lc.whatILearned.slice(0, 60)}...`,
          type: 'estudo',
          targetModule: 'estudos',
          badge: 'Aula Registrada',
        });
      }
    });

    // Search Questions
    const questions = StorageService.getQuestions();
    questions.forEach((qu) => {
      if (qu.prompt.toLowerCase().includes(q) || qu.topic.toLowerCase().includes(q)) {
        hits.push({
          id: qu.id,
          title: qu.topic,
          subtitle: qu.prompt.slice(0, 90) + '...',
          type: 'questao',
          targetModule: 'estudos',
          badge: 'Questão',
        });
      }
    });

    // Search Notes
    const notes = StorageService.getMemoryNotes();
    notes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        hits.push({
          id: n.id,
          title: n.title,
          subtitle: n.content.slice(0, 80) + '...',
          type: 'nota',
          targetModule: 'memoria',
          badge: 'Memória',
        });
      }
    });

    // Search Projects
    const projects = StorageService.getProjects();
    projects.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.objective.toLowerCase().includes(q)) {
        hits.push({
          id: p.id,
          title: p.name,
          subtitle: `${p.objective} (${p.progress}% concluído)`,
          type: 'projeto',
          targetModule: 'projetos',
          badge: 'Projeto',
        });
      }
    });

    // Search Goals
    const goals = StorageService.getGoals();
    goals.forEach((g) => {
      if (g.title.toLowerCase().includes(q)) {
        hits.push({
          id: g.id,
          title: g.title,
          subtitle: `Meta: ${g.currentValue}/${g.targetValue} ${g.unit}`,
          type: 'meta',
          targetModule: 'metas',
          badge: 'Meta',
        });
      }
    });

    setResults(hits.slice(0, 10));
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResult) => {
    onNavigateToModule(item.targetModule, item.id);
    onClose();
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'tarefa':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'estudo':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      case 'questao':
        return <HelpCircle className="w-4 h-4 text-sky-400" />;
      case 'nota':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'projeto':
        return <FolderKanban className="w-4 h-4 text-violet-400" />;
      case 'meta':
        return <Target className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 p-4 animate-in fade-in duration-200">
      <div className="ios-glass-sheet rounded-3xl w-full max-w-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar em tarefas, aulas, questões, notas, projetos..."
            className="flex-1 bg-transparent text-white text-base placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Limpar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Digite termos como <span className="text-slate-300">"potenciação"</span>,{' '}
              <span className="text-slate-300">"KAEN"</span>,{' '}
              <span className="text-slate-300">"exercícios"</span> ou{' '}
              <span className="text-slate-300">"meta"</span>.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhum resultado encontrado para "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={`${item.type}_${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 text-left transition-colors group border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5">{getIcon(item.type)}</div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate max-w-md">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {item.badge}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Keyboard Shortcut Hints Footer */}
        <div className="px-5 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Navegue para o módulo correspondente com 1 clique
          </span>
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-white/10">ESC</kbd> fechar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
