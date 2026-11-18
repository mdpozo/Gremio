import { FC } from 'react';

interface QuestLogoProps {
  variant?: 'fit' | 'log' | 'task' | 'corporate';
  size?: number;
  className?: string;
  withText?: boolean;
}

export const QuestLogo: FC<QuestLogoProps> = ({
  variant = 'fit',
  size = 32,
  className = '',
  withText = false,
}) => {
  // Configuración de acentos según la app del ecosistema QUEST
  const accents = {
    fit: {
      gradient: 'from-amber-500 to-amber-300',
      glow: 'rgba(245, 158, 11, 0.4)',
      tailColor: '#F59E0B',
      subtitle: 'Entrenamiento & Rendimiento',
      appName: 'FIT',
      appColor: 'text-amber-400',
    },
    log: {
      gradient: 'from-purple-600 to-violet-300',
      glow: 'rgba(139, 92, 246, 0.4)',
      tailColor: '#8B5CF6',
      subtitle: 'Ocio & Cultura Digital',
      appName: 'LOG',
      appColor: 'text-purple-400',
    },
    task: {
      gradient: 'from-cyan-500 to-sky-300',
      glow: 'rgba(6, 182, 212, 0.4)',
      tailColor: '#06B6D4',
      subtitle: 'Mente & Productividad',
      appName: 'TASK',
      appColor: 'text-cyan-400',
    },
    corporate: {
      gradient: 'from-amber-500 via-purple-500 to-cyan-500',
      glow: 'rgba(255, 255, 255, 0.3)',
      tailColor: '#F59E0B',
      subtitle: 'Ecosistema Multiplataforma',
      appName: '',
      appColor: 'text-white',
    },
  };

  const current = accents[variant];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ── ISOTIPO ATLÉTICO AERODINÁMICO "Q" ── */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-2xl bg-[#141418] border border-white/10 shadow-lg overflow-hidden group transition-transform duration-200 hover:scale-105"
        style={{
          width: size,
          height: size,
          boxShadow: `0 4px 20px ${current.glow}`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Símbolo Q Deportivo Itálico */}
          <g transform="skewX(-14) translate(11, 0)">
            {/* Anillo Principal */}
            <path
              d="M32 20 C20 20 13 28 13 42 V56 C13 70 20 78 34 78 H52 L62 88 C64 90 68 89 69 86 L71 80 C76 75 79 67 79 56 V42 C79 28 72 20 58 20 Z
                 M34 34 H56 C61 34 65 38 65 46 V54 C65 62 61 66 56 66 H34 C29 66 25 62 25 54 V46 C25 38 29 34 34 34 Z"
              fill="#F8FAFC"
              fillRule="evenodd"
            />
            {/* Vector Dinámico de Velocidad / Cola de la Q */}
            <path
              d="M46 58 L77 87 L86 85 L59 55 Z"
              fill={current.tailColor}
            />
            <path
              d="M50 58 L78 84"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* ── TEXTO DE MARCA ── */}
      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none font-sans">
            <span className="font-black text-white text-base tracking-tight">QUEST</span>
            {current.appName && (
              <span className={`font-black text-base ${current.appColor}`}>
                : {current.appName}
              </span>
            )}
          </div>
          <span className="text-[8px] uppercase tracking-[0.25em] text-gray-400 font-bold mt-0.5">
            {current.subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
