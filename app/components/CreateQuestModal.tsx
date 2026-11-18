import { useState } from 'react';
import { z } from 'zod';
import { PlusCircle, Dumbbell, Activity, Heart, Sparkles, X } from 'lucide-react';
import { Drawer } from 'vaul';
import { useQuestContext } from '../context/QuestContext';
import { WorkoutCategory, WorkoutDifficulty } from '../types/quest';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

const createWorkoutSchema = z.object({
  title: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  description: z
    .string()
    .min(5, 'La descripción técnica debe tener al menos 5 caracteres')
    .max(150, 'La descripción es demasiado larga'),
  category: z.enum(['cardio', 'strength', 'flexibility'] as const),
  maxProgress: z.number({ message: 'Ingresa un número válido' }).min(1, 'La meta debe ser mayor a 0'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'epic'] as const),
  unit: z.string().optional(),
});

type FormData = z.infer<typeof createWorkoutSchema>;

export function CreateQuestModal() {
  const { addQuest } = useQuestContext();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>('strength');
  const [maxProgress, setMaxProgress] = useState(30);
  const [unit, setUnit] = useState('reps');
  const [difficulty, setDifficulty] = useState<WorkoutDifficulty>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const difficultyRewards: Record<WorkoutDifficulty, number> = {
    easy: 150,
    medium: 250,
    hard: 350,
    epic: 500,
  };

  const calculatedPoints = difficultyRewards[difficulty] + maxProgress * 5;

  const handleSelectCategory = (cat: WorkoutCategory) => {
    sounds.playClick();
    triggerHaptic('light');
    setCategory(cat);
    if (cat === 'cardio') {
      setUnit('km');
      setMaxProgress(5);
    } else if (cat === 'flexibility') {
      setUnit('min');
      setMaxProgress(20);
    } else {
      setUnit('reps');
      setMaxProgress(30);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData: FormData = {
      title,
      description,
      category,
      maxProgress: Number(maxProgress),
      difficulty,
      unit,
    };

    const result = createWorkoutSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    addQuest({
      title: result.data.title,
      description: result.data.description,
      category: result.data.category,
      maxProgress: result.data.maxProgress,
      difficulty: result.data.difficulty,
      reward: calculatedPoints,
      unit: unit.trim() || 'reps',
    });

    setTitle('');
    setDescription('');
    setCategory('strength');
    setMaxProgress(30);
    setUnit('reps');
    setDifficulty('medium');
    setErrors({});
    setOpen(false);
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="min-h-[40px] flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-3.5 py-2 rounded-lg active:scale-95 transition-all text-xs shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>Añadir Rutina</span>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-zinc-900 border-t border-zinc-800 text-zinc-200 flex flex-col rounded-t-2xl max-h-[90vh] fixed bottom-0 left-0 right-0 z-50 shadow-2xl overflow-hidden">
          <div className="p-6 overflow-y-auto pb-12">
            <div className="mx-auto w-10 h-1 rounded-full bg-zinc-700 mb-5" />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <Drawer.Title className="text-base font-bold text-white">Nueva Rutina de Entrenamiento</Drawer.Title>
                  <p className="text-xs text-zinc-400">Configura tus objetivos técnicos y disciplina deportiva.</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Selector Visual de Disciplina */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Disciplina Deportiva *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('strength')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      category === 'strength'
                        ? 'bg-amber-400 text-zinc-950 border-amber-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>Fuerza</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCategory('cardio')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      category === 'cardio'
                        ? 'bg-sky-400 text-zinc-950 border-sky-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Cardio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCategory('flexibility')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      category === 'flexibility'
                        ? 'bg-emerald-400 text-zinc-950 border-emerald-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Movilidad</span>
                  </button>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nombre del Ejercicio / Rutina *
                </label>
                <input
                  type="text"
                  placeholder={
                    category === 'cardio'
                      ? 'ej: Carrera Continua 5K / Ciclismo 15K'
                      : category === 'flexibility'
                      ? 'ej: Sesión de Yoga / Estiramientos Isquios'
                      : 'ej: Flexiones Estrictas / Dominadas'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                {errors.title && <span className="text-xs text-rose-400 mt-1 block">{errors.title}</span>}
              </div>

              {/* Indicaciones técnicas */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Pautas Técnicas y Observaciones *
                </label>
                <textarea
                  placeholder="Detalles sobre cadencia, técnica, descanso o zonas de esfuerzo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
                {errors.description && <span className="text-xs text-rose-400 mt-1 block">{errors.description}</span>}
              </div>

              {/* Meta y Unidad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Meta Objetivo *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={maxProgress}
                    onChange={(e) => setMaxProgress(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  {errors.maxProgress && <span className="text-xs text-rose-400 mt-1 block">{errors.maxProgress}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Unidad de Medida
                  </label>
                  <input
                    type="text"
                    placeholder="km, reps, min"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Nivel de Exigencia */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nivel de Exigencia
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['easy', 'medium', 'hard', 'epic'] as WorkoutDifficulty[]).map((d) => {
                    const labels = {
                      easy: 'Baja',
                      medium: 'Media',
                      hard: 'Alta',
                      epic: 'Máxima',
                    };
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`min-h-[38px] text-xs font-semibold rounded-lg border transition-all ${
                          difficulty === d
                            ? 'bg-zinc-800 text-white border-zinc-600'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {labels[d]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Puntos estimados */}
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Puntos de Actividad:</span>
                </div>
                <span className="text-sm font-bold text-amber-400">+{calculatedPoints} pts</span>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-3 rounded-xl active:scale-98 transition-all text-sm flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Guardar Rutina</span>
              </button>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
