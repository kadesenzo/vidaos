/**
 * LIFE OS — Natural Language Action Parser & Life Assistant Engine
 * Automatically interprets phrases like:
 * "Hoje fiz jiu-jitsu por 1h30, depois estudei matemática e gastei R$20 no almoço"
 * and routes them to Workouts, Studies, Finances, Meals, Tasks, and Projects.
 */

import { StorageService } from './storageService';
import { NotificationService } from './notificationService';

export interface ParsedActionItem {
  type: 'treino' | 'gasto' | 'entrada' | 'alimentacao' | 'estudo' | 'tarefa' | 'projeto' | 'sono' | 'crescimento' | 'consulta';
  title: string;
  details: string;
  icon: string;
  color: string;
}

export interface ParseResult {
  rawText: string;
  actions: ParsedActionItem[];
  feedbackMessage: string;
}

export const ActionParserService = {
  parseAndExecute(input: string): ParseResult {
    const raw = input.trim();
    if (!raw) {
      return {
        rawText: input,
        actions: [],
        feedbackMessage: 'Por favor, digite uma ação ou acontecimento da sua rotina.',
      };
    }

    const lower = raw.toLowerCase();
    const actions: ParsedActionItem[] = [];

    // Helper: extract monetary value
    const matchMoney = lower.match(/(?:r\$\s*|gastei\s*|recebi\s*|ganhei\s*|por\s*)(\d+(?:[.,]\d{1,2})?)\s*(?:reais|r\$)?/i);
    const moneyAmount = matchMoney ? parseFloat(matchMoney[1].replace(',', '.')) : null;

    // Helper: extract duration
    let durationMins = 60;
    if (lower.includes('1h30') || lower.includes('1h 30') || lower.includes('1 hora e meia') || lower.includes('90 min')) {
      durationMins = 90;
    } else if (lower.includes('2h') || lower.includes('2 horas')) {
      durationMins = 120;
    } else if (lower.includes('45 min') || lower.includes('45min')) {
      durationMins = 45;
    } else if (lower.includes('30 min') || lower.includes('30min')) {
      durationMins = 30;
    } else if (lower.includes('1h') || lower.includes('1 hora') || lower.includes('60 min')) {
      durationMins = 60;
    }

    // 1. Detect Workout / Treino
    if (
      lower.includes('trein') ||
      lower.includes('jiu-jitsu') ||
      lower.includes('jiu jitsu') ||
      lower.includes('muscula') ||
      lower.includes('corrida') ||
      lower.includes('corri ') ||
      lower.includes('bike') ||
      lower.includes('bicicleta') ||
      lower.includes('academia')
    ) {
      let activityName = 'Treino Físico';
      if (lower.includes('jiu-jitsu') || lower.includes('jiu jitsu')) activityName = 'Jiu-Jitsu';
      else if (lower.includes('muscula') || lower.includes('academia')) activityName = 'Musculação';
      else if (lower.includes('corrida') || lower.includes('corri')) activityName = 'Corrida';
      else if (lower.includes('bike') || lower.includes('bicicleta')) activityName = 'Ciclismo';

      StorageService.addWorkout({
        activity: activityName,
        icon: 'Dumbbell',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: durationMins,
        intensity: 'intensa',
        notes: `Registrado via assistente: "${raw}"`,
      });

      actions.push({
        type: 'treino',
        title: `Treino de ${activityName}`,
        details: `${durationMins} minutos registrados no histórico`,
        icon: 'Dumbbell',
        color: 'text-rose-400',
      });
    }

    // 2. Detect Study Session
    if (
      lower.includes('estudei') ||
      lower.includes('aula de') ||
      lower.includes('fiz quest') ||
      lower.includes('resolvi quest') ||
      lower.includes('revis')
    ) {
      let subjectName = 'Geral';
      let subjectId = 'sub_mat';
      if (lower.includes('matemática') || lower.includes('matematica')) {
        subjectName = 'Matemática';
        subjectId = 'sub_mat';
      } else if (lower.includes('história') || lower.includes('historia')) {
        subjectName = 'História';
        subjectId = 'sub_hist';
      } else if (lower.includes('português') || lower.includes('portugues')) {
        subjectName = 'Português';
        subjectId = 'sub_port';
      } else if (lower.includes('program') || lower.includes('código') || lower.includes('codar')) {
        subjectName = 'Programação & IA';
        subjectId = 'sub_prog';
      }

      StorageService.addStudySession({
        subjectId,
        subjectName,
        topic: 'Sessão Registrada via Assistente',
        startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        durationSeconds: 45 * 60,
        sessionType: lower.includes('quest') ? 'exercicios' : 'aula',
      });

      StorageService.saveLearnedClass({
        id: `class_${Date.now()}`,
        title: `Estudo de ${subjectName}`,
        subjectId,
        subjectName,
        source: lower.includes('youtube') ? 'YouTube' : lower.includes('curso') ? 'Curso Online' : 'YouTube',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 45,
        whatILearned: `Anotação rápida registrada via assistente: "${raw}"`,
        keyConcepts: [subjectName],
        status: 'concluida',
        createdAt: new Date().toISOString(),
      });

      actions.push({
        type: 'estudo',
        title: `Aula de ${subjectName}`,
        details: 'Adicionada ao Caderno de Aulas & Estatísticas (45m)',
        icon: 'GraduationCap',
        color: 'text-indigo-400',
      });
    }

    // 3. Detect Expense (Gasto)
    if (
      (lower.includes('gastei') || lower.includes('paguei') || lower.includes('comprei')) &&
      moneyAmount !== null
    ) {
      let cat = 'Geral';
      if (lower.includes('almoço') || lower.includes('comida') || lower.includes('lanche') || lower.includes('jantar')) {
        cat = 'Alimentação';
      } else if (lower.includes('livro') || lower.includes('curso') || lower.includes('material')) {
        cat = 'Cursos & Livros';
      } else if (lower.includes('transporte') || lower.includes('uber')) {
        cat = 'Transporte';
      }

      StorageService.addFinanceRecord({
        description: `Gasto via Assistente (${cat})`,
        amount: moneyAmount,
        type: 'saida',
        category: cat,
        date: new Date().toISOString().split('T')[0],
      });

      actions.push({
        type: 'gasto',
        title: `Gasto de R$ ${moneyAmount.toFixed(2)}`,
        details: `Categoria: ${cat}`,
        icon: 'ArrowDownLeft',
        color: 'text-rose-400',
      });
    }

    // 4. Detect Income (Entrada)
    if ((lower.includes('recebi') || lower.includes('ganhei')) && moneyAmount !== null) {
      StorageService.addFinanceRecord({
        description: 'Recebimento via Assistente',
        amount: moneyAmount,
        type: 'entrada',
        category: 'Serviços',
        date: new Date().toISOString().split('T')[0],
      });

      actions.push({
        type: 'entrada',
        title: `Entrada de R$ ${moneyAmount.toFixed(2)}`,
        details: 'Saldo atualizado no Financeiro',
        icon: 'ArrowUpRight',
        color: 'text-emerald-400',
      });
    }

    // 5. Detect Meal / Alimentação
    if (
      lower.includes('comi ') ||
      lower.includes('almocei ') ||
      lower.includes('tomei café') ||
      lower.includes('jantei ') ||
      (lower.includes('almoço') && !lower.includes('gastei'))
    ) {
      let mealType: 'cafe' | 'almoco' | 'lanche' | 'jantar' = 'almoco';
      if (lower.includes('café') || lower.includes('manha')) mealType = 'cafe';
      else if (lower.includes('jant')) mealType = 'jantar';
      else if (lower.includes('lanche')) mealType = 'lanche';

      // Clean phrase
      const foodsClean = raw.replace(/comi|almocei|jantei|no almoço|no jantar/gi, '').trim();

      StorageService.addMeal({
        mealType,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        foods: foodsClean || 'Refeição balanceada',
        waterMl: 500,
      });

      actions.push({
        type: 'alimentacao',
        title: `Refeição Registrada (${mealType.toUpperCase()})`,
        details: foodsClean || 'Diário alimentar atualizado',
        icon: 'Coffee',
        color: 'text-amber-400',
      });
    }

    // 6. Detect Task / Prova / Compromisso
    if (
      lower.includes('amanhã tenho') ||
      lower.includes('preciso fazer') ||
      lower.includes('lembrete:') ||
      lower.includes('prova de')
    ) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = lower.includes('amanhã')
        ? tomorrow.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      StorageService.addTask({
        title: raw.replace(/amanhã tenho|preciso fazer|lembrete:/gi, '').trim() || raw,
        priority: 'alta',
        category: lower.includes('prova') ? 'Estudos' : 'Geral',
        date: dateStr,
        status: 'a_fazer',
      });

      actions.push({
        type: 'tarefa',
        title: 'Nova Tarefa & Alerta Criado',
        details: `Programado para ${dateStr}`,
        icon: 'CheckSquare',
        color: 'text-emerald-400',
      });
    }

    // 7. Detect Project Update (KVB / KAEN / Etc)
    if (
      lower.includes('kvb') ||
      lower.includes('kaen') ||
      lower.includes('terminei a') ||
      lower.includes('concluí a')
    ) {
      const projects = StorageService.getProjects();
      const proj = projects.find(
        (p) =>
          (lower.includes('kvb') && p.name.toLowerCase().includes('kvb')) ||
          (lower.includes('kaen') && p.name.toLowerCase().includes('kaen'))
      );

      if (proj) {
        proj.progress = Math.min(100, proj.progress + 10);
        StorageService.saveProjects(projects);

        actions.push({
          type: 'projeto',
          title: `Projeto ${proj.name} Atualizado`,
          details: `Progresso avançado para ${proj.progress}%`,
          icon: 'FolderKanban',
          color: 'text-violet-400',
        });
      }
    }

    // If nothing matched above, save as Memory Note (Second Brain)
    if (actions.length === 0) {
      StorageService.addMemoryNote({
        title: raw.slice(0, 50),
        content: raw,
        category: 'ideia',
        tags: ['assistente', 'inbox'],
        pinned: false,
      });

      actions.push({
        type: 'consulta',
        title: 'Capturado no Segundo Cérebro (Memória)',
        details: 'Salvo com sucesso para consulta futura',
        icon: 'Sparkles',
        color: 'text-yellow-400',
      });
    }

    // Trigger Real OS Notification confirming the automated separation
    NotificationService.sendRealNotification('⚡ Life OS: Ação Registrada', {
      body: actions.map((a) => `✓ ${a.title}`).join(' | '),
      targetModule: actions[0]?.type === 'estudo' ? 'estudos' : 'dashboard',
    });

    const feedbackMessage =
      actions.length === 1
        ? `Perfeito! O Life OS identificou e registrou: ${actions[0].title}.`
        : `Excelente! O Life OS processou seu comando e separou automaticamente ${actions.length} ações nos seus respectivos módulos.`;

    return {
      rawText: input,
      actions,
      feedbackMessage,
    };
  },
};
