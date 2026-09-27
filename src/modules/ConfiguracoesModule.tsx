/**
 * LIFE OS — Ajustes & Configurações Module
 * White-label personalization, theme accent switcher, redo onboarding quiz, JSON export/import, and system reset.
 */

import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Sliders,
  Download,
  Upload,
  RotateCcw,
  User,
  Shield,
  Trash2,
  Check,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { AppConfig } from '../config/appConfig';
import { UserProfile } from '../types';

interface ConfiguracoesModuleProps {
  config: AppConfig;
  profile: UserProfile;
  onRedoOnboarding: () => void;
}

export const ConfiguracoesModule: React.FC<ConfiguracoesModuleProps> = ({
  config,
  profile,
  onRedoOnboarding,
}) => {
  const [appName, setAppName] = useState(config.appName);
  const [tagline, setTagline] = useState(config.tagline);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [userName, setUserName] = useState(profile.nickname || profile.name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [activeModules, setActiveModules] = useState<Record<string, boolean>>(
    config.enabledModules
  );

  const colorPalettes = [
    { name: 'iOS Indigo', primary: '#6366f1', secondary: '#38bdf8' },
    { name: 'Cyber Purple', primary: '#a855f7', secondary: '#ec4899' },
    { name: 'Emerald Focus', primary: '#10b981', secondary: '#06b6d4' },
    { name: 'Sunset Amber', primary: '#f59e0b', secondary: '#ef4444' },
    { name: 'Sky Tech', primary: '#0284c7', secondary: '#38bdf8' },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedConfig: AppConfig = {
      ...config,
      appName,
      tagline,
      primaryColor,
      enabledModules: {
        ...config.enabledModules,
        ...(activeModules as any),
        configuracoes: true,
        dashboard: true,
      },
    };
    StorageService.saveConfig(updatedConfig);

    const updatedProfile: UserProfile = {
      ...profile,
      nickname: userName,
      name: userName,
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveProfile(updatedProfile);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const json = StorageService.exportAllDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importDataJSON(content);
        if (success) {
          alert('Backup importado com sucesso!');
        } else {
          alert('Erro ao importar arquivo JSON de backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetFactory = () => {
    if (confirm('Tem certeza que deseja restaurar os dados de fábrica do Life OS?')) {
      StorageService.resetToFactoryDefaults();
      window.location.reload();
    }
  };

  const toggleModule = (key: string) => {
    setActiveModules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase">
            <Settings className="w-4 h-4" />
            <span>PERSONALIZAÇÃO WHITE-LABEL & DADOS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Ajustes do Sistema
          </h1>
          <p className="text-xs text-slate-400">
            Remodele a identidade, nome, paleta de cores e controle seus dados.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configurações salvas!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Identidade & White-label */}
        <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white text-sm font-bold pb-2 border-b border-white/10">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Identidade do Aplicativo (White-Label)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome do Aplicativo:
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Ex: LIFE OS ou Meu Segundo Cérebro"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Slogan / Tagline:
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: Seu sistema operacional pessoal"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Seu Nome de Usuário:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Refazer Questionário Pessoal:
              </label>
              <button
                type="button"
                onClick={onRedoOnboarding}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Onboarding / Quiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* Paletas de Cores */}
        <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white text-sm font-bold pb-2 border-b border-white/10">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Tema & Paleta de Destaque</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {colorPalettes.map((pal) => (
              <button
                key={pal.name}
                type="button"
                onClick={() => setPrimaryColor(pal.primary)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  primaryColor === pal.primary
                    ? 'border-white bg-white/10 shadow-md'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 shadow"
                  style={{ backgroundColor: pal.primary }}
                />
                <span className="text-[11px] font-bold text-white block">{pal.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Módulos Habilitados */}
        <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-white text-sm font-bold">Módulos Habilitados no LIFE OS</span>
            <span className="text-xs text-slate-400">Marque para exibir no menu</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'estudos', label: 'Estudos (Academy)' },
              { id: 'tarefas', label: 'Tarefas' },
              { id: 'habitos', label: 'Hábitos' },
              { id: 'rotina', label: 'Rotina' },
              { id: 'projetos', label: 'Projetos' },
              { id: 'financas', label: 'Financeiro' },
              { id: 'vendas', label: 'Vendas CRM' },
              { id: 'treinos', label: 'Treinos & Saúde' },
              { id: 'memoria', label: 'Memória' },
              { id: 'metas', label: 'Metas' },
              { id: 'calendario', label: 'Calendário' },
              { id: 'ia', label: 'Life AI Tutor' },
            ].map((m) => {
              const active = activeModules[m.id] !== false;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleModule(m.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs transition-all ${
                    active
                      ? 'bg-white/10 border-white/20 text-white font-semibold'
                      : 'bg-white/[0.02] border-white/5 text-slate-500'
                  }`}
                >
                  <span>{m.label}</span>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center ${
                      active ? 'bg-indigo-600 text-white' : 'bg-white/10 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl ios-button-primary text-white text-xs font-bold shadow-lg"
          >
            Salvar Personalização
          </button>
        </div>
      </form>

      {/* Export / Import & Backup Management */}
      <div className="p-6 rounded-3xl ios-glass-card border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-white text-sm font-bold pb-2 border-b border-white/10">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Segurança & Portabilidade dos Dados</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Seus dados pertencem a você. Exporte um arquivo JSON completo contendo todo o seu histórico
          de estudos, questões, notas e finanças para backup ou transferência.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar Dados (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Importar Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetFactory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Restaurar Fábrica</span>
          </button>
        </div>
      </div>
    </div>
  );
};
