/**
 * LIFE OS — Life AI Tutor & Personal Assistant Module
 * Grounded in the user's real tasks, study stats, schedule, and study subjects.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  GraduationCap,
  Clock,
  CheckSquare,
  HelpCircle,
  BrainCircuit,
  User,
} from 'lucide-react';
import { AiService, ChatMessage } from '../services/aiService';
import { StorageService } from '../services/storageService';

export const AiAssistantModule: React.FC = () => {
  const profile = StorageService.getProfile();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'assistant',
      text: `Olá, ${profile.nickname || profile.name || 'Enzo'}! Sou o LIFE AI, seu tutor educacional e assistente do Life OS.
Estou sincronizado em tempo real com seus dados: suas matérias, tarefas de hoje, rotina e histórico de estudos.

Como posso te orientar agora? Escolha uma pergunta rápida abaixo ou digite livremente.`,
      timestamp: 'Agora',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'O que preciso fazer hoje?',
    'O que estudei essa semana?',
    'Tenho uma hora livre. O que posso fazer?',
    'O que está atrasado ou pendente?',
    'Me ajude a organizar meu dia de amanhã.',
    'Explique o conceito de potenciação com expoente negativo.',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await AiService.askAssistant(query, messages);
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase">
            <Bot className="w-4 h-4" />
            <span>TUTOR EDUCACIONAL & SEGUNDO CÉREBRO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Life AI Assistant
          </h1>
          <p className="text-xs text-slate-400">
            Respostas precisas fundamentadas nos seus dados reais e assistência pedagógica sob medida.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="p-6 rounded-3xl ios-glass-card border border-white/10 flex flex-col h-[550px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600/40 border border-indigo-500/40 text-white rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                <div>{msg.text}</div>
                <span className="text-[10px] text-slate-400 block text-right font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/50 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 italic">
                Life AI analisando seus dados de estudos e rotina...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div className="py-3 flex items-center gap-2 overflow-x-auto custom-scrollbar border-t border-white/5">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre seus estudos, tarefas ou peça uma explicação..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl ios-button-primary text-white disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
