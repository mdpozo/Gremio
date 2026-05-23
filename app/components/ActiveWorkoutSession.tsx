/**
 * ==================================================================================
 * 🏃 COMPONENTE: ActiveWorkoutSession.tsx (Sesión de Entrenamiento Activo e Inmersivo)
 * ==================================================================================
 * Este componente es el núcleo operativo deportivo de la aplicación.
 * Proporciona una interfaz a pantalla completa de alto contraste diseñada para exteriores,
 * con cronómetro deportivo gigante, barras de progreso y APIs de hardware activas.
 * 
 * Conceptos clave de DAM implementados:
 * 1. API de Geolocalización Web (`watchPosition`): Lectura del chip GPS físico en tiempo real.
 * 2. Fórmula de Haversine: Cálculo trigonométrico espacial para medir distancias en una esfera.
 * 3. Screen Wake Lock API: Bloqueo del apagado de pantalla mientras el entrenamiento esté activo.
 * 4. Gestión de Limpieza (Cleanup): Cancelación estricta de relojes y escuchadores GPS 
 *    para evitar fugas de memoria (Memory Leaks) en entornos móviles.
 */

import { useState, useEffect, useRef } from 'react';
// Importamos iconos vectoriales SVG de Lucide React para una visualización premium libre de pixelado
import { Play, Pause, Volume2, VolumeX, Sun, ShieldAlert, ArrowLeft, CheckCircle, Plus } from 'lucide-react';
// Importamos la barra de progreso accesible de la suite Radix UI
import * as Progress from '@radix-ui/react-progress';

// Definición de tipos estricta para la Misión que viaja en las propiedades
type Quest = {
  id: number;
  title: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility';
  progress: number;
  maxProgress: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  timeLeft: string;
};

// Interfaz de propiedades que el componente padre (App.tsx) debe inyectar
interface ActiveWorkoutSessionProps {
  quest: Quest; // Datos de la misión seleccionada
  onClose: () => void; // Callback para cerrar y abortar la sesión
  onCompleteQuest: (id: number, finalProgress: number) => void; // Callback al finalizar y reclamar el botín
}

export function ActiveWorkoutSession({
  quest,
  onClose,
  onCompleteQuest
}: ActiveWorkoutSessionProps) {
  // --- ⚙️ ESTADOS REACTIVOS (React States) ---
  // Progreso físico del usuario en la sesión actual (Ej: kilómetros recorridos o repeticiones hechas)
  const [progress, setProgress] = useState(quest.progress);
  
  // Segundos transcurridos desde que inició el entrenamiento
  const [seconds, setSeconds] = useState(0);
  
  // Estado de marcha del cronómetro (true = Activo, false = Pausado)
  const [isRunning, setIsRunning] = useState(true);
  
  // Modo de Alto Contraste para Exterior (Sunlight anti-glare) para leer bajo la luz solar directa
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  // Estado para silenciar las narraciones automáticas de voz sintética
  const [isMuted, setIsMuted] = useState(false);
  
  // Control de visibilidad del modal de advertencia de salida accidental
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // --- 🛰️ SENSORES GPS Y DISTANCIA (Fase 2) ---
  // Última coordenada registrada para medir diferencias de trayecto { latitude, longitude }
  const [lastCoords, setLastCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  
  // Almacena errores de permisos o fallos de lectura del chip GPS físico
  const [gpsError, setGpsError] = useState<string | null>(null);
  
  // Flag que indica si el chip GPS del móvil está respondiendo con lecturas válidas
  const [isTrackingGps, setIsTrackingGps] = useState(false);
  
  // Controla el siguiente hito de kilómetro para disparar la alerta sonora y física (Inicialmente 1.0 km)
  const [nextKilometerMark, setNextKilometerMark] = useState(1.0);

  // --- 🔒 REFS (Persistencia de punteros de hardware en renders de React) ---
  // Guarda el puntero del bloqueo de pantalla nativo (Wake Lock)
  const wakeLockRef = useRef<any>(null);
  
  // Guarda el identificador del temporizador del cronómetro (Interval ID)
  const timerIntervalRef = useRef<any>(null);

  // --- 📐 VALORES CALCULADOS EN TIEMPO DE RENDER ---
  // Porcentaje completado de la misión (bloqueado matemáticamente entre 0% y 100%)
  const progressPercent = Math.min((progress / quest.maxProgress) * 100, 100);
  
  // Determina si el aventurero ha completado el 100% de la meta requerida
  const isCompleted = progress >= quest.maxProgress;

  // --- 🎙️ AUDIO: WEB SPEECH API (Síntesis de Voz) ---
  /**
   * Lee textos por altavoz de forma local y offline, garantizando total gratuidad.
   * @param text Mensaje que leerá el sintetizador de voz.
   */
  const speak = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    try {
      // Cancelamos colas anteriores para evitar retardos molestos si ocurren eventos rápidos consecutivos
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  };

  // --- 📳 HAPTICS: VIBRATION API ---
  /**
   * Genera pulsaciones vibratorias físicas en la carcasa del teléfono móvil.
   * @param pattern Milisegundos de vibración o secuencia [vibrar, pausar, vibrar]
   */
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn("Vibration failed:", e);
      }
    }
  };

  // --- 🔒 SEGURIDAD: SCREEN WAKE LOCK API ---
  /**
   * Solicita al sistema operativo móvil mantener la pantalla siempre encendida.
   * Evita que el móvil se bloquee o apague la pantalla mientras el usuario corre o entrena en la calle.
   */
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        const lock = await (navigator as any).wakeLock.request('screen');
        wakeLockRef.current = lock;
        console.log("🔒 Wake Lock Activo: La pantalla permanecerá encendida.");
      } catch (err) {
        console.warn("Wake lock failed:", err);
      }
    }
  };

  /**
   * Libera el bloqueo de pantalla, permitiendo al sistema operativo apagarla
   * normalmente para ahorrar batería cuando el entrenamiento termine o se pause.
   */
  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log("🔓 Wake Lock Liberado: Pantalla libre para apagarse.");
      } catch (err) {
        console.error("Error releasing wake lock:", err);
      }
    }
  };

  // --- 📐 MATEMÁTICAS ESPACIALES: FÓRMULA DE HAVERSINE ---
  /**
   * Calcula la distancia geodésica real en kilómetros entre dos puntos en una esfera (la Tierra)
   * basándose en sus coordenadas decimales de Latitud y Longitud.
   * Reemplaza al teorema de Pitágoras convencional, que falla por la curvatura terrestre.
   */
  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio medio de la Tierra en kilómetros
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
    // Ecuación trigonométrica del Haversine
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Devuelve la distancia exacta recorrida en kilómetros
  };

  // --- 🛰️ EFECTO GPS: ESCUCHADOR SATELITAL ( watchPosition ) ---
  useEffect(() => {
    // Rendimiento y Batería: Solo activamos el chip GPS si la misión es de Cardio y está en marcha
    if (quest.category !== 'cardio' || !isRunning || isCompleted) {
      setIsTrackingGps(false);
      return;
    }

    if (!('geolocation' in navigator)) {
      setGpsError("GPS no soportado en este dispositivo");
      return;
    }

    setIsTrackingGps(true);
    setGpsError(null);

    // Activamos la geolocalización física y guardamos el puntero watchId
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`🛰️ Coordenadas GPS: Lat ${latitude}, Lon ${longitude} (Precisión: ${accuracy}m)`);

        // FILTRO 1 (Filtro de Precisión): Si la señal satelital es muy mala (> 50m), descartamos 
        // para evitar "saltos" fantasmas estando quieto dentro de casa.
        if (accuracy && accuracy > 50) {
          console.warn("Precisión GPS baja, ignorando punto...");
          return;
        }

        setLastCoords((prev) => {
          if (prev) {
            // Calculamos la distancia recorrida en este tramo usando Haversine
            const distanceDelta = calculateHaversine(prev.latitude, prev.longitude, latitude, longitude);
            
            // FILTRO 2 (Filtro de Ruido):
            // - Si es menor a 2 metros (0.002 km) es ruido de pulso o balanceo: se ignora.
            // - Si es mayor a 500 metros (0.5 km) en 1 segundo es un salto satelital imposible: se descarta.
            if (distanceDelta > 0.002 && distanceDelta < 0.5) {
              setProgress((currentProgress) => {
                // Redondeamos con precisión a 2 decimales para evitar problemas de coma flotante de JS
                const newProgress = Math.min(
                  Math.round((currentProgress + distanceDelta) * 100) / 100,
                  quest.maxProgress
                );
                return newProgress;
              });
            }
          }
          return { latitude, longitude };
        });
      },
      (error) => {
        console.error("GPS Error:", error);
        // Error de permisos: Clave en navegadores web en orígenes inseguros (HTTP)
        if (error.code === 1) {
          setGpsError("Permiso de Ubicación denegado.");
        } else {
          setGpsError("Buscando señal satelital...");
        }
        setIsTrackingGps(false);
      },
      {
        enableHighAccuracy: true, // Forzamos el uso de antenas GPS y satélites en vez de antenas móviles/Wi-Fi
        timeout: 10000,           // Lanza error de tiempo de espera si tarda más de 10s en dar coordenadas
        maximumAge: 0,            // Fuerza la obtención de un punto nuevo real en vez de coordenadas de caché
      }
    );

    // CLEANUP (Limpieza obligatoria de DAM): Apagamos el chip GPS en el desmontaje o pausa
    // para evitar un drenaje catastrófico de la batería del móvil del usuario.
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [quest.category, isRunning, isCompleted, quest.maxProgress]);

  // --- 📳 EFECTO: ALERTAS DE HITO SENSORIAL COMPARTIDO (Voz y Vibración) ---
  useEffect(() => {
    // Si superamos un kilómetro entero (1.0, 2.0 km, etc.) en cardio
    if (quest.category === 'cardio' && progress >= nextKilometerMark) {
      // 1. Respuesta Háptica: Doble vibración pesada contundente
      vibrate([300, 100, 300]); 
      // 2. Respuesta Acústica: Mensaje gamificado a viva voz según la senda
      speak(`¡Kilómetro ${nextKilometerMark} completado! Sigue así, cazador del viento.`);
      // Incrementamos la meta al siguiente kilómetro
      setNextKilometerMark((prev) => prev + 1.0);
    }
  }, [progress, nextKilometerMark, quest.category]);

  // --- 🎙️ EFECTO: BIENVENIDA Y BIENESTAR DE MONTAJE ---
  useEffect(() => {
    speak(`Misión iniciada: ${quest.title}. ¡A por ello, guerrero!`);
    vibrate([100, 50, 100]); // Vibración rítmica suave de inicio

    // CLEANUP GENERAL: Cancelamos el sintetizador y el Wake Lock al desmontar
    return () => {
      window.speechSynthesis.cancel();
      releaseWakeLock();
    };
  }, []);

  // --- ⏱️ EFECTO: MANEJADOR DEL TIEMPO (Cronómetro Deportivo) ---
  useEffect(() => {
    if (isRunning) {
      requestWakeLock(); // Bloqueamos la suspensión de pantalla
      timerIntervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      releaseWakeLock(); // Liberamos la suspensión de pantalla en pausa
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    // CLEANUP: Destruimos el setInterval para evitar fugas de ciclos de CPU en el navegador
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRunning]);

  // --- 🏆 EFECTO: LOGRO COMPLETADO ---
  const [hasCompletedNotified, setHasCompletedNotified] = useState(false);
  useEffect(() => {
    // Si alcanza la meta total y no se le ha felicitado aún
    if (isCompleted && !hasCompletedNotified) {
      setHasCompletedNotified(true);
      vibrate([150, 100, 150, 100, 300]); // Patrón largo triunfal de vibración
      speak(`¡Excelente trabajo! Has completado la misión ${quest.title}.`);
    }
  }, [isCompleted, hasCompletedNotified, quest.title]);

  // --- ➕ MANEJADORES DE ENTRADA / ACCIÓN ---
  const handleIncrement = (amount: number) => {
    if (isCompleted) return;
    vibrate(60); // Pequeño clic de vibración en cada tap táctil
    const newProgress = Math.min(progress + amount, quest.maxProgress);
    setProgress(newProgress);

    // Retroalimentación de voz periódica para el conteo de repeticiones sin mirar la pantalla
    if (newProgress < quest.maxProgress) {
      if (quest.category === 'strength') {
        speak(`${newProgress} repeticiones`);
      } else {
        speak(`${newProgress} de ${quest.maxProgress}`);
      }
    }
  };

  const togglePause = () => {
    vibrate(100);
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (nextState) {
      speak("Entrenamiento reanudado.");
    } else {
      speak("Entrenamiento en pausa.");
    }
  };

  const handleFinish = () => {
    vibrate([200, 100, 200]);
    // Informa al componente padre para que sume el Oro, Experiencia y actualice LocalStorage
    onCompleteQuest(quest.id, progress);
  };

  const handleCancelClick = () => {
    vibrate(80);
    // Si tiene progreso acumulado no completado, le mostramos el modal para evitar salidas accidentales
    if (progress > quest.progress && !isCompleted) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  // --- ⏱️ FORMATEADOR DE TIEMPO (MM:SS) ---
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Diccionario de gradientes CSS según la clase RPG
  const categoryGradients = {
    cardio: 'from-cat-cardio-from to-cat-cardio-to',
    strength: 'from-cat-strength-from to-cat-strength-to',
    flexibility: 'from-cat-flex-from to-cat-flex-to',
  };

  const categoryIcons = {
    cardio: '🏃',
    strength: '💪',
    flexibility: '🧘',
  };

  // Asignación dinámica de clases CSS según si está activo el Modo Exterior de Alto Contraste
  const containerClasses = isHighContrast
    ? 'absolute inset-0 z-50 bg-white text-black flex flex-col font-sans'
    : 'absolute inset-0 z-50 bg-quest-bg text-quest-text-main flex flex-col font-sans';

  const cardClasses = isHighContrast
    ? 'bg-neutral-100 border-2 border-black p-4 rounded-xl my-2'
    : 'bg-gradient-to-br from-quest-card-from to-quest-card-to border border-quest-border-card p-5 rounded-2xl shadow-xl';

  return (
    <div className={containerClasses}>
      
      {/* ── CABECERA ── */}
      <header className={`px-4 py-4 flex items-center justify-between border-b ${isHighContrast ? 'border-black bg-neutral-100' : 'border-quest-border bg-quest-bg-to'}`}>
        <button 
          onClick={handleCancelClick}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold transition-all ${
            isHighContrast 
              ? 'hover:bg-neutral-200 text-black border border-black' 
              : 'hover:bg-quest-border/40 text-quest-text-muted hover:text-quest-text-title'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Botón Silenciar Narración por Voz */}
          <button 
            onClick={() => { vibrate(40); setIsMuted(!isMuted); }}
            className={`p-2 rounded-full border transition-all ${
              isHighContrast 
                ? 'border-black hover:bg-neutral-200 text-black' 
                : 'border-quest-border hover:bg-quest-border/40 text-quest-text-muted hover:text-quest-accent'
            }`}
            title={isMuted ? "Activar voz" : "Silenciar voz"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Botón Anti-reflejos Sunlight (Modo Exterior de Alto Contraste) */}
          <button 
            onClick={() => { vibrate(100); setIsHighContrast(!isHighContrast); }}
            className={`p-2 rounded-full border transition-all ${
              isHighContrast 
                ? 'bg-black border-black text-white hover:bg-neutral-800' 
                : 'border-quest-border hover:bg-quest-border/40 text-quest-accent'
            }`}
            title="Alternar Modo Exterior Alto Contraste"
          >
            <Sun className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL DE ENTRENAMIENTO ── */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
        
        {/* Panel Informativo de Misión */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
              isHighContrast 
                ? 'bg-black text-white border-black' 
                : `bg-quest-accent-bg-from/20 text-quest-accent border-quest-accent-bg-from/30`
            }`}>
              {categoryIcons[quest.category]} {quest.category}
            </span>
            <span className={`text-xs font-bold uppercase ${isHighContrast ? 'text-black' : 'text-quest-text-muted'}`}>
              Dificultad: {quest.difficulty}
            </span>
          </div>
          
          <h2 className={`text-2xl font-black mb-2 ${isHighContrast ? 'text-black' : 'text-quest-text-title font-sans'}`}>
            {quest.title}
          </h2>
          <p className={`text-sm ${isHighContrast ? 'text-neutral-800' : 'text-quest-text-muted'}`}>
            {quest.description}
          </p>

          {/* =============================================================
              🛰️ COMPONENTE: PANEL DE TELEMETRÍA SATELITAL EN VIVO (GPS)
              ============================================================= */}
          {quest.category === 'cardio' && (
            <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
              isHighContrast 
                ? 'bg-neutral-200 border-black text-black' 
                : 'bg-slate-950/40 border-slate-800/50 text-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                {/* Led parpadeante dinámico de estado del satélite */}
                <span className={`w-2 h-2 rounded-full ${
                  isTrackingGps 
                    ? 'bg-green-500 animate-ping' 
                    : (gpsError ? 'bg-red-500' : 'bg-yellow-500 animate-pulse')
                }`} />
                <span className="font-bold flex items-center gap-1">
                  🛰️ {isTrackingGps ? 'GPS Activo' : (gpsError ? 'Problema GPS' : 'Buscando satélites...')}
                </span>
              </div>
              
              {/* Coordenadas o Avisos de Origen Inseguro (Secure Contexts) */}
              <div className="font-mono font-medium text-right text-xxs tracking-wider">
                {gpsError ? (
                  <span className="text-red-400 font-semibold">{gpsError}</span>
                ) : lastCoords ? (
                  <span>Lat: {lastCoords.latitude.toFixed(5)} | Lon: {lastCoords.longitude.toFixed(5)}</span>
                ) : (
                  <span className="text-slate-400 animate-pulse">Adquiriendo señal...</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ⏱️ CRONÓMETRO DE TIEMPO ACTIVO (Gigante para lectura fácil en rebote) */}
        <div className="flex flex-col items-center justify-center my-6">
          <span className={`text-xs uppercase tracking-widest font-bold ${isHighContrast ? 'text-black' : 'text-quest-text-muted'}`}>
            Tiempo Activo
          </span>
          <div className={`text-7xl font-mono font-black tracking-tight mt-1 transition-all ${
            !isRunning ? 'animate-pulse text-red-500' : (isHighContrast ? 'text-black' : 'text-quest-accent')
          }`}>
            {formatTime(seconds)}
          </div>
          {!isRunning && (
            <span className="text-xs bg-red-500/10 text-red-500 font-bold px-3 py-1 rounded-full border border-red-500/20 mt-2">
              PAUSADO
            </span>
          )}
        </div>

        {/* 📊 VISUALIZADOR DE METAS Y PROGRESO GIGANTE */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className={`text-6xl font-black ${isHighContrast ? 'text-black' : 'text-quest-text-title'}`}>
              {progress}
            </span>
            <span className={`text-2xl font-bold ${isHighContrast ? 'text-neutral-600' : 'text-quest-text-muted'}`}>
              / {quest.maxProgress}
            </span>
            <span className={`text-sm font-semibold uppercase tracking-wider ml-1 ${isHighContrast ? 'text-neutral-600' : 'text-quest-text-muted'}`}>
              {quest.category === 'cardio' ? 'km' : quest.category === 'strength' ? 'rep' : 'min'}
            </span>
          </div>

          {/* Barra de progreso interactiva Radix Progress */}
          <div className="w-full max-w-sm px-4">
            <Progress.Root
              className={`relative overflow-hidden rounded-full h-4 border ${
                isHighContrast 
                  ? 'bg-neutral-200 border-black' 
                  : 'bg-quest-bg/80 border-quest-border-card'
              }`}
              value={progressPercent}
            >
              <Progress.Indicator
                className={`h-full transition-transform duration-500 ease-out ${
                  isHighContrast 
                    ? 'bg-black' 
                    : `bg-gradient-to-r ${categoryGradients[quest.category]}`
                }`}
                style={{ transform: `translateX(-${100 - progressPercent}%)` }}
              />
            </Progress.Root>
          </div>
        </div>

        {/* ➕ MANUAL BACKUP: INCREMENTADORES DE SEGURIDAD (Taps grandes para dedos húmedos/sudorosos) */}
        <div className="flex flex-col gap-3 items-center w-full mb-4">
          <span className={`text-xs uppercase tracking-wider font-bold ${isHighContrast ? 'text-black' : 'text-quest-text-muted'}`}>
            Registrar Progreso Rápido
          </span>

          <div className="flex justify-center gap-4 w-full max-w-sm">
            {quest.category === 'cardio' ? (
              <>
                <button
                  disabled={isCompleted}
                  onClick={() => handleIncrement(0.5)}
                  className={`flex-1 py-5 rounded-2xl flex flex-col items-center justify-center font-bold text-lg border transition-all ${
                    isCompleted
                      ? 'opacity-40 cursor-not-allowed'
                      : isHighContrast
                        ? 'bg-neutral-200 border-black hover:bg-neutral-300 text-black text-2xl font-black'
                        : 'bg-quest-border-card/80 border-quest-border text-quest-text-title active:scale-95 shadow-md active:bg-quest-accent-bg-from/20'
                  }`}
                >
                  <Plus className="w-6 h-6 mb-1 text-quest-accent" />
                  <span>+0.5 km</span>
                </button>
                <button
                  disabled={isCompleted}
                  onClick={() => handleIncrement(1.0)}
                  className={`flex-1 py-5 rounded-2xl flex flex-col items-center justify-center font-bold text-lg border transition-all ${
                    isCompleted
                      ? 'opacity-40 cursor-not-allowed'
                      : isHighContrast
                        ? 'bg-neutral-200 border-black hover:bg-neutral-300 text-black text-2xl font-black'
                        : 'bg-quest-border-card/80 border-quest-border text-quest-text-title active:scale-95 shadow-md active:bg-quest-accent-bg-from/20'
                  }`}
                >
                  <Plus className="w-6 h-6 mb-1 text-quest-accent" />
                  <span>+1.0 km</span>
                </button>
              </>
            ) : quest.category === 'strength' ? (
              <>
                <button
                  disabled={isCompleted}
                  onClick={() => handleIncrement(1)}
                  className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center font-bold border transition-all ${
                    isCompleted
                      ? 'opacity-40 cursor-not-allowed'
                      : isHighContrast
                        ? 'bg-neutral-200 border-black text-black text-xl font-black'
                        : 'bg-quest-border-card/80 border-quest-border text-quest-text-title active:scale-95 shadow-md'
                  }`}
                >
                  <span className="text-xl font-black">+1</span>
                  <span className="text-xs opacity-80">rep</span>
                </button>
                <button
                  disabled={isCompleted}
                  onClick={() => handleIncrement(5)}
                  className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center font-bold border transition-all ${
                    isCompleted
                      ? 'opacity-40 cursor-not-allowed'
                      : isHighContrast
                        ? 'bg-neutral-200 border-black text-black text-xl font-black'
                        : 'bg-quest-border-card/80 border-quest-border text-quest-text-title active:scale-95 shadow-md'
                  }`}
                >
                  <span className="text-xl font-black">+5</span>
                  <span className="text-xs opacity-80">reps</span>
                </button>
                <button
                  disabled={isCompleted}
                  onClick={() => handleIncrement(10)}
                  className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center font-bold border transition-all ${
                    isCompleted
                      ? 'opacity-40 cursor-not-allowed'
                      : isHighContrast
                        ? 'bg-neutral-200 border-black text-black text-xl font-black hover:bg-neutral-300'
                        : 'bg-quest-border-card/80 border-quest-border text-quest-text-title active:scale-95 shadow-md'
                  }`}
                >
                  <span className="text-xl font-black">+10</span>
                  <span className="text-xs opacity-80">reps</span>
                </button>
              </>
            ) : (
              // Flexibility
              <>
                <button
                  disabled={isCompleted}
                  onClick={() => handleIncrement(1)}
                  className={`flex-1 py-5 rounded-2xl flex flex-col items-center justify-center font-bold border transition-all ${
                    isCompleted
                      ? 'opacity-40 cursor-not-allowed'
                      : isHighContrast
                        ? 'bg-neutral-200 border-black text-black text-2xl font-black'
                        : 'bg-quest-border-card/80 border-quest-border text-quest-text-title active:scale-95 shadow-md'
                  }`}
                >
                  <Plus className="w-6 h-6 mb-1 text-quest-accent" />
                  <span>+1 min</span>
                </button>
                <button
                  disabled={isCompleted}
                  onClick={() => handleIncrement(5)}
                  className={`flex-1 py-5 rounded-2xl flex flex-col items-center justify-center font-bold border transition-all ${
                    isCompleted
                      ? 'opacity-40 cursor-not-allowed'
                      : isHighContrast
                        ? 'bg-neutral-200 border-black text-black text-2xl font-black'
                        : 'bg-quest-border-card/80 border-quest-border text-quest-text-title active:scale-95 shadow-md'
                  }`}
                >
                  <Plus className="w-6 h-6 mb-1 text-quest-accent" />
                  <span>+5 min</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── BOTONES DE CONTROL DE LA SESIÓN ── */}
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto mt-2">
          
          {/* Botón Principal de Éxito al completar */}
          {isCompleted ? (
            <button
              onClick={handleFinish}
              className={`w-full py-4.5 rounded-2xl font-black text-xl flex items-center justify-center gap-2 border transition-all shadow-lg active:scale-98 animate-pulse ${
                isHighContrast
                  ? 'bg-black border-black text-white hover:bg-neutral-800'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-green-500/20 text-white shadow-green-500/10'
              }`}
            >
              <CheckCircle className="w-6 h-6" />
              <span>COBRAR RECOMPENSA</span>
            </button>
          ) : (
            <div className="flex gap-3 w-full">
              
              {/* Botón Pausa / Reanudar */}
              <button
                onClick={togglePause}
                className={`flex-1 py-4.5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                  isRunning
                    ? (isHighContrast 
                        ? 'bg-neutral-200 border-black text-black hover:bg-neutral-300' 
                        : 'bg-yellow-600/20 border-yellow-500/30 text-yellow-500 hover:bg-yellow-600/30')
                    : (isHighContrast 
                        ? 'bg-black border-black text-white hover:bg-neutral-800' 
                        : 'bg-gradient-to-r from-quest-accent-bg-from to-quest-accent-bg-to text-quest-bg hover:opacity-90 shadow-lg shadow-quest-accent-glow')
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>PAUSAR</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>REANUDAR</span>
                  </>
                )}
              </button>
              
              {/* Botón Terminar Manual */}
              <button
                onClick={handleFinish}
                className={`py-4.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
                  isHighContrast
                    ? 'border-black text-black hover:bg-neutral-100'
                    : 'bg-quest-border-card/30 border-quest-border text-quest-text-title hover:bg-quest-border-card/50'
                }`}
              >
                <span>TERMINAR</span>
              </button>

            </div>
          )}
        </div>
      </main>

      {/* ── MODAL DE DIÁLOGO DE CONFIRMACIÓN DE ABANDONO ACCIDENTAL ── */}
      {showExitConfirm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className={`p-6 rounded-2xl w-full max-w-xs border text-center ${isHighContrast ? 'bg-white border-black text-black' : 'bg-quest-card-from border-quest-border text-quest-text-main'}`}>
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
            <h3 className={`text-xl font-bold mb-2 ${isHighContrast ? 'text-black' : 'text-quest-text-title'}`}>
              ¿Abandonar Misión?
            </h3>
            <p className="text-sm mb-6 text-quest-text-muted">
              Tienes progreso acumulado en este entrenamiento. Si sales ahora, se perderán las repeticiones hechas.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { vibrate(100); setShowExitConfirm(false); onClose(); }}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl active:scale-95"
              >
                Abandonar entrenamiento
              </button>
              <button
                onClick={() => { vibrate(50); setShowExitConfirm(false); }}
                className={`w-full py-2.5 font-bold rounded-xl active:scale-95 border ${isHighContrast ? 'border-black hover:bg-neutral-100' : 'bg-quest-border-card border-quest-border text-quest-text-title hover:bg-quest-border-card/80'}`}
              >
                Continuar entrenando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
