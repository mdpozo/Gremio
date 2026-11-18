/**
 * Types definition for QuestFit - Professional Athletic & Fitness System
 */

export type WorkoutCategory = 'cardio' | 'strength' | 'flexibility';

export type WorkoutDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

export interface Workout {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  progress: number;
  maxProgress: number;
  reward: number; // Puntos de Rendimiento / Actividad
  difficulty: WorkoutDifficulty;
  timeLeft: string;
  completed: boolean;
  completedAt?: string;
  unit?: string; // km, reps, min, series
}

// Alias para mantener compatibilidad hacia atrás
export type Quest = Workout;
export type QuestCategory = WorkoutCategory;
export type QuestDifficulty = WorkoutDifficulty;

export interface AthleteStats {
  strength: number;   // Fuerza / Hipertrofia
  endurance: number;  // Capacidad Cardiovascular / Resistencia
  agility: number;    // Movilidad Articular / Flexibilidad
}

export interface AthleteProfile {
  name: string;
  level: number;
  exp: number; // Puntos de Progreso
  gold: number; // Puntos de Rendimiento acumulados
  streak: number; // Días consecutivos entrenando
  title: string; // Estado de forma: "Atleta en Progreso", "Condición Avanzada"
  stats: AthleteStats;
  completedQuestsCount: number;
}

// Alias de perfil
export type PlayerProfile = AthleteProfile;
export type PlayerStats = AthleteStats;

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: 'habit' | 'custom' | 'milestone';
  purchased?: boolean;
}

export type ShopItem = RewardItem;
