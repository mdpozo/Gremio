import { Workout, AthleteProfile, RewardItem } from '../types/quest';

const STORAGE_KEY = 'QUESTFIT_DATA_V3';

export interface QuestFitState {
  player: AthleteProfile;
  quests: Workout[];
  customRewards: RewardItem[];
  shopItems: RewardItem[];
}

// Estado inicial limpio / vacío para nuevos atletas
export const INITIAL_ATHLETE: AthleteProfile = {
  name: 'Atleta',
  level: 1,
  exp: 0,
  gold: 0,
  streak: 0,
  title: 'Recluta Físico',
  stats: {
    strength: 0,
    endurance: 0,
    agility: 0,
  },
  completedQuestsCount: 0,
};

// Listas vacías por defecto
export const INITIAL_WORKOUTS: Workout[] = [];
export const INITIAL_REWARDS: RewardItem[] = [];

// Datos de demostración (opcionales para pruebas o defensa de TFG)
export const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: 'sample_1',
    title: 'Carrera Continua 5K (Ritmo Estable)',
    description: 'Sesión aeróbica de 5 kilómetros a ritmo constante (Zona 2/3) para mejorar la base cardiovascular.',
    category: 'cardio',
    progress: 0,
    maxProgress: 5,
    reward: 250,
    difficulty: 'medium',
    timeLeft: 'Hoy',
    completed: false,
    unit: 'km',
  },
  {
    id: 'sample_2',
    title: 'Torso: Dominadas y Flexiones',
    description: 'Trabajo de calistenia y fuerza: completar 50 flexiones estrictas y 30 dominadas pronadas.',
    category: 'strength',
    progress: 0,
    maxProgress: 80,
    reward: 350,
    difficulty: 'hard',
    timeLeft: 'Esta semana',
    completed: false,
    unit: 'reps',
  },
  {
    id: 'sample_3',
    title: 'Movilidad Articular y Cadera',
    description: 'Rutina guiada de 30 minutos de flexibilidad, apertura de cadera y descompresión lumbar.',
    category: 'flexibility',
    progress: 0,
    maxProgress: 30,
    reward: 150,
    difficulty: 'easy',
    timeLeft: 'Hoy',
    completed: false,
    unit: 'min',
  },
];

export const SAMPLE_REWARDS: RewardItem[] = [
  {
    id: 'sample_rew_1',
    name: 'Comida Libre / Cheat Meal',
    description: 'Cena libre de fin de semana para celebrar la constancia semanal.',
    cost: 500,
    icon: '🍽️',
    type: 'custom',
  },
  {
    id: 'sample_rew_2',
    name: 'Episodio de Serie o Película',
    description: 'Tarde de descanso y ocio personal tras completar tus entrenamientos.',
    cost: 200,
    icon: '🎬',
    type: 'custom',
  },
];

export const questService = {
  loadState(): QuestFitState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error al cargar datos locales de QuestFit:', e);
    }
    return {
      player: INITIAL_ATHLETE,
      quests: INITIAL_WORKOUTS,
      shopItems: INITIAL_REWARDS,
      customRewards: INITIAL_REWARDS,
    };
  },

  saveState(state: QuestFitState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error al guardar datos de QuestFit:', e);
    }
  },

  clearState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error al reiniciar datos:', e);
    }
  },
};
