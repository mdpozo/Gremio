/**
 * QuestCard.tsx — Tarjeta Individual de Misión
 *
 * Componente "dumb" (presentacional): no gestiona estado propio.
 * Solo recibe props y las muestra. Los mismos props → mismo resultado visual.
 *
 * Estructura visual:
 * ┌─────────────────────────────────┐
 * │  [🏃 CARDIO]          [HARD]   │  ← Banner de categoría
 * ├─────────────────────────────────┤
 * │  🎯 Maratón del Guerrero        │  ← Título
 * │  Corre 5km sin detenerte...     │  ← Descripción (máx 2 líneas)
 * │  Progreso             3 / 5     │
 * │  ██████░░░░░░░░░░░░░░░░░░░     │  ← Barra Radix UI
 * │  [💰 +500]  [🏆 +50 XP] ⏱ 2d │  ← Recompensas
 * │  [    Continuar Misión    ]     │  ← CTA button
 * └─────────────────────────────────┘
 */
import { Target, Coins, Trophy, Clock } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';

/**
 * Interface de Props — "contrato" TypeScript del componente.
 * Union Types (|) equivalen a Enum en Java: solo se aceptan esos valores exactos.
 */
interface QuestCardProps {
  title: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility';
  progress: number;
  maxProgress: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  timeLeft: string;
  onStartQuest: () => void;
}

export function QuestCardV1({
  title, description, category, progress, maxProgress, reward, difficulty, timeLeft, onStartQuest,
}: QuestCardProps) {

  // Porcentaje para la barra de progreso: valor entre 0 y 100
  const progressPercent = (progress / maxProgress) * 100;

  /**
   * Diccionarios de estilos — patrón "lookup table" (tabla de consulta).
   * Equivalente a un HashMap<String, String> en Java.
   * Evita if/else o switch: O(1) de acceso, fácil de ampliar.
   */
  const categoryColors = {
    cardio: 'from-cat-cardio-from to-cat-cardio-to',
    strength: 'from-cat-strength-from to-cat-strength-to',
    flexibility: 'from-cat-flex-from to-cat-flex-to',
  };

  const categoryIcons = {
    cardio: '🏃',
    strength: '💪',
    flexibility: '🧘',
  };

  const difficultyColors = {
    easy: 'text-diff-easy border-diff-easy/30',
    medium: 'text-diff-medium border-diff-medium/30',
    hard: 'text-diff-hard border-diff-hard/30',
    epic: 'text-diff-epic border-diff-epic/30',
  };

  return (
    <div className="bg-gradient-to-br from-quest-card-from to-quest-card-to rounded-xl border border-quest-border-card hover:border-quest-border-hover shadow-lg hover:shadow-quest-accent-glow/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden">

      <div className={`bg-gradient-to-r ${categoryColors[category]} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryIcons[category]}</span>
          <span className="font-bold text-white uppercase text-sm tracking-wide">{category}</span>
        </div>
        <div className={`px-2 py-1 rounded-md border ${difficultyColors[difficulty]} bg-quest-bg/50 text-xs font-bold uppercase`}>
          {difficulty}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-quest-text-title mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-quest-accent" />
          {title}
        </h3>

        <p className="text-quest-text-muted text-sm mb-4 line-clamp-2">{description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-quest-text-muted mb-2">
            <span>Progreso</span>
            <span className="text-quest-accent font-semibold">{progress} / {maxProgress}</span>
          </div>
          <Progress.Root
            className="relative overflow-hidden bg-quest-bg/60 rounded-full h-3 border border-quest-border-card"
            value={progressPercent}
          >
            <Progress.Indicator
              className={`bg-gradient-to-r ${categoryColors[category]} h-full transition-transform duration-500 ease-out`}
              style={{ transform: `translateX(-${100 - progressPercent}%)` }}
            />
          </Progress.Root>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-quest-accent-bg-from/20 px-3 py-1.5 rounded-lg border border-quest-accent-bg-from/40">
              <Coins className="w-4 h-4 text-quest-accent" />
              <span className="text-quest-accent font-bold text-sm">+{reward}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-diff-epic/20 px-3 py-1.5 rounded-lg border border-diff-epic/40">
              <Trophy className="w-4 h-4 text-diff-epic" />
              <span className="text-diff-epic font-bold text-sm">+{Math.floor(reward / 10)} XP</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-quest-text-muted text-xs">
            <Clock className="w-4 h-4" />
            <span>{timeLeft}</span>
          </div>
        </div>

        <button 
          onClick={onStartQuest}
          className="w-full mt-4 bg-gradient-to-r from-quest-accent-bg-from to-quest-accent-bg-to hover:from-quest-accent-hover hover:to-quest-accent text-quest-bg font-bold py-2.5 rounded-lg shadow-lg shadow-quest-accent-glow transition-all duration-200 hover:scale-[1.02]"
        >
          Iniciar Ejercicio
        </button>
      </div>
    </div>
  );
}
