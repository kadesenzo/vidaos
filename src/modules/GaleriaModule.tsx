/**
 * LIFE OS — Galeria da Vida Module
 * Private photographic memory of studies, workouts, work, project evolution, and life moments.
 */

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Filter,
  GraduationCap,
  Dumbbell,
  Briefcase,
  FolderKanban,
  Sparkles,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { GalleryItem, GalleryCategory } from '../types';

export const GaleriaModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // New item form
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('estudos');
  const [description, setDescription] = useState('');
  const [projectRelated, setProjectRelated] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const galleryItems = StorageService.getGallery();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    StorageService.addGalleryItem({
      title,
      imageUrl,
      category,
      date: new Date().toISOString().split('T')[0],
      description,
      projectRelated: projectRelated || undefined,
      tags,
    });

    setTitle('');
    setImageUrl('');
    setDescription('');
    setProjectRelated('');
    setTagsInput('');
    setIsModalOpen(false);
  };

  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory !== 'todas' && item.category !== selectedCategory) return false;
    return true;
  });

  const categoryIcons: Record<GalleryCategory, React.ReactNode> = {
    estudos: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />,
    treinos: <Dumbbell className="w-3.5 h-3.5 text-rose-400" />,
    trabalho: <Briefcase className="w-3.5 h-3.5 text-amber-400" />,
    projetos: <FolderKanban className="w-3.5 h-3.5 text-violet-400" />,
    memorias: <Sparkles className="w-3.5 h-3.5 text-sky-400" />,
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold uppercase">
            <ImageIcon className="w-4 h-4" />
            <span>MEMÓRIA VISUAL PRIVADA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Galeria da Vida
          </h1>
          <p className="text-xs text-slate-400">
            Guarde fotos de cadernos, evolução dos treinos, bastidores de trabalho e memórias pessoais.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl ios-button-primary text-white text-xs font-bold shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Foto</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'todas', label: 'Todas as Fotos' },
          { id: 'estudos', label: '📚 Estudos & Cadernos' },
          { id: 'treinos', label: '🥋 Treinos & Faixas' },
          { id: 'trabalho', label: '💼 Trabalho & Clientes' },
          { id: 'projetos', label: '🚀 Evolução de Projetos' },
          { id: 'memorias', label: '🧠 Memórias Especiais' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreviewItem(item)}
            className="rounded-3xl ios-glass-card border border-white/10 overflow-hidden cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-black/40">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                {categoryIcons[item.category]}
                <span className="capitalize">{item.category}</span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                <span>{item.date}</span>
                {item.projectRelated && (
                  <span className="text-indigo-400 font-semibold">{item.projectRelated}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="ios-glass-sheet rounded-3xl w-full max-w-lg p-6 border border-white/20 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">Adicionar à Galeria da Vida</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Imagem:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Resumo de Potenciação no Caderno"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL da Imagem:</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="estudos">📚 Estudos</option>
                    <option value="treinos">🥋 Treinos</option>
                    <option value="trabalho">💼 Trabalho</option>
                    <option value="projetos">🚀 Projetos</option>
                    <option value="memorias">🧠 Memórias</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Projeto Relacionado:</label>
                  <input
                    type="text"
                    value={projectRelated}
                    onChange={(e) => setProjectRelated(e.target.value)}
                    placeholder="Ex: KVB System"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contexto, data ou anotação sobre essa imagem..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl ios-button-primary text-white text-xs font-bold"
                >
                  Salvar na Galeria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Fullscreen Modal */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full ios-glass-sheet rounded-3xl overflow-hidden border border-white/20 p-5 space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{previewItem.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{previewItem.description}</p>
                <span className="text-[11px] text-slate-500 font-mono mt-2 block">
                  Registrado em: {previewItem.date} {previewItem.projectRelated ? `• ${previewItem.projectRelated}` : ''}
                </span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
