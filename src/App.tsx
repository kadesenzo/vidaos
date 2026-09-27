/**
 * LIFE OS — SISTEMA OPERACIONAL PESSOAL
 * Complete Personal Operating System with Academy Learning Platform,
 * Tasks, Routine, Habits, Projects, Finances, CRM, Health, Memory, Goals, and AI Assistant.
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { ModuleId, UserProfile } from './types';
import { AppConfig } from './config/appConfig';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  auth,
  testFirestoreConnection,
  fetchUserProfileFromFirestore,
  handleGoogleAuthRedirect,
} from './services/firebase';

// Modules
import { DashboardModule } from './modules/DashboardModule';
import { EstudosModule } from './modules/EstudosModule';
import { TarefasModule } from './modules/TarefasModule';
import { HabitosModule } from './modules/HabitosModule';
import { RotinaModule } from './modules/RotinaModule';
import { ProjetosModule } from './modules/ProjetosModule';
import { FinancasModule } from './modules/FinancasModule';
import { VendasModule } from './modules/VendasModule';
import { TreinosModule } from './modules/TreinosModule';
import { MemoriaModule } from './modules/MemoriaModule';
import { MetasModule } from './modules/MetasModule';
import { CalendarioModule } from './modules/CalendarioModule';
import { AiAssistantModule } from './modules/AiAssistantModule';
import { AssistenteModule } from './modules/AssistenteModule';
import { TrabalhoModule } from './modules/TrabalhoModule';
import { SaudeCrescimentoModule } from './modules/SaudeCrescimentoModule';
import { GaleriaModule } from './modules/GaleriaModule';
import { DiarioModule } from './modules/DiarioModule';
import { TimelineModule } from './modules/TimelineModule';
import { IdeiasInboxModule } from './modules/IdeiasInboxModule';
import { ConfiguracoesModule } from './modules/ConfiguracoesModule';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(StorageService.getConfig());
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [currentModule, setCurrentModule] = useState<ModuleId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!profile.onboardingCompleted);

  // Active study context for quick jump to a lesson
  const [activeCourseId, setActiveCourseId] = useState<string | undefined>();
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>();
  const [activeStudyTimeSeconds, setActiveStudyTimeSeconds] = useState<number>(0);

  // Subscribe to storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setConfig(StorageService.getConfig());
      setProfile(StorageService.getProfile());
    };
    const unsub = StorageService.subscribe(handleStorageChange);
    return unsub;
  }, []);

  // Validate Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Handle redirect-based Google sign-in when the browser returns from the OAuth flow.
  useEffect(() => {
    handleGoogleAuthRedirect().catch((error) => {
      console.warn('Google redirect auth returned an error:', error);
    });
  }, []);

  // Auth Listener: Check if user already completed onboarding on Firestore or if it's first login
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const cloudProfile = await fetchUserProfileFromFirestore(firebaseUser.uid);
          if (cloudProfile && cloudProfile.onboardingCompleted) {
            // User already completed onboarding on Firestore:
            // Sync cloud profile, customize enabled modules, and DO NOT show quiz!
            setProfile(cloudProfile);
            StorageService.saveProfile(cloudProfile);

            if (cloudProfile.enabledModules && cloudProfile.enabledModules.length > 0) {
              const updatedModulesMap: Record<string, boolean> = {
                dashboard: true,
                configuracoes: true,
              };
              cloudProfile.enabledModules.forEach((m) => {
                updatedModulesMap[m] = true;
              });
              const newConfig: AppConfig = {
                ...config,
                enabledModules: {
                  ...config.enabledModules,
                  ...(updatedModulesMap as any),
                },
              };
              setConfig(newConfig);
              StorageService.saveConfig(newConfig);
            }
            setIsOnboardingOpen(false);
          } else {
            // First time logging in (or onboarding not completed):
            // Show Onboarding Quiz to collect preferences and populate profile!
            const initialUserDraft: UserProfile = {
              ...profile,
              id: firebaseUser.uid,
              userId: firebaseUser.uid,
              name: firebaseUser.displayName || 'Usuário',
              nickname: firebaseUser.displayName?.split(' ')[0] || 'Usuário',
              email: firebaseUser.email || '',
              avatarUrl: firebaseUser.photoURL || profile.avatarUrl,
              onboardingCompleted: false,
            };
            setProfile(initialUserDraft);
            StorageService.saveProfile(initialUserDraft);
            setIsOnboardingOpen(true);
          }
        } catch (error) {
          console.warn('Error fetching user profile from Firestore:', error);
        }
      }
    });
    return unsubAuth;
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateToModule = (module: string, contextId?: string) => {
    setCurrentModule(module as ModuleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartStudyLesson = (courseId: string, lessonId: string) => {
    setActiveCourseId(courseId);
    setActiveLessonId(lessonId);
    setCurrentModule('estudos');
  };

  // Quick badge counts
  const tasks = StorageService.getTasks();
  const habits = StorageService.getHabits();
  const flashcards = StorageService.getFlashcards();

  const pendingTasksCount = tasks.filter(
    (t) => t.status === 'a_fazer' || t.status === 'em_andamento'
  ).length;

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Frosted Glass Top Navigation Bar */}
      <Header
        config={config}
        profile={profile}
        activeStudyTime={activeStudyTimeSeconds}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigateToModule={handleNavigateToModule}
      />

      {/* 2. Main App Area (Desktop Sidebar + Content Container) */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          config={config}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          counts={{
            pendingTasks: pendingTasksCount,
            pendingReviews: flashcards.length,
            activeHabits: habits.length,
          }}
        />

        {/* Dynamic Content Panel */}
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 max-w-full">
          {currentModule === 'dashboard' && (
            <DashboardModule
              profile={profile}
              config={config}
              onNavigateToModule={handleNavigateToModule}
              onStartStudyLesson={handleStartStudyLesson}
              onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            />
          )}

          {currentModule === 'assistente' && <AssistenteModule />}

          {currentModule === 'estudos' && (
            <EstudosModule
              config={config}
              initialCourseId={activeCourseId}
              initialLessonId={activeLessonId}
              activeStudySeconds={activeStudyTimeSeconds}
              onUpdateActiveStudySeconds={setActiveStudyTimeSeconds}
            />
          )}

          {currentModule === 'tarefas' && <TarefasModule />}

          {currentModule === 'habitos' && <HabitosModule />}

          {currentModule === 'rotina' && <RotinaModule />}

          {currentModule === 'projetos' && <ProjetosModule />}

          {currentModule === 'trabalho' && <TrabalhoModule />}

          {currentModule === 'financas' && <FinancasModule />}

          {currentModule === 'vendas' && <VendasModule />}

          {currentModule === 'treinos' && <TreinosModule />}

          {currentModule === 'saude' && <SaudeCrescimentoModule />}

          {currentModule === 'galeria' && <GaleriaModule />}

          {currentModule === 'diario' && <DiarioModule />}

          {currentModule === 'timeline' && <TimelineModule />}

          {currentModule === 'inbox' && <IdeiasInboxModule />}

          {currentModule === 'memoria' && <MemoriaModule />}

          {currentModule === 'metas' && <MetasModule />}

          {currentModule === 'calendario' && <CalendarioModule />}

          {currentModule === 'ia' && <AiAssistantModule />}

          {currentModule === 'configuracoes' && (
            <ConfiguracoesModule
              config={config}
              profile={profile}
              onRedoOnboarding={() => setIsOnboardingOpen(true)}
            />
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Floating Dock */}
      <BottomNav
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        config={config}
      />

      {/* 4. Global Modals & Drawers */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onOpenStudyTimer={() => {
          setCurrentModule('estudos');
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToModule={handleNavigateToModule}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToModule={(mod) => handleNavigateToModule(mod)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onFinish={() => setIsOnboardingOpen(false)}
        config={config}
      />
    </div>
  );
}
