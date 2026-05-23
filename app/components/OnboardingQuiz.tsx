/**
 * ==================================================================================
 * 🛡️ COMPONENTE: OnboardingQuiz.tsx (Cuestionario de Iniciación y Clasificación IPAQ)
 * ==================================================================================
 * Este componente representa el asistente de bienvenida para nuevos aventureros.
 * Su función primordial es clasificar físicamente al usuario en base a hábitos diarios 
 * bajo el estándar internacional IPAQ (International Physical Activity Questionnaire),
 * asignándole una Clase RPG, su nivel de actividad y un multiplicador de recompensas.
 * 
 * Conceptos clave de DAM implementados:
 * 1. Web Speech API: Síntesis de voz sintética nativa y offline para guiar al usuario.
 * 2. Vibration API: Feedback haptico rítmico en botones y en la revelación final.
 * 3. Algoritmo IPAQ simplificado: Puntuación acumulativa para adaptar dificultades del juego.
 * 4. React States & Lifecycle: Flujo guiado en pasos (Wizard) y simulación de carga.
 */

import { useState, useEffect } from 'react';
// Importamos iconos vectoriales SVG de la biblioteca Lucide React (Escalabilidad limpia en pantallas móviles Retina/AMOLED)
import { Shield, Compass, Sparkles, ArrowRight, ChevronRight, Check } from 'lucide-react';

// Declaración de la interfaz de propiedades (Props) requeridas por TypeScript estricto
interface OnboardingQuizProps {
  // Callback ejecutado al terminar el test que propaga el perfil del héroe hacia App.tsx
  onComplete: (profile: {
    rpgClass: 'warrior' | 'ranger' | 'mystic';
    level: 'sedentary' | 'moderate' | 'active';
    multiplier: number;
  }) => void;
}

export function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  // --- ⚙️ ESTADOS REACTIVOS (React States) ---
  // Paso actual del cuestionario (Pasos 1-4: Preguntas, Paso 5: Cálculo animado, Paso 6: Revelación de la Ficha RPG)
  const [step, setStep] = useState(1);
  
  // Paso 1: Clase RPG seleccionada ('warrior' = Fuerza, 'ranger' = Cardio, 'mystic' = Movilidad)
  const [selectedClass, setSelectedClass] = useState<'warrior' | 'ranger' | 'mystic' | null>(null);
  
  // Paso 2 (IPAQ): Horas al día sentado (0 = Alto sedentarismo, 1 = Sedentarismo equilibrado, 2 = Bajo sedentarismo)
  const [sittingHours, setSittingHours] = useState<number | null>(null);
  
  // Paso 3 (IPAQ): Frecuencia de ejercicio semanal en días (0 = 0-1 días, 2 = 2-3 días, 4 = 4+ días)
  const [frequency, setFrequency] = useState<number | null>(null);
  
  // Paso 4 (IPAQ): Intensidad percibida del esfuerzo (0 = Esfuerzo ligero, 2 = Moderado, 4 = Agotador/Vigoroso)
  const [intensity, setIntensity] = useState<number | null>(null);

  // --- 📳 HAPTICS: VIBRATION API ---
  /**
   * Controla el motor de vibración interno del teléfono móvil físico.
   * Proporciona retroalimentación sensorial (tacto) al usuario.
   * @param pattern Duración de vibración en milisegundos o un array de patrones [vibrar, pausar, vibrar]
   */
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn("Vibration not supported or blocked by user gesture restrictions:", e);
      }
    }
  };

  // --- 🎙️ AUDIO: WEB SPEECH API (Text-To-Speech) ---
  /**
   * Lee un texto en voz alta utilizando el sintetizador nativo de Android/iOS.
   * Funciona 100% sin conexión a internet al consumir el motor local del sistema operativo.
   * @param text Cadena de texto que leerá el teléfono móvil.
   */
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        // Cancelamos cualquier locución previa en cola para evitar retardos molestos si el usuario pulsa rápido
        window.speechSynthesis.cancel();
        
        // Creamos la instancia de la locución
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Forzamos voz en Castellano
        utterance.rate = 1.0;    // Velocidad de lectura estándar (normal)
        
        // Ejecutamos la lectura física por el altavoz/auricular
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error:", e);
      }
    }
  };

  // --- 🧭 CICLO DE VIDA (React useEffect) ---
  
  // Efecto Inicial: Se ejecuta una única vez al montar el componente (equivalente a componentDidMount)
  useEffect(() => {
    // Damos la bienvenida sonora rítmica al aventurero
    speak("Bienvenido, aventurero. Completemos tu registro para acceder al gremio.");
  }, []);

  // Efecto de Pantalla de Carga: Monitorea el paso del Wizard
  useEffect(() => {
    // Si el usuario pasa al paso 5 (pantalla de cálculo simulado)
    if (step === 5) {
      // Configuramos un temporizador de 2.5 segundos para procesar las respuestas simulando un análisis riguroso
      const timer = setTimeout(() => {
        setStep(6); // Saltamos al paso 6 (Ficha final)
        vibrate([100, 50, 200]); // Vibración rítmica de éxito
        
        // Generamos el texto traducido al español para la locución sonora final
        const finalClass = selectedClass === 'warrior' ? 'Guerrero' : selectedClass === 'ranger' ? 'Explorador' : 'Místico';
        speak(`¡Cálculo completado! Has sido clasificado como ${finalClass}. Tu senda comienza aquí.`);
      }, 2500);
      
      // Limpieza del temporizador para evitar fugas de memoria (Memory Leaks) en desmontajes rápidos
      return () => clearTimeout(timer);
    }
  }, [step, selectedClass]);

  // --- 📐 ALGORITMO IPAQ: CÓMPUTO DE PERFIL ---
  /**
   * Suma los valores asignados en las respuestas para calcular el rango físico.
   * Clasifica la dificultad del juego y el multiplicador de oro/experiencia.
   * @returns Perfil calculado del héroe (Clase, Nivel de actividad y Factor multiplicador)
   */
  const calculateProfile = () => {
    // Suma lineal simple de los puntos de las 3 preguntas IPAQ (Horas sentado + Frecuencia + Intensidad)
    // Rango mínimo: 0 puntos, Rango máximo: 10 puntos.
    const totalPoints = (sittingHours || 0) + (frequency || 0) + (intensity || 0);
    
    let level: 'sedentary' | 'moderate' | 'active' = 'moderate'; // Por defecto: Moderado
    let multiplier = 1.0; // Multiplicador por defecto: x1.0

    // Clasificación matemática:
    // Si la puntuación es baja (<= 3 puntos): Rutina marcadamente sedentaria.
    if (totalPoints <= 3) {
      level = 'sedentary';
      multiplier = 0.5; // Misiones más cortas/fáciles pero recompensas al 50%
    } 
    // Si la puntuación es alta (>= 8 puntos): Persona muy activa en su vida física.
    else if (totalPoints >= 8) {
      level = 'active';
      multiplier = 1.5; // Misiones más duras/largas pero recompensas infladas al 150% (Pique Élite)
    }

    return {
      rpgClass: selectedClass || 'warrior',
      level,
      multiplier,
    };
  };

  // Manejador del avance de pantalla con respuesta táctil
  const handleNext = () => {
    vibrate(60); // Vibración ultra-rápida de confirmación (haptics de pulsación física)
    setStep((prev) => prev + 1);
  };

  // Si estamos en el paso 6, calculamos el perfil final para inyectarlo en la vista de ficha RPG
  const finalProfile = step === 6 ? calculateProfile() : null;

  return (
    // Contenedor principal con diseño móvil estricto a pantalla completa e inmersivo en colores oscuros
    <div className="absolute inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* 🔮 EFECOS DE DISEÑO: Neones Cyberpunk de fondo difuminados con Blur radial para dar profundidad premium */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* ── BARRA DE PROGRESO DE PASOS (Wizard Flow) ── */}
      {step <= 4 && (
        <div className="px-6 pt-6 pb-2 z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Paso {step} de 4</span>
            <span className="text-xs text-slate-400 font-bold">{Math.round((step / 4) * 100)}% Completado</span>
          </div>
          {/* Barra de progreso de neón fluida */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── CONTENIDO DINÁMICO ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-4 z-10">
        
        {/* ==============================================
            ⚔️ PASO 1: Selección de Senda / Clase RPG
            ============================================== */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">ELIGE TU SENDA</h2>
              <p className="text-sm text-slate-400">¿Qué tipo de entrenamiento es tu prioridad en el gremio?</p>
            </div>

            {/* Listado de cartas interactivas de Clase */}
            <div className="flex flex-col gap-3.5 mt-2">
              
              {/* Opción: Guerrero (Fuerza) */}
              <button
                onClick={() => { setSelectedClass('warrior'); vibrate(50); }}
                className={`p-4.5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 ${
                  selectedClass === 'warrior'
                    ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-xl ${selectedClass === 'warrior' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-purple-400'}`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    Guerrero <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-medium">Fuerza</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Musculación, flexiones, dominadas y entrenamiento de potencia.</p>
                </div>
              </button>

              {/* Opción: Explorador (Cardio) */}
              <button
                onClick={() => { setSelectedClass('ranger'); vibrate(50); }}
                className={`p-4.5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 ${
                  selectedClass === 'ranger'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-xl ${selectedClass === 'ranger' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-blue-400'}`}>
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    Explorador <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">Cardio</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Correr, andar, sprints, natación y resistencia pulmonar.</p>
                </div>
              </button>

              {/* Opción: Místico (Flexibilidad/Movilidad) */}
              <button
                onClick={() => { setSelectedClass('mystic'); vibrate(50); }}
                className={`p-4.5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 ${
                  selectedClass === 'mystic'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-xl ${selectedClass === 'mystic' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    Místico <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">Flexibilidad</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Yoga, estiramientos profundos, movilidad y relajación mental.</p>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* ==============================================
            🪑 PASO 2: Factor Sedentario (Hábitos diarios)
            ============================================== */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">FACTOR SEDENTARIO</h2>
              <p className="text-sm text-slate-400">En tu rutina ordinaria, ¿cuántas horas al día pasas sentado?</p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => { setSittingHours(0); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  sittingHours === 0
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">🪑</span>
                <div>
                  <h4 className="font-bold text-white">Más de 8 horas al día</h4>
                  <p className="text-xs text-slate-400">Sedentarismo alto (ej. trabajo de oficina, estudiar sentado todo el día).</p>
                </div>
              </button>

              <button
                onClick={() => { setSittingHours(1); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  sittingHours === 1
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">🚶</span>
                <div>
                  <h4 className="font-bold text-white">Entre 4 y 8 horas al día</h4>
                  <p className="text-xs text-slate-400">Sedentarismo moderado (ej. tiempo de ordenador equilibrado con paseos).</p>
                </div>
              </button>

              <button
                onClick={() => { setSittingHours(2); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  sittingHours === 2
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">🏃</span>
                <div>
                  <h4 className="font-bold text-white">Menos de 4 horas al día</h4>
                  <p className="text-xs text-slate-400">Bajo sedentarismo (ej. rutina muy activa, de pie o moviéndome continuamente).</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ==============================================
            🏋️ PASO 3: Frecuencia de Ejercicio Semanal
            ============================================== */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">FRECUENCIA DE EJERCICIO</h2>
              <p className="text-sm text-slate-400">¿Cuántos días a la semana realizas al menos 30 min de ejercicio?</p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => { setFrequency(0); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  frequency === 0
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">💤</span>
                <div>
                  <h4 className="font-bold text-white">0 a 1 días a la semana</h4>
                  <p className="text-xs text-slate-400">Entrenamiento escaso o nulo en tu rutina actual.</p>
                </div>
              </button>

              <button
                onClick={() => { setFrequency(2); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  frequency === 2
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">🏋️</span>
                <div>
                  <h4 className="font-bold text-white">2 a 3 días a la semana</h4>
                  <p className="text-xs text-slate-400">Ejercicio moderado y regular.</p>
                </div>
              </button>

              <button
                onClick={() => { setFrequency(4); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  frequency === 4
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-white">4 o más días a la semana</h4>
                  <p className="text-xs text-slate-400">Persona muy activa con entrenamiento regular intenso.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ==============================================
            🌋 PASO 4: Intensidad del Esfuerzo Percibido
            ============================================== */}
        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">INTENSIDAD DE ESFUERZO</h2>
              <p className="text-sm text-slate-400">Al hacer ejercicio, ¿cómo describirías tu nivel de esfuerzo?</p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => { setIntensity(0); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  intensity === 0
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">🍃</span>
                <div>
                  <h4 className="font-bold text-white">Esfuerzo Ligero</h4>
                  <p className="text-xs text-slate-400">Puedo hablar y respirar sin dificultad mientras lo realizo.</p>
                </div>
              </button>

              <button
                onClick={() => { setIntensity(2); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  intensity === 2
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">🔥</span>
                <div>
                  <h4 className="font-bold text-white">Esfuerzo Moderado</h4>
                  <p className="text-xs text-slate-400">Respiro más rápido y sudo levemente, pero puedo hablar.</p>
                </div>
              </button>

              <button
                onClick={() => { setIntensity(4); vibrate(50); }}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  intensity === 4
                    ? 'bg-purple-950/30 border-purple-500'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-2xl">🌋</span>
                <div>
                  <h4 className="font-bold text-white">Esfuerzo Vigoroso</h4>
                  <p className="text-xs text-slate-400">Sudo intensamente, la respiración es agitada y me cuesta hablar.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ==============================================
            ⏳ PASO 5: Pantalla de Carga y Cómputo Algorítmico
            ============================================== */}
        {step === 5 && (
          <div className="flex flex-col items-center justify-center gap-6 py-10">
            <div className="relative flex items-center justify-center">
              {/* Spinner de neón animado con CSS Transitions nativas */}
              <div className="w-24 h-24 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
              {/* Icono parpadeante de escudo en el centro */}
              <Shield className="w-8 h-8 text-purple-400 absolute animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-white mb-2 tracking-wide uppercase">CALCULANDO TU PERFIL</h3>
              <p className="text-sm text-slate-400 animate-pulse">Analizando factores de sedentarismo e IPAQ...</p>
            </div>
          </div>
        )}

        {/* ==============================================
            👑 PASO 6: Revelación Gloriosa de la Ficha RPG
            ============================================== */}
        {step === 6 && finalProfile && (
          <div className="flex flex-col gap-6 items-center">
            
            <div className="text-center animate-bounce-short">
              <span className="text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Perfil de Aventurero Desbloqueado
              </span>
              <h2 className="text-3xl font-black text-white mt-3 uppercase tracking-tight">
                {finalProfile.rpgClass === 'warrior' ? 'Guerrero' : finalProfile.rpgClass === 'ranger' ? 'Explorador' : 'Místico'}
              </h2>
              <p className="text-sm text-purple-400 font-bold mt-1 uppercase tracking-wider">
                Nivel de Actividad: {finalProfile.level === 'sedentary' ? 'Bajo (Sedentario)' : finalProfile.level === 'moderate' ? 'Moderado' : 'Alto (Activo)'}
              </p>
            </div>

            {/* Ficha RPG Premium de Personaje */}
            <div className="w-full max-w-xs bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
              {/* Borde neón superior */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500" />
              
              {/* Esfera con el Emblema de la Clase */}
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-purple-400 flex items-center justify-center text-4xl mb-4 shadow-lg shadow-purple-500/10">
                {finalProfile.rpgClass === 'warrior' ? '🛡️' : finalProfile.rpgClass === 'ranger' ? '🏹' : '🧘'}
              </div>

              {/* Título de Rango RPG */}
              <h4 className="font-black text-white text-lg mb-1">
                {finalProfile.rpgClass === 'warrior' ? 'Guerrero de Acero' : finalProfile.rpgClass === 'ranger' ? 'Cazador del Viento' : 'Monje de la Armonía'}
              </h4>
              
              {/* Descripción rolera */}
              <p className="text-xs text-slate-400 px-2 leading-relaxed mb-4">
                {finalProfile.rpgClass === 'warrior' && 'Tu camino es el de la fuerza. Te esperan pesas, flexiones y el aumento de tu poder muscular.'}
                {finalProfile.rpgClass === 'ranger' && 'Tu camino es la velocidad. Recorrerás caminos y senderos sintiendo el aire y sumando kilómetros.'}
                {finalProfile.rpgClass === 'mystic' && 'Tu camino es el equilibrio. Encontrarás flexibilidad, respiración perfecta y dominio de tu postura.'}
              </p>

              {/* Estadísticas de Dificultad Escalada y Multiplicador Científico IPAQ */}
              <div className="w-full border-t border-slate-800/80 pt-4 flex justify-around">
                <div className="text-center">
                  <span className="block text-xxs uppercase tracking-wider text-slate-500 font-bold">Dificultad</span>
                  <span className="text-sm font-black text-white uppercase mt-0.5 block">
                    {finalProfile.level === 'sedentary' ? 'Fácil' : finalProfile.level === 'moderate' ? 'Media' : 'Avanzada'}
                  </span>
                </div>
                <div className="w-px bg-slate-800" />
                <div className="text-center">
                  <span className="block text-xxs uppercase tracking-wider text-slate-500 font-bold">Recompensas</span>
                  {/* Visualización del multiplicador de Oro/XP dinámico */}
                  <span className="text-sm font-black text-green-400 uppercase mt-0.5 block">
                    x{finalProfile.multiplier.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xxs text-slate-500 text-center px-6 leading-relaxed">
              *Tus misiones y repeticiones diarias han sido escaladas a tu nivel inicial para darte la mejor experiencia deportiva posible.
            </p>
          </div>
        )}
      </div>

      {/* ── MENÚ DE CONTROL Y BOTONES DE AVANCE ── */}
      <div className="p-6 bg-slate-950/80 border-t border-slate-900/60 z-10 flex justify-end">
        
        {/* Botón Paso 1: Bloqueado hasta que seleccione una clase */}
        {step === 1 && (
          <button
            disabled={!selectedClass}
            onClick={handleNext}
            className={`w-full py-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 border transition-all ${
              selectedClass
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-400/20 active:scale-98 shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Elegir esta senda</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Botón Paso 2: Bloqueado hasta que responda horas sentado */}
        {step === 2 && (
          <button
            disabled={sittingHours === null}
            onClick={handleNext}
            className={`w-full py-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 border transition-all ${
              sittingHours !== null
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-400/20 active:scale-98 shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Continuar</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Botón Paso 3: Bloqueado hasta que responda frecuencia de entrenamiento */}
        {step === 3 && (
          <button
            disabled={frequency === null}
            onClick={handleNext}
            className={`w-full py-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 border transition-all ${
              frequency !== null
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-400/20 active:scale-98 shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Continuar</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Botón Paso 4: Lanza la animación de cómputo */}
        {step === 4 && (
          <button
            disabled={intensity === null}
            onClick={() => { vibrate([80, 50, 100]); setStep(5); }}
            className={`w-full py-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 border transition-all ${
              intensity !== null
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-400/20 active:scale-98 shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Calcular mi perfil</span>
            <Sparkles className="w-5 h-5 fill-current" />
          </button>
        )}

        {/* Botón Final del Paso 6: Llama al prop onComplete y entra formalmente al juego */}
        {step === 6 && finalProfile && (
          <button
            onClick={() => {
              vibrate([150, 80, 200]); // Patrón de vibración pesado de confirmación
              onComplete(finalProfile); // Propaga el objeto de configuración del personaje
            }}
            className="w-full py-4.5 rounded-2xl font-black text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 border border-green-400/20 text-white active:scale-97 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 animate-pulse"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>ENTRAR AL GREMIO</span>
          </button>
        )}
      </div>

    </div>
  );
}
