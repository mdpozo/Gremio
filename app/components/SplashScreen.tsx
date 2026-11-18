import { useState, useEffect } from 'react';
import { QuestLogo } from './QuestLogo';
import { Dumbbell } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Transición de salida suave a los 1000ms (1 segundo)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1000);

    // Desmontar el splash tras terminar el fade-out (1400ms)
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#09090c] text-white select-none transition-all duration-400 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.14) 0%, #09090c 70%)',
      }}
    >
      {/* ── ESPACIADOR SUPERIOR / BADGE DISCRETO ── */}
      <div className="w-full flex justify-end pt-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/70 bg-amber-400/5 px-2.5 py-1 rounded-full border border-amber-400/15">
          v1.0.0 DAM
        </span>
      </div>

      {/* ── ISOTIPO Y MARCA CENTRAL (PULSO SUTIL DE ENERGÍA) ── */}
      <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        <div className="relative mb-5">
          {/* Halo de luz ámbar que respira */}
          <div className="absolute inset-0 rounded-3xl bg-amber-400/20 blur-2xl animate-pulse" />
          <div className="relative transform transition-transform duration-700 hover:scale-105">
            <QuestLogo variant="fit" size={76} />
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5 mt-2">
          <span>QUEST</span>
          <span className="text-amber-400 font-extrabold">: FIT</span>
        </h1>

        <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-bold mt-2 flex items-center gap-2">
          <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
          <span>Acondicionamiento y Rendimiento</span>
        </p>
      </div>

      {/* ── PIE DE MARCA INSTITUCIONAL ── */}
      <div className="flex flex-col items-center text-center pb-4">
        <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-semibold">
          Desarrollado para
        </span>
        <span className="text-xs font-black tracking-wider text-gray-300 mt-0.5">
          PROYECTO FIN DE GRADO DAM
        </span>
      </div>
    </div>
  );
}
