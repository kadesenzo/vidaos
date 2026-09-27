/**
 * LIFE OS — Treinos & Alimentação Module
 * Physical activity logger (Jiu-jitsu, Musculação, Corrida) + healthy meal & hydration tracker.
 */

import React, { useState } from 'react';
import {
  Dumbbell,
  Plus,
  Flame,
  Droplet,
  Coffee,
  Heart,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { WorkoutRecord, MealRecord } from '../types';

export const TreinosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'treinos' | 'alimentacao'>('treinos');

  // Workout form
  const [activity, setActivity] = useState('Jiu-jitsu');
  const [duration, setDuration] = useState('60');
  const [intensity, setIntensity] = useState<'leve' | 'moderada' | 'intensa'>('intensa');
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Meal form
  const [mealType, setMealType] = useState<'cafe' | 'almoco' | 'lanche' | 'jantar'>('almoco');
  const [foods, setFoods] = useState('');
  const [waterMl, setWaterMl] = useState('500');

  const workouts = StorageService.getWorkouts();
  const meals = StorageService.getMeals();

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    StorageService.addWorkout({
      activity,
      icon: 'Dumbbell',
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Number(duration) || 60,
      intensity,
      notes: workoutNotes,
    });

    setWorkoutNotes('');
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foods.trim()) return;

    StorageService.addMeal({
      mealType,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      foods,
      waterMl: Number(waterMl) || 500,
    });

    setFoods('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl ios-glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold uppercase">
            <Heart className="w-4 h-4" />
            <span>SAÚDE INTEGRADA, ATIVIDADE & NUTRIÇÃO</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Treinos & Alimentação
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhe sua prática física regular e hábitos equilibrados sem extremismos.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('treinos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'treinos'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Treinos ({workouts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('alimentacao')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'alimentacao'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Alimentação & Água</span>
          </button>
        </div>
      </div>

      {activeTab === 'treinos' ? (
        <div className="space-y-6">
          {/* Quick Add Workout Form */}
          <form
            onSubmit={handleAddWorkout}
            className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-3"
          >
            <span className="text-xs font-bold text-white uppercase font-mono block">
              + Registrar Nova Sessão de Treino
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Ex: Jiu-jitsu, Corrida 5km, Musculação..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duração (min)"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none font-mono"
              />
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="leve">🟢 Intensidade Leve</option>
                <option value="moderada">🟡 Intensidade Moderada</option>
                <option value="intensa">🔴 Intensidade Alta</option>
              </select>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold"
              >
                Salvar Treino
              </button>
            </div>
            <input
              type="text"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="Observações técnicas (ex: foco em passagem de guarda e raspagens)..."
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none"
            />
          </form>

          {/* Workouts History */}
          <div className="space-y-3">
            {workouts.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{w.activity}</span>
                    <span className="text-xs font-mono text-slate-400">• {w.durationMinutes} min</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      w.intensity === 'intensa'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {w.intensity.toUpperCase()}
                  </span>
                </div>
                {w.notes && <p className="text-xs text-slate-300">{w.notes}</p>}
                {w.exercises && w.exercises.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {w.exercises.map((ex, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-1 rounded-lg bg-white/5 text-slate-300"
                      >
                        {ex.name}: {ex.sets}x{ex.reps} {ex.weightKg ? `(${ex.weightKg}kg)` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Meal Form */}
          <form
            onSubmit={handleAddMeal}
            className="p-5 rounded-3xl ios-glass-card border border-white/10 space-y-3"
          >
            <span className="text-xs font-bold text-white uppercase font-mono block">
              + Registrar Refeição Saudável
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="cafe">☕ Café da Manhã</option>
                <option value="almoco">🥗 Almoço</option>
                <option value="lanche">🍎 Lanche da Tarde</option>
                <option value="jantar">🍲 Jantar</option>
              </select>
              <input
                type="text"
                required
                value={foods}
                onChange={(e) => setFoods(e.target.value)}
                placeholder="Alimentos consumidos..."
                className="sm:col-span-2 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl ios-button-primary text-white text-xs font-bold"
              >
                Salvar Refeição
              </button>
            </div>
          </form>

          {/* Meals List */}
          <div className="space-y-3">
            {meals.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-3xl ios-glass-card border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 text-amber-400">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white capitalize">{m.mealType}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{m.foods}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <Droplet className="w-3.5 h-3.5" />
                  <span>{m.waterMl} ml</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
