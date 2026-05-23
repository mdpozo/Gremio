/**
 * ==================================================================================
 * 🏰 COMPONENTE RAÍZ: App.tsx (Orquestador Central y Guardián del Estado Global)
 * ==================================================================================
 * Este es el componente principal de QuestFit. Actúa como el cerebro y "Single Source of Truth" 
 * (Fuente Única de Verdad) de la aplicación. Centraliza todos los estados reactivos, coordina 
 * las transiciones de pantalla (Onboarding Quiz ➔ Tablón principal ➔ Pantalla de Ejercicio Activo)
 * y gestiona la persistencia local de datos del jugador.
 * 
 * Conceptos clave de DAM implementados:
 * 1. Levantamiento del Estado (State Lifting): Centralización de variables dinámicas para distribuirse a hijos.
 * 2. API Web Storage (localStorage): Serialización y deserialización para persistencia offline permanente.
 * 3. Algoritmo de Escalado Dinámico: Transformación en tiempo real del tablón de misiones según multiplicador.
 * 4. Animaciones y Avisos Interactivos: Disparadores de Toast animados ante hitos de Level Up.
 */

import { useState, useEffect } from 'react';
// Importamos Sonner, un gestor de notificaciones Toast animado y no intrusivo
import { Toaster, toast } from 'sonner';

// Importación de componentes de la interfaz de usuario (Componentización limpia de React)
import { QuestHeader } from './components/QuestHeader';
import { QuestCardV1 } from './components/experiments/QuestCardV1';
import { BottomNav } from './components/BottomNav';
import { DesignPlayground } from './components/DesignPlayground';
import { ActiveWorkoutSession } from './components/ActiveWorkoutSession';
import { OnboardingQuiz } from './components/OnboardingQuiz';

// 🧪 MODO LABORATORIO: Cambia esto a 'true' para suspender la app y testear componentes aislados
const SHOW_PLAYGROUND = false;

// Definición estricta de tipo en TypeScript para las Misiones
type Quest = {
  id: number;
  title: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility';
  progress: number;
  maxProgress: number; // Meta física requerida (Km, Repeticiones o Minutos)
  reward: number;      // Recompensa base en monedas de oro
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  timeLeft: string;
};

// Datos semilla estáticos (Se escalarán matemáticamente en tiempo de render según el test del usuario)
const INITIAL_QUESTS: Quest[] = [
  {
    id: 1,
    title: 'Maratón del Guerrero',
    description: 'Corre 5km sin detenerte. Demuestra tu resistencia y velocidad.',
    category: 'cardio' as const,
    progress: 0,
    maxProgress: 5,
    reward: 500,
    difficulty: 'hard' as const,
    timeLeft: '2d 5h',
  },
  {
    id: 2,
    title: 'Forja de Acero',
    description: 'Completa 50 flexiones y 30 dominadas para fortalecer tus músculos.',
    category: 'strength' as const,
    progress: 0,
    maxProgress: 80,
    reward: 800,
    difficulty: 'epic' as const,
    timeLeft: '1d 12h',
  },
  {
    id: 3,
    title: 'Yoga del Amanecer',
    description: 'Realiza una sesión de 30 minutos de yoga al amanecer.',
    category: 'flexibility' as const,
    progress: 0,
    maxProgress: 30,
    reward: 300,
    difficulty: 'medium' as const,
    timeLeft: '3d',
  },
  {
    id: 4,
    title: 'Sprints del Cazador',
    description: 'Completa 10 sprints de 100 metros con descansos de 1 minuto.',
    category: 'cardio' as const,
    progress: 0,
    maxProgress: 10,
    reward: 450,
    difficulty: 'medium' as const,
    timeLeft: '1d 8h',
  },
  {
    id: 5,
    title: 'Levantamiento Titánico',
    description: 'Alcanza un nuevo récord personal en peso muerto.',
    category: 'strength' as const,
    progress: 0,
    maxProgress: 1,
    reward: 1000,
    difficulty: 'epic' as const,
    timeLeft: '5d',
  },
  {
    id: 6,
    title: 'Estiramientos del Sabio',
    description: 'Mantén cada postura de estiramiento por 60 segundos.',
    category: 'flexibility' as const,
    progress: 0,
    maxProgress: 8,
    reward: 250,
    difficulty: 'easy' as const,
    timeLeft: '2d',
  },
];

export default function App() {
  // --- ⚙️ ESTADOS REACTIVOS (React States) ---
  // Filtro de categorías activo en la cabecera ('all', 'cardio', 'strength', 'flexibility')
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Tablón interno de misiones (inicializado con la semilla estática)
  const [questsState, setQuestsState] = useState<Quest[]>(INITIAL_QUESTS);
  
  // Almacena la misión que el usuario está entrenando físicamente en este instante (null = en el tablón)
  const [activeWorkoutQuest, setActiveWorkoutQuest] = useState<Quest | null>(null);

  // --- 💾 PERSISTENCIA DE DATOS (API localStorage) ---
  // Usamos inicialización diferida por función (Lazy Initial State) para no leer el disco duro en cada re-render.
  
  // 1. Determina si el usuario ya ha superado el quiz científico inicial
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('questfit_onboarded') === 'true';
  });

  // 2. Clase RPG del héroe (Guerrero, Explorador, Místico)
  const [playerClass, setPlayerClass] = useState<'warrior' | 'ranger' | 'mystic' | null>(() => {
    return localStorage.getItem('questfit_class') as any;
  });

  // 3. Multiplicador físico resultante de su sedentarismo en el test IPAQ (Sedentario=0.5, Activo=1.5)
  const [playerMultiplier, setPlayerMultiplier] = useState<number>(() => {
    return parseFloat(localStorage.getItem('questfit_multiplier') || '1.0');
  });

  // 4. Oro acumulado por el jugador
  const [gold, setGold] = useState<number>(() => {
    return parseInt(localStorage.getItem('questfit_gold') || '0', 10);
  });

  // 5. Experiencia acumulada (XP)
  const [xp, setXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('questfit_xp') || '0', 10);
  });

  // 6. Nivel RPG del jugador
  const [playerRpgLevel, setPlayerRpgLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('questfit_player_rpg_level') || '1', 10);
  });

  // --- 🧭 ESCUCHADORES DE CAMBIOS (React useEffects) ---
  
  // Guarda el oro en LocalStorage de manera síncrona cada vez que cambie
  useEffect(() => {
    localStorage.setItem('questfit_gold', gold.toString());
  }, [gold]);

  // Maneja la experiencia (XP) y calcula la subida de nivel automática
  useEffect(() => {
    localStorage.setItem('questfit_xp', xp.toString());
    
    // ALGORITMO DE LEVEL UP: Cada 100 XP exactos acumulados subes 1 Nivel RPG.
    const calculatedLevel = Math.floor(xp / 100) + 1;
    
    // Si el nivel calculado supera al nivel actual, lanzamos una gloriosa felicitación
    if (calculatedLevel !== playerRpgLevel) {
      setPlayerRpgLevel(calculatedLevel);
      localStorage.setItem('questfit_player_rpg_level', calculatedLevel.toString());
      
      // Toast premium y sonoro (se complementa con el speak al subir de nivel)
      toast.success("¡SUBIDA DE NIVEL!", {
        description: `¡Has alcanzado el Nivel ${calculatedLevel}! Sigue así, héroe del gremio.`,
        duration: 6000,
      });
    }
  }, [xp, playerRpgLevel]);

  // --- 🎮 MANEJADORES DE ACCIONES (Callbacks) ---

  /**
   * Finaliza el test interactivo IPAQ de Onboarding.
   * Guarda los resultados del test en el disco y da de alta al jugador.
   */
  const handleOnboardingComplete = (profile: {
    rpgClass: 'warrior' | 'ranger' | 'mystic';
    level: 'sedentary' | 'moderate' | 'active';
    multiplier: number;
  }) => {
    localStorage.setItem('questfit_onboarded', 'true');
    localStorage.setItem('questfit_class', profile.rpgClass);
    localStorage.setItem('questfit_multiplier', profile.multiplier.toString());
    localStorage.setItem('questfit_level_label', profile.level);
    
    setPlayerClass(profile.rpgClass);
    setPlayerMultiplier(profile.multiplier);
    setIsOnboarded(true);

    toast.success("¡Bienvenido al Gremio!", {
      description: `Has desbloqueado tu clase y tus misiones han sido ajustadas.`,
      duration: 5000,
    });
  };

  /**
   * Dispara el inicio de un entrenamiento.
   * Carga los datos de la tarjeta en la pantalla de entrenamiento activo y despierta los sensores.
   */
  const handleStartQuest = (quest: Quest) => {
    setActiveWorkoutQuest(quest);
  };

  /**
   * Completa el entrenamiento en marcha, calcula el botín obtenido con el multiplicador IPAQ
   * y añade Oro y Experiencia al monedero del jugador.
   */
  const handleCompleteQuest = (id: number, finalProgress: number) => {
    // Actualizamos el progreso de la misión en el estado local
    const updatedQuests = questsState.map((q) => {
      if (q.id === id) {
        return { ...q, progress: finalProgress };
      }
      return q;
    });
    setQuestsState(updatedQuests);

    const completedQuest = questsState.find((q) => q.id === id);
    setActiveWorkoutQuest(null); // Cerramos la pantalla del entrenamiento activo

    if (completedQuest) {
      // --- FÓRMULA DE RECOMPENSA DE GAMIFICACIÓN ---
      const baseGold = completedQuest.reward;
      // Recompensa real: Multiplicamos el oro base por el factor IPAQ del usuario (Ej: Sedentario gana x0.5, Élite gana x1.5)
      const rewardedGold = Math.floor(baseGold * playerMultiplier);
      // Conversión de XP: Por cada 10 monedas de oro ganadas, se otorga 1 punto de Experiencia (XP)
      const rewardedXp = Math.floor(rewardedGold / 10);

      setGold((prev) => prev + rewardedGold);
      setXp((prev) => prev + rewardedXp);

      toast.success(`¡Misión Completada!`, {
        description: `Has ganado +${rewardedGold} Oro y +${rewardedXp} XP de rango.`,
        duration: 5000,
      });
    }
  };

  // --- 📐 ALGORITMO DIFICULTAD ADAPTATIVA ---
  /**
   * Coge la semilla de misiones original y modifica dinámicamente sus metas en tiempo de renderizado
   * multiplicando las metas por el factor del usuario.
   * - Sedentario (x0.5): La misión de 5km de cardio pasa a pedir 2.5km.
   * - Élite (x1.5): Pide 7.5km.
   * Esto proporciona inclusión y accesibilidad deportiva para evitar desmotivación o lesiones.
   */
  const scaledQuests = questsState.map((quest) => {
    let scaledMax = quest.maxProgress;
    
    // Cardio redondeado a un solo decimal (ej. 2.5 km)
    if (quest.category === 'cardio') {
      scaledMax = Math.round(quest.maxProgress * playerMultiplier * 10) / 10;
    } 
    // Fuerza y flexibilidad redondeado a números enteros (ej. repeticiones)
    else {
      scaledMax = Math.round(quest.maxProgress * playerMultiplier);
    }
    
    // Forzamos mínimo una unidad de meta para evitar división por cero en barra de progreso
    scaledMax = Math.max(scaledMax, 1);
    
    return {
      ...quest,
      maxProgress: scaledMax,
    };
  });

  // Filtramos el tablón según la categoría seleccionada en la cabecera
  const filteredQuests = activeFilter === 'all'
    ? scaledQuests
    : scaledQuests.filter(quest => quest.category === activeFilter);

  return (
    // Contenedor contenedor padre responsivo de centrado absoluto
    <div className="min-h-[100dvh] bg-slate-950/50 flex justify-center items-center sm:p-4">
      
      {/* 📱 CONTENEDOR MÓVIL ESTRICTO (Mobile-First Frame)
          w-full a pantalla completa en teléfonos, y bloqueado en max-w-md (448px) en pantallas de PC
          para simular un iPhone/Android en el monitor de cara a la defensa del tribunal. */}
      <div className="w-full h-[100dvh] sm:max-w-md sm:h-[90vh] sm:rounded-3xl sm:border sm:border-quest-border bg-quest-bg text-quest-text-main font-sans transition-colors duration-500 relative overflow-hidden flex flex-col shadow-2xl">
        
        {/* Renderizado de notificaciones animadas en la zona superior central de la app móvil */}
        <Toaster position="top-center" richColors />

        {/* ── MÁQUINA DE ESTADO DE NAVEGACIÓN (Wizard Render) ── */}
        {!isOnboarded ? (
          // Vista A: El usuario no ha hecho el quiz. Lanzamos el Onboarding IPAQ.
          <OnboardingQuiz onComplete={handleOnboardingComplete} />
        ) : activeWorkoutQuest ? (
          // Vista B: Ejercicio en marcha. Cargamos los sensores GPS y el cronómetro.
          <ActiveWorkoutSession
            quest={activeWorkoutQuest}
            onClose={() => setActiveWorkoutQuest(null)}
            onCompleteQuest={handleCompleteQuest}
          />
        ) : SHOW_PLAYGROUND ? (
          // Vista C (Laboratorio): Renderiza el entorno aislado para pruebas de diseño Front-End
          <DesignPlayground />
        ) : (
          // Vista D (Principal): El tablón de misiones tradicional de QuestFit
          <>
            {/* Cabecera interactiva con filtro de rol */}
            <QuestHeader
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Listado deslizable de misiones disponibles */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-quest-header-from via-quest-header-via to-quest-header-from p-4 transition-colors duration-500">
              
              {/* ========================================================
                  👑 FICHA VISUAL DE PERFIL RPG DEL JUGADOR
                  ======================================================== */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3">
                  {/* Esfera del Avatar según la Senda elegida */}
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-purple-500/30 flex items-center justify-center text-2xl shadow-inner animate-pulse-slow">
                    {playerClass === 'warrior' ? '🛡️' : playerClass === 'ranger' ? '🏹' : '🧘'}
                  </div>
                  <div>
                    {/* Clase y Nivel de Jugador */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm capitalize">
                        {playerClass === 'warrior' ? 'Guerrero' : playerClass === 'ranger' ? 'Explorador' : playerClass === 'mystic' ? 'Místico' : 'Aventurero'}
                      </span>
                      <span className="text-xxs font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Nivel {playerRpgLevel}
                      </span>
                    </div>
                    {/* Barra de progreso interactiva de XP (Porcentaje restante para subir) */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-purple-500 h-full transition-all duration-300"
                          style={{ width: `${xp % 100}%` }}
                        />
                      </div>
                      <span className="text-xxs text-slate-400 font-medium">{(xp % 100)} / 100 XP</span>
                    </div>
                  </div>
                </div>

                {/* Monedero de Oro del Gremio */}
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl">
                  <span className="text-lg">🪙</span>
                  <span className="font-extrabold text-yellow-400 text-sm">{gold} <span className="text-xxs opacity-75 font-bold">Oro</span></span>
                </div>
              </div>

              {/* Grid vertical de Tarjetas de Misiones */}
              <div className="flex flex-col gap-4">
                {filteredQuests.map((quest) => (
                  <QuestCardV1 
                    key={quest.id} 
                    {...quest} 
                    onStartQuest={() => handleStartQuest(quest)}
                  />
                ))}
              </div>

              {/* Alerta visual en caso de que no haya misiones en una categoría */}
              {filteredQuests.length === 0 && (
                <div className="text-center py-20 animate-fade-in">
                  <p className="text-quest-text-muted text-xl">No hay misiones disponibles</p>
                </div>
              )}
            </main>
          </>
        )}

        {/* ── MENÚ TÁCTIL INFERIOR DE NAVEGACIÓN ── */}
        {!SHOW_PLAYGROUND && !activeWorkoutQuest && isOnboarded && <BottomNav />}
      </div>
    </div>
  );
}