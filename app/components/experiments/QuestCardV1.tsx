import { useState } from 'react';
import { Dumbbell, Activity, Heart, ChevronRight, CheckCircle2, Plus, Clock, Award, Flame, Play, Trash2 } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import { Drawer } from 'vaul';
import { useQuestContext } from '../../context/QuestContext';
import { Workout } from '../../types/quest';
import { LiveWorkoutModal } from '../LiveWorkoutModal';

export function QuestCardV1(workout: Workout) {
  const { id, title, description, category, progress, maxProgress, reward, difficulty, timeLeft, completed, unit = '' } = workout;
  const { incrementProgress, completeQuest, deleteQuest } = useQuestContext();
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const progressPercent = Math.min((progress / maxProgress) * 100, 100);
  const isReadyToComplete = progress >= maxProgress && !completed;

  const categoryIcons = {
    cardio: <Activity className="w-4 h-4 text-sky-400" />,
    strength: <Dumbbell className="w-4 h-4 text-amber-400" />,
    flexibility: <Heart className="w-4 h-4 text-emerald-400" />,
  };

  const categoryLabels = {
    cardio: 'Cardio',
    strength: 'Fuerza',
    flexibility: 'Movilidad',
  };

  const difficultyLabels = {
    easy: 'Baja Intensidad',
    medium: 'Media',
    hard: 'Alta Intensidad',
    epic: 'Máxima',
  };

  const difficultyColors = {
    easy: 'text-emerald-400 border-zinc-800 bg-zinc-900',
    medium: 'text-amber-400 border-zinc-800 bg-zinc-900',
    hard: 'text-orange-400 border-zinc-800 bg-zinc-900',
    epic: 'text-purple-400 border-zinc-800 bg-zinc-900',
  };

  const categoryProgressColor = {
    cardio: 'bg-sky-500',
    strength: 'bg-amber-400',
    flexibility: 'bg-emerald-500',
  };

  // Cantidad lógica de incremento rápido en la tarjeta
  const quickAddAmount = category === 'cardio' || unit === 'km' ? 1 : category === 'flexibility' || unit === 'min' ? 5 : 10;

  // Pasos de avance manual contextuales en el cajón de detalle
  const getIncrementSteps = () => {
    if (category === 'cardio' || unit === 'km') {
      return [0.5, 1, 2, 5];
    }
    if (category === 'flexibility' || unit === 'min') {
      return [5, 10, 15, 30];
    }
    return [5, 10, 15, 20];
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!completed) {
      incrementProgress(id, quickAddAmount);
    }
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    completeQuest(id);
  };

  const handleOpenLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiveModalOpen(true);
  };

  return (
    <>
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Trigger asChild>
          <div
            className={`group relative bg-zinc-900 border transition-all duration-200 overflow-hidden cursor-pointer rounded-xl ${
              completed
                ? 'opacity-60 border-zinc-800/60'
                : 'border-zinc-800 hover:border-zinc-700 shadow-sm hover:shadow-md'
            }`}
          >
            {/* Cabecera de la tarjeta */}
            <div className="px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-zinc-900 border border-zinc-800">
                  {categoryIcons[category]}
                </div>
                <span className="font-semibold text-zinc-300 text-xs">
                  {categoryLabels[category]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {completed ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                    ✓ Completada
                  </span>
                ) : (
                  <div className={`px-2 py-0.5 rounded border text-[11px] font-medium ${difficultyColors[difficulty]}`}>
                    {difficultyLabels[difficulty]}
                  </div>
                )}
              </div>
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="text-base font-semibold text-white leading-snug">
                  {title}
                </h3>
                <ChevronRight className="w-4 h-4 text-zinc-500 opacity-60 flex-shrink-0 mt-0.5" />
              </div>

              <p className="text-zinc-400 text-xs mb-3.5 line-clamp-2 leading-relaxed">
                {description}
              </p>

              {/* Barra de progreso */}
              <div className="mb-3.5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-zinc-400 font-medium">Progreso acumulado</span>
                  <span className="text-white font-mono font-semibold">
                    {progress} <span className="text-zinc-500 font-normal">/ {maxProgress} {unit}</span>
                  </span>
                </div>
                <Progress.Root
                  className="relative overflow-hidden bg-zinc-950 rounded-full h-2 border border-zinc-800/60"
                  value={progressPercent}
                >
                  <Progress.Indicator
                    className={`${categoryProgressColor[category]} h-full transition-transform duration-300 ease-out`}
                    style={{ transform: `translateX(-${100 - progressPercent}%)` }}
                  />
                </Progress.Root>
              </div>

              {/* Fila de acción y métricas */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <Award className="w-3.5 h-3.5" />
                    +{reward} pts
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Clock className="w-3 h-3" />
                    {timeLeft}
                  </span>
                </div>

                {/* Acciones directas y ergonómicas (Min. 44px altura) */}
                {!completed && (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isReadyToComplete ? (
                      <button
                        onClick={handleComplete}
                        className="min-h-[40px] px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completar</span>
                      </button>
                    ) : (
                      <>
                        {/* Botón rápido contextual */}
                        <button
                          onClick={handleQuickAdd}
                          title={`Sumar ${quickAddAmount} ${unit}`}
                          className="min-h-[40px] px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-xs rounded-lg active:scale-95 transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>+{quickAddAmount} {unit}</span>
                        </button>

                        {/* Botón directo para iniciar sesión guiada */}
                        <button
                          onClick={handleOpenLive}
                          title="Iniciar sesión en vivo con cronómetro"
                          className="min-h-[40px] px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Entrenar</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Drawer.Trigger>

        {/* Drawer de Detalle Técnico */}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Drawer.Content className="bg-zinc-900 border-t border-zinc-800 text-zinc-200 flex flex-col rounded-t-2xl max-h-[85vh] fixed bottom-0 left-0 right-0 z-50 shadow-2xl overflow-hidden">
            <div className="p-6 overflow-y-auto pb-16">
              <div className="mx-auto w-10 h-1 rounded-full bg-zinc-700 mb-5" />

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700">
                  {categoryIcons[category]}
                </div>
                <div>
                  <Drawer.Title className="text-lg font-bold text-white leading-tight">
                    {title}
                  </Drawer.Title>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-300 uppercase">{categoryLabels[category]}</span>
                    <span>•</span>
                    <span className="font-medium">{difficultyLabels[difficulty]}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeLeft}
                    </span>
                  </div>
                </div>
              </div>

              <Drawer.Description className="text-zinc-300 text-sm mb-5 leading-relaxed bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-800">
                {description}
              </Drawer.Description>

              {/* Progreso en Drawer */}
              <div className="mb-5 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Progreso Real
                  </span>
                  <span className="text-base text-amber-400 font-mono font-bold">
                    {progress} / {maxProgress} {unit}
                  </span>
                </div>
                <Progress.Root
                  className="relative overflow-hidden bg-zinc-900 rounded-full h-2.5 border border-zinc-800"
                  value={progressPercent}
                >
                  <Progress.Indicator
                    className={`${categoryProgressColor[category]} h-full transition-transform duration-300`}
                    style={{ transform: `translateX(-${100 - progressPercent}%)` }}
                  />
                </Progress.Root>
              </div>

              {/* Métricas de Recompensa */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex flex-col items-center justify-center bg-zinc-950/60 py-3 rounded-lg border border-zinc-800">
                  <Award className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-zinc-400 text-[10px] uppercase font-semibold">Puntos de Actividad</span>
                  <span className="text-amber-400 font-bold text-base">+{reward}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-zinc-950/60 py-3 rounded-lg border border-zinc-800">
                  <Flame className="w-4 h-4 text-orange-400 mb-1" />
                  <span className="text-zinc-400 text-[10px] uppercase font-semibold">Experiencia Física</span>
                  <span className="text-white font-bold text-base">+{Math.floor(reward / 10)} XP</span>
                </div>
              </div>

              {/* Acciones */}
              {!completed ? (
                <div className="flex flex-col gap-3">
                  {/* Botón Principal: Iniciar Sesión Guiada */}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsLiveModalOpen(true);
                    }}
                    className="w-full min-h-[48px] bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Iniciar Entrenamiento Guiado</span>
                  </button>

                  {/* Incrementos manuales según disciplina */}
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">
                      Registro manual:
                    </span>
                    <div className="flex gap-1.5">
                      {getIncrementSteps().map((step) => (
                        <button
                          key={step}
                          onClick={() => incrementProgress(id, step)}
                          className="min-h-[36px] px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-lg border border-zinc-700 active:scale-95 transition-all"
                        >
                          +{step} {unit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        completeQuest(id);
                        setIsDrawerOpen(false);
                      }}
                      className="flex-1 min-h-[44px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-2.5 rounded-lg active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Marcar como Completada</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar "${title}" de tu plan?`)) {
                          deleteQuest(id);
                          setIsDrawerOpen(false);
                        }
                      }}
                      title="Eliminar rutina"
                      className="min-h-[44px] px-4 bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/40 font-semibold rounded-lg active:scale-95 transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center text-emerald-400 font-semibold text-xs">
                    ✓ Sesión Completada
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar este registro completado?`)) {
                        deleteQuest(id);
                        setIsDrawerOpen(false);
                      }
                    }}
                    title="Eliminar del historial"
                    className="min-h-[44px] px-3.5 bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 rounded-lg active:scale-95 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Modal de Entrenamiento en Directo Especializado */}
      <LiveWorkoutModal
        workout={workout}
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
      />
    </>
  );
}
