import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout, AthleteProfile, RewardItem, WorkoutCategory, WorkoutDifficulty } from '../types/quest';
import { questService, INITIAL_ATHLETE, INITIAL_WORKOUTS, INITIAL_REWARDS, SAMPLE_WORKOUTS, SAMPLE_REWARDS } from '../services/questService';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { toast } from 'sonner';

interface QuestContextType {
  player: AthleteProfile;
  quests: Workout[];
  shopItems: RewardItem[];
  customRewards: RewardItem[];
  activeTab: string;
  activeFilter: string;
  activeStatusFilter: 'active' | 'completed';
  setActiveTab: (tab: string) => void;
  setActiveFilter: (filter: string) => void;
  setActiveStatusFilter: (status: 'active' | 'completed') => void;
  incrementProgress: (questId: string, amount?: number) => void;
  completeQuest: (questId: string) => void;
  addQuest: (quest: {
    title: string;
    description: string;
    category: WorkoutCategory;
    maxProgress: number;
    difficulty: WorkoutDifficulty;
    reward: number;
    unit?: string;
  }) => void;
  buyShopItem: (item: RewardItem) => void;
  deleteQuest: (questId: string) => void;
  addCustomReward: (reward: { name: string; description: string; cost: number }) => void;
  deleteCustomReward: (rewardId: string) => void;
  redeemCustomReward: (rewardId: string) => void;
  updatePlayerProfile: (updates: Partial<AthleteProfile>) => void;
  resetAllData: () => void;
  loadSampleData: () => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export function QuestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => questService.loadState());
  const [activeTab, setActiveTabState] = useState<string>('quests');
  const [activeFilter, setActiveFilterState] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilterState] = useState<'active' | 'completed'>('active');

  // Guardado automático en localStorage
  useEffect(() => {
    questService.saveState(state);
  }, [state]);

  const setActiveTab = (tab: string) => {
    sounds.playClick();
    triggerHaptic('light');
    setActiveTabState(tab);
  };

  const setActiveFilter = (filter: string) => {
    sounds.playClick();
    triggerHaptic('light');
    setActiveFilterState(filter);
  };

  const setActiveStatusFilter = (status: 'active' | 'completed') => {
    sounds.playClick();
    triggerHaptic('light');
    setActiveStatusFilterState(status);
  };

  // Progreso de nivel atlético
  const checkLevelUp = (currentProfile: AthleteProfile, gainedExp: number, gainedGold: number): AthleteProfile => {
    let newExp = currentProfile.exp + gainedExp;
    let newLevel = currentProfile.level;
    let newGold = currentProfile.gold + gainedGold;

    const expNeeded = newLevel * 150;

    if (newExp >= expNeeded) {
      newLevel += 1;
      newExp -= expNeeded;

      sounds.playLevelUp();
      triggerHaptic('levelUp');

      toast.success(`📈 ¡NIVEL DE CONDICIÓN FÍSICA ${newLevel}!`, {
        description: `Has alcanzado un nuevo rango en tu rendimiento atlético.`,
        duration: 4000,
      });
    }

    return {
      ...currentProfile,
      level: newLevel,
      exp: newExp,
      gold: newGold,
    };
  };

  // Sumar avance (repeticiones, km o series)
  const incrementProgress = (questId: string, amount: number = 1) => {
    sounds.playClick();
    triggerHaptic('light');

    setState((prev) => {
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === questId && !q.completed) {
          const newProgress = Math.min(q.progress + amount, q.maxProgress);
          return { ...q, progress: newProgress };
        }
        return q;
      });

      return { ...prev, quests: updatedQuests };
    });
  };

  // Completar entrenamiento
  const completeQuest = (questId: string) => {
    const targetQuest = state.quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.completed) return;

    sounds.playQuestComplete();
    sounds.playCoin();
    triggerHaptic('success');

    const expGained = Math.floor(targetQuest.reward / 10);
    const goldGained = targetQuest.reward;

    // Actualizar métricas físicas según la categoría
    const updatedStats = { ...state.player.stats };
    if (targetQuest.category === 'strength') updatedStats.strength += 2;
    if (targetQuest.category === 'cardio') updatedStats.endurance += 2;
    if (targetQuest.category === 'flexibility') updatedStats.agility += 2;

    const updatedProfile = checkLevelUp(
      {
        ...state.player,
        stats: updatedStats,
        completedQuestsCount: state.player.completedQuestsCount + 1,
      },
      expGained,
      goldGained
    );

    const updatedQuests = state.quests.map((q) =>
      q.id === questId
        ? {
            ...q,
            progress: q.maxProgress,
            completed: true,
            completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        : q
    );

    setState({
      ...state,
      player: updatedProfile,
      quests: updatedQuests,
    });

    toast.success('✅ ¡Entrenamiento Completado!', {
      description: `+${goldGained} Puntos de Rendimiento | +${expGained} XP acumulados`,
    });
  };

  // Añadir nuevo entrenamiento
  const addQuest = (questData: {
    title: string;
    description: string;
    category: WorkoutCategory;
    maxProgress: number;
    difficulty: WorkoutDifficulty;
    reward: number;
    unit?: string;
  }) => {
    sounds.playClick();
    triggerHaptic('medium');

    const newWorkout: Workout = {
      id: Date.now().toString(),
      ...questData,
      progress: 0,
      timeLeft: 'Programado',
      completed: false,
    };

    setState((prev) => ({
      ...prev,
      quests: [newWorkout, ...prev.quests],
    }));

    toast.success('📋 Sesión Registrada', {
      description: `"${newWorkout.title}" añadida a tu plan de entrenamientos.`,
    });
  };

  // Canjear / desbloquear premio
  const buyShopItem = (item: RewardItem) => {
    if (state.player.gold < item.cost) {
      toast.error('Puntos insuficientes', {
        description: `Necesitas ${item.cost} puntos de actividad para este objetivo.`,
      });
      return;
    }

    sounds.playCoin();
    triggerHaptic('success');

    const updatedGold = state.player.gold - item.cost;
    const updatedShopItems = state.shopItems.map((si) =>
      si.id === item.id ? { ...si, purchased: true } : si
    );

    setState({
      ...state,
      player: {
        ...state.player,
        gold: updatedGold,
      },
      shopItems: updatedShopItems,
    });

    toast.success(`🎁 ¡Recompensa Canjeada!`, {
      description: `Disfruta de: ${item.name}.`,
    });
  };

  // Eliminar entrenamiento
  const deleteQuest = (questId: string) => {
    sounds.playClick();
    triggerHaptic('light');

    setState((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== questId),
    }));

    toast.info('Entrenamiento eliminado de tu plan.');
  };

  // Crear autorecompensa personalizada
  const addCustomReward = (reward: { name: string; description: string; cost: number }) => {
    sounds.playClick();
    triggerHaptic('light');

    const newReward: RewardItem = {
      id: `custom_${Date.now()}`,
      name: reward.name,
      description: reward.description,
      cost: reward.cost,
      icon: '🎯',
      type: 'custom',
    };

    setState((prev) => ({
      ...prev,
      customRewards: [newReward, ...prev.customRewards],
    }));

    toast.success('Objetivo Creado', {
      description: `"${reward.name}" añadido a tus premios personales.`,
    });
  };

  // Eliminar autorecompensa
  const deleteCustomReward = (rewardId: string) => {
    sounds.playClick();
    triggerHaptic('light');

    setState((prev) => ({
      ...prev,
      customRewards: prev.customRewards.filter((r) => r.id !== rewardId),
    }));

    toast.info('Objetivo personal retirado.');
  };

  // Actualizar perfil de atleta
  const updatePlayerProfile = (updates: Partial<AthleteProfile>) => {
    sounds.playClick();
    triggerHaptic('medium');

    setState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        ...updates,
      },
    }));

    toast.success('Perfil de atleta actualizado con éxito.');
  };

  // Canjear autorecompensa
  const redeemCustomReward = (rewardId: string) => {
    const reward = state.customRewards.find((r) => r.id === rewardId);
    if (!reward) return;

    if (state.player.gold < reward.cost) {
      toast.error('Puntos insuficientes', {
        description: `Te faltan ${reward.cost - state.player.gold} puntos para canjear este premio.`,
      });
      return;
    }

    sounds.playCoin();
    triggerHaptic('success');

    setState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        gold: prev.player.gold - reward.cost,
      },
    }));

    toast.success(`🎉 ¡Premio Canjeado!`, {
      description: `Disfruta de "${reward.name}". Constancia bien merecida.`,
    });
  };

  // Reiniciar datos a estado completamente vacío
  const resetAllData = () => {
    questService.clearState();
    setState({
      player: INITIAL_ATHLETE,
      quests: INITIAL_WORKOUTS,
      shopItems: INITIAL_REWARDS,
      customRewards: INITIAL_REWARDS,
    });
    toast.info('Datos restablecidos a cero.');
  };

  // Cargar datos de ejemplo para pruebas o defensa
  const loadSampleData = () => {
    sounds.playClick();
    triggerHaptic('medium');

    setState({
      player: {
        ...INITIAL_ATHLETE,
        name: 'Manuel',
        level: 2,
        exp: 80,
        gold: 300,
        streak: 3,
        title: 'Atleta Intermedio',
        stats: { strength: 16, endurance: 20, agility: 12 },
        completedQuestsCount: 2,
      },
      quests: SAMPLE_WORKOUTS,
      shopItems: SAMPLE_REWARDS,
      customRewards: SAMPLE_REWARDS.filter((r) => r.type === 'custom'),
    });

    toast.success('Datos de prueba cargados con éxito.');
  };

  return (
    <QuestContext.Provider
      value={{
        player: state.player,
        quests: state.quests,
        shopItems: state.shopItems,
        customRewards: state.customRewards,
        activeTab,
        activeFilter,
        activeStatusFilter,
        setActiveTab,
        setActiveFilter,
        setActiveStatusFilter,
        incrementProgress,
        completeQuest,
        addQuest,
        deleteQuest,
        buyShopItem,
        addCustomReward,
        deleteCustomReward,
        redeemCustomReward,
        updatePlayerProfile,
        resetAllData,
        loadSampleData,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}

export function useQuestContext() {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuestContext debe ser usado dentro de un QuestProvider');
  }
  return context;
}
