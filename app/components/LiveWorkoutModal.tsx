import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Bell,
  Plus,
  Minus,
  Dumbbell,
  Activity,
  Heart,
  Volume2,
  Timer,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Workout } from '../types/quest';
import { useQuestContext } from '../context/QuestContext';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { voiceCoach } from '../utils/voiceCoach';
import { toast } from 'sonner';

interface LiveWorkoutModalProps {
  workout: Workout;
  isOpen: boolean;
  onClose: () => void;
}

export function LiveWorkoutModal({ workout, isOpen, onClose }: LiveWorkoutModalProps) {
  const { incrementProgress, completeQuest } = useQuestContext();

  const isCardio = workout.category === 'cardio' || workout.unit === 'km';
  const isFlexibility = workout.category === 'flexibility' || workout.unit === 'min';
  const isStrength = !isCardio && !isFlexibility;

  // Modos de registro según disciplina
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');

  // Estados comunes de sesión
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Estados específicos de FUERZA
  const [strengthPhase, setStrengthPhase] = useState<'work' | 'rest'>('work');
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [selectedRestDuration, setSelectedRestDuration] = useState(60);
  const [repsPerSet, setRepsPerSet] = useState(10);
  const [completedSets, setCompletedSets] = useState(0);
  const [strengthLoggedAmount, setStrengthLoggedAmount] = useState(0);
  const [floorTapCount, setFloorTapCount] = useState(0);

  // Estados específicos de CARDIO
  const [cardioDistance, setCardioDistance] = useState(0);

  // Estados específicos de FLEXIBILIDAD
  const [postureInterval, setPostureInterval] = useState(45); // segundos por postura
  const [postureSecondsLeft, setPostureSecondsLeft] = useState(45);
  const [completedPostures, setCompletedPostures] = useState(0);
  const [flexibilityMinutes, setFlexibilityMinutes] = useState(0);

  // Reiniciar estados al abrir
  useEffect(() => {
    if (isOpen) {
      voiceCoach.announceStart(workout.title);
      triggerHaptic('light');
      setSessionActive(true);
      setElapsedSeconds(0);
      setCompletedSets(0);
      setStrengthLoggedAmount(0);
      setFloorTapCount(0);
      setCardioDistance(0);
      setFlexibilityMinutes(0);
      setStrengthPhase('work');
      setRestSecondsLeft(selectedRestDuration);
      setPostureSecondsLeft(postureInterval);
    } else {
      setSessionActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, workout.title]);

  // Manejo del cronómetro general y cuenta atrás
  useEffect(() => {
    if (!isOpen || !sessionActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      // Lógica de descanso en FUERZA
      if (isStrength && strengthPhase === 'rest') {
        setRestSecondsLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            sounds.playBeep(false);
          } else if (prev === 1) {
            sounds.playBeep(true);
            triggerHaptic('success');
            voiceCoach.announceCountdown();
            setStrengthPhase('work');
            toast.info('Fin del descanso: inicia la siguiente serie');
            return selectedRestDuration;
          }
          return prev - 1;
        });
      }

      // Lógica de cambio de postura en FLEXIBILIDAD
      if (isFlexibility) {
        setPostureSecondsLeft((prev) => {
          if (prev <= 3 && prev > 1) {
            sounds.playBeep(false);
          } else if (prev === 1) {
            sounds.playRest();
            triggerHaptic('medium');
            setCompletedPostures((c) => c + 1);
            toast.info('¡Cambio de postura o articulación!');
            return postureInterval;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, sessionActive, isStrength, strengthPhase, isFlexibility, postureInterval, selectedRestDuration]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cálculo de ritmo medio en cardio (min/km)
  const calculatePace = () => {
    if (cardioDistance <= 0 || elapsedSeconds <= 0) return '--:--';
    const paceSeconds = elapsedSeconds / cardioDistance;
    const paceMins = Math.floor(paceSeconds / 60);
    const remSecs = Math.floor(paceSeconds % 60);
    return `${paceMins}:${remSecs.toString().padStart(2, '0')}`;
  };

  // Handlers para FUERZA
  const handleCompleteStrengthSet = () => {
    sounds.playRest();
    triggerHaptic('success');
    const nextSet = completedSets + 1;
    setCompletedSets(nextSet);
    setStrengthLoggedAmount((prev) => prev + repsPerSet);
    setRestSecondsLeft(selectedRestDuration);
    setStrengthPhase('rest');

    voiceCoach.announceSetComplete(nextSet, selectedRestDuration);
  };

  const handleFloorTap = () => {
    sounds.playBeep(true);
    triggerHaptic('medium');
    setFloorTapCount((c) => c + 1);
    setStrengthLoggedAmount((p) => p + 1);
  };

  // Handlers para CARDIO
  const handleAddDistance = (km: number) => {
    sounds.playClick();
    triggerHaptic('light');
    const newDist = parseFloat((cardioDistance + km).toFixed(2));
    setCardioDistance(newDist);
    voiceCoach.announceDistance(newDist);
  };

  // Guardar y volcar resultados
  const handleFinishWorkout = () => {
    let amountToLog = 0;

    if (isStrength) {
      amountToLog = strengthLoggedAmount;
    } else if (isCardio) {
      amountToLog = cardioDistance;
    } else if (isFlexibility) {
      amountToLog = flexibilityMinutes > 0 ? flexibilityMinutes : Math.max(1, Math.round(elapsedSeconds / 60));
    }

    if (amountToLog <= 0) {
      onClose();
      return;
    }

    incrementProgress(workout.id, amountToLog);
    sounds.playQuestComplete();
    triggerHaptic('levelUp');
    voiceCoach.announceFinish(amountToLog, workout.unit || 'unidades');

    toast.success('Sesión registrada con éxito', {
      description: `Has sumado +${amountToLog} ${workout.unit || 'unidades'} a "${workout.title}".`,
    });

    if (workout.progress + amountToLog >= workout.maxProgress) {
      setTimeout(() => {
        completeQuest(workout.id);
      }, 600);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white rounded-2xl p-5 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Cabecera Técnica */}
        <DialogHeader className="pb-3 border-b border-zinc-800 pr-8 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 mb-0.5">
                {isCardio ? (
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                ) : isFlexibility ? (
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {isCardio
                    ? 'Sesión Aeróbica'
                    : isFlexibility
                    ? 'Movilidad y Flexibilidad'
                    : 'Entrenamiento de Fuerza'}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-white leading-tight">
                {workout.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5">
                Meta: {workout.progress} / {workout.maxProgress} {workout.unit}
              </DialogDescription>
            </div>

            {/* Botón de prueba de locución */}
            <button
              onClick={() => {
                voiceCoach.announceStart(workout.title);
                triggerHaptic('light');
                toast.info('Voz del entrenador activa');
              }}
              title="Escuchar locución del entrenador"
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px]">Voz</span>
            </button>
          </div>
        </DialogHeader>

        {/* ── CUERPO PRINCIPAL ESPECIALIZADO ── */}
        <div className="flex-1 overflow-y-auto py-3 pr-0.5 flex flex-col justify-between gap-4">
          {/* ========================================================
              VISTA 1: FUERZA (Series, Repeticiones y Descansos)
             ======================================================== */}
          {isStrength && (
            <div className="flex flex-col gap-3.5">
              {/* Selector de modo para fuerza */}
              <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => {
                    setActiveTab('primary');
                    sounds.playClick();
                  }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'primary'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Registro por Series
                </button>
                <button
                  onClick={() => {
                    setActiveTab('secondary');
                    sounds.playClick();
                  }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'secondary'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Pulsador de Suelo
                </button>
              </div>

              {activeTab === 'primary' ? (
                <>
                  {/* Visor de serie y descanso */}
                  <div className="flex flex-col items-center justify-center py-5 px-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="mb-1 text-xs font-semibold">
                      {strengthPhase === 'rest' ? (
                        <span className="text-sky-400 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5" /> Descanso entre series
                        </span>
                      ) : (
                        <span className="text-amber-400">
                          Serie {completedSets + 1} en curso
                        </span>
                      )}
                    </div>

                    <div className="text-5xl font-mono font-bold tracking-tight text-white my-1 select-none">
                      {strengthPhase === 'rest' ? formatTime(restSecondsLeft) : formatTime(elapsedSeconds)}
                    </div>

                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
                      {strengthPhase === 'rest' ? 'Tiempo de recuperación' : 'Tiempo total transcurrido'}
                    </span>
                  </div>

                  {/* Configuración de repeticiones por serie */}
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Repeticiones por Serie</span>
                      <span className="text-[11px] text-zinc-400">Objetivo para esta tanda</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRepsPerSet((r) => Math.max(1, r - 5))}
                        className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700 active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-amber-400 text-base">
                        {repsPerSet}
                      </span>
                      <button
                        onClick={() => setRepsPerSet((r) => r + 5)}
                        className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white border border-zinc-700 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Selector de tiempo de descanso */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-zinc-400">
                      Pausa de recuperación:
                    </span>
                    <div className="flex gap-1.5">
                      {[30, 45, 60, 90].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => {
                            setSelectedRestDuration(sec);
                            if (strengthPhase === 'rest') setRestSecondsLeft(sec);
                            sounds.playClick();
                          }}
                          className={`min-h-[34px] px-2.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedRestDuration === sec
                              ? 'bg-amber-400 text-zinc-950 font-bold'
                              : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botón de acción ergonómico */}
                  {strengthPhase === 'rest' ? (
                    <button
                      onClick={() => {
                        setStrengthPhase('work');
                        sounds.playClick();
                        triggerHaptic('medium');
                      }}
                      className="w-full min-h-[48px] rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Reanudar Serie {completedSets + 1}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteStrengthSet}
                      className="w-full min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completar Serie {completedSets + 1} (+{repsPerSet} {workout.unit || 'reps'})</span>
                    </button>
                  )}
                </>
              ) : (
                /* Pulsador Manos Libres para Suelo */
                <div className="flex flex-col items-center gap-3">
                  <p className="text-xs text-zinc-400 text-center leading-relaxed">
                    Coloca el dispositivo en el suelo bajo el pecho para contar flexiones o fondos al descender.
                  </p>
                  <button
                    onClick={handleFloorTap}
                    className="w-full h-44 rounded-xl border border-zinc-700 bg-zinc-950 hover:border-amber-400/60 active:scale-98 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="text-6xl font-mono font-bold text-amber-400">
                      {floorTapCount}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                      Pulsar para sumar (+1)
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VISTA 2: CARDIO (Distancia, Tiempo y Ritmo Medio)
             ======================================================== */}
          {isCardio && (
            <div className="flex flex-col gap-4">
              {/* Cuadrícula de métricas en tiempo real */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Timer className="w-3.5 h-3.5 text-sky-400" /> Tiempo
                  </span>
                  <span className="text-3xl font-mono font-bold text-white">
                    {formatTime(elapsedSeconds)}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      onClick={() => {
                        setSessionActive((prev) => !prev);
                        sounds.playClick();
                        triggerHaptic('light');
                      }}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1"
                    >
                      {sessionActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{sessionActive ? 'Pausar' : 'Reanudar'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setElapsedSeconds(0);
                        sounds.playClick();
                      }}
                      title="Reiniciar tiempo"
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" /> Ritmo Estimado
                  </span>
                  <span className="text-3xl font-mono font-bold text-amber-400">
                    {calculatePace()}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5">min / km</span>
                </div>
              </div>

              {/* Visor de distancia acumulada */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-300 block">Distancia Acumulada</span>
                  <span className="text-[11px] text-zinc-500">Objetivo: {workout.maxProgress} km</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-white">
                    {cardioDistance.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-sky-400 ml-1">km</span>
                </div>
              </div>

              {/* Botones de incremento ergonómico de distancia */}
              <div>
                <span className="text-xs font-medium text-zinc-400 block mb-2">
                  Sumar distancia recorrida:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[0.5, 1.0, 2.0, 5.0].map((km) => (
                    <button
                      key={km}
                      onClick={() => handleAddDistance(km)}
                      className="min-h-[44px] py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-semibold text-sm rounded-lg border border-zinc-700 active:scale-95 transition-all"
                    >
                      +{km} km
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VISTA 3: MOVILIDAD / FLEXIBILIDAD (Posturas e Intervalos)
             ======================================================== */}
          {isFlexibility && (
            <div className="flex flex-col gap-4">
              {/* Temporizador de cambio de postura */}
              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Mantenimiento de Postura
                </span>
                <span className="text-5xl font-mono font-bold text-white my-1">
                  {postureSecondsLeft}s
                </span>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider">
                  Posturas completadas: {completedPostures}
                </span>
              </div>

              {/* Selector de intervalo por postura */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-zinc-400">
                  Duración por postura:
                </span>
                <div className="flex gap-1.5">
                  {[30, 45, 60, 90].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        setPostureInterval(sec);
                        setPostureSecondsLeft(sec);
                        sounds.playClick();
                      }}
                      className={`min-h-[34px] px-2.5 rounded-lg text-xs font-semibold transition-all ${
                        postureInterval === sec
                          ? 'bg-emerald-500 text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Registro de bloques de minutos */}
              <div>
                <span className="text-xs font-medium text-zinc-400 block mb-2">
                  Sumar minutos a la sesión:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setFlexibilityMinutes((m) => m + mins);
                        sounds.playClick();
                        triggerHaptic('light');
                      }}
                      className="min-h-[44px] py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-semibold text-sm rounded-lg border border-zinc-700 active:scale-95 transition-all"
                    >
                      +{mins} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BOTÓN FINAL DE GUARDAR SESIÓN ── */}
          <div className="pt-3 border-t border-zinc-800 flex-shrink-0">
            <button
              onClick={handleFinishWorkout}
              className="w-full min-h-[48px] bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                Guardar Sesión (
                {isStrength
                  ? `+${strengthLoggedAmount} ${workout.unit || 'reps'}`
                  : isCardio
                  ? `+${cardioDistance.toFixed(2)} km`
                  : `+${
                      flexibilityMinutes > 0
                        ? flexibilityMinutes
                        : Math.max(1, Math.round(elapsedSeconds / 60))
                    } min`}
                )
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
