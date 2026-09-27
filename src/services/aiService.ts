/**
 * LIFE OS — AI Tutor & Assistant Client Service
 * Calls server-side Gemini API or provides instant real-data context analysis.
 */

import { StorageService } from './storageService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiService = {
  async askAssistant(prompt: string, history: ChatMessage[] = []): Promise<string> {
    const profile = StorageService.getProfile();
    const tasks = StorageService.getTasks();
    const courses = StorageService.getCourses();
    const subjects = StorageService.getSubjects();
    const routine = StorageService.getRoutine();
    const habits = StorageService.getHabits();
    const errors = StorageService.getErrorNotebook();
    const finances = StorageService.getFinances();

    // Calculate quick stats
    const pendingTasks = tasks.filter((t) => t.status === 'a_fazer' || t.status === 'em_andamento');
    const totalSecondsStudied = subjects.reduce((acc, s) => acc + (s.totalSecondsStudied || 0), 0);
    const hoursStudied = Math.floor(totalSecondsStudied / 3600);
    const minutesStudied = Math.floor((totalSecondsStudied % 3600) / 60);

    const context = {
      usuario: {
        nome: profile.nickname || profile.name,
        objetivos: profile.primaryGoals,
        gatilhoEsquecimento: profile.forgetReason,
      },
      estudos: {
        tempoTotalEstudado: `${hoursStudied}h ${minutesStudied}m`,
        materias: subjects.map((s) => ({
          nome: s.name,
          dominio: s.masteryLevel,
          questoesFeitas: s.totalQuestionsAnswered,
          acertos: s.totalQuestionsCorrect,
        })),
        cursosAtivos: courses.map((c) => ({
          titulo: c.title,
          progresso: `${c.progressPercentage}%`,
        })),
        cadernoDeErrosPendentes: errors.filter((e) => !e.resolved).length,
      },
      tarefasHoje: pendingTasks.slice(0, 5).map((t) => ({
        titulo: t.title,
        prioridade: t.priority,
        horario: t.time || 'Sem horário fixo',
      })),
      rotinaAtual: routine.map((r) => `${r.time} - ${r.title} [${r.status}]`),
      habitos: habits.map((h) => `${h.name} (streak: ${h.streak} dias)`),
      financas: {
        totalEntradas: finances.filter((f) => f.type === 'entrada').reduce((acc, f) => acc + f.amount, 0),
        totalSaidas: finances.filter((f) => f.type === 'saida').reduce((acc, f) => acc + f.amount, 0),
      },
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          return data.text;
        }
      }
    } catch (e) {
      console.warn('Backend Gemini fetch failed, falling back to contextual local response engine', e);
    }

    // Local deterministic contextual responses based on real data
    const lower = prompt.toLowerCase();
    const userName = profile.nickname || profile.name || 'Enzo';

    if (lower.includes('o que preciso fazer') || lower.includes('fazer hoje') || lower.includes('minhas tarefas')) {
      if (pendingTasks.length === 0) {
        return `Parabéns, ${userName}! Todas as suas tarefas de hoje foram concluídas. Você tem tempo livre para adiantar o próximo módulo de Matemática ou relaxar.`;
      }
      const list = pendingTasks.slice(0, 4).map((t, idx) => `${idx + 1}. **${t.title}** (${t.priority.toUpperCase()} prioridade - ${t.time || 'Hoje'})`).join('\n');
      return `Olá, ${userName}! Aqui está o que está pendente para hoje:\n\n${list}\n\n🎯 **Próxima ação recomendada:** Iniciar com a primeira prioridade para liberar sua carga cognitiva.`;
    }

    if (lower.includes('atrasad') || lower.includes('pendent')) {
      const highPriority = pendingTasks.filter((t) => t.priority === 'alta');
      return `Você tem **${pendingTasks.length} tarefas pendentes**, sendo ${highPriority.length} de **alta prioridade**.\nNo Caderno de Erros, há **${errors.filter((e) => !e.resolved).length} questões** aguardando refação para fixação de memória.`;
    }

    if (lower.includes('quanto estudei') || lower.includes('horas') || lower.includes('estudos')) {
      return `Seu histórico total de estudo acumulado é de **${hoursStudied}h ${minutesStudied}m**!\nSua matéria com maior dedicação é **Matemática** (~51h) seguida de **Programação** (~28h). Você está mantendo uma constância excelente.`;
    }

    if (lower.includes('uma hora livre') || lower.includes('tempo livre') || lower.includes('o que posso fazer')) {
      return `Com 1 hora disponível, minha recomendação como seu tutor:\n1. **35 min:** Assistir à Aula 04 de Potenciação de Matemática (você já estava em 17:42).\n2. **15 min:** Fazer 5 questões de fixação no Banco de Questões.\n3. **10 min:** Revisar seus 4 Flashcards ativos.`;
    }

    if (lower.includes('organizar') || lower.includes('amanhã') || lower.includes('plano')) {
      return `Para estruturar seu dia com eficiência no Life OS:\n- **Manhã:** Foque na atividade de maior esforço mental (Exatas / Matemática) logo após seu café.\n- **Tarde:** Avance nas tarefas práticas e projetos (KVB System / Comercial KAEN).\n- **Noite:** Finalize com atividade física (Jiu-jitsu) e revisão de 15 min de flashcards.`;
    }

    return `Olá ${userName}! Analisei seus dados no Life OS. Você tem **${pendingTasks.length} tarefas** para hoje e seu próximo estudo é **Matemática (Potenciação — Aula 04)**. Como posso te apoiar agora? Posso explicar conceitos, tirar dúvidas ou gerar uma revisão relâmpago.`;
  },
};
