import { Award, User, Flame } from 'lucide-react';
import { useQuestContext } from '../context/QuestContext';
import { QuestLogo } from './QuestLogo';

interface QuestHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function QuestHeader({ activeFilter, onFilterChange }: QuestHeaderProps) {
  const { player } = useQuestContext();

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'strength', label: 'Fuerza' },
    { id: 'flexibility', label: 'Movilidad' },
  ];

  const expNeeded = player.level * 150;
  const expPercent = Math.min((player.exp / expNeeded) * 100, 100);

  return (
    <header className="bg-gradient-to-b from-[#0f0f0f] via-[#141419] to-[#0f0f0f] border-b border-white/10 px-4 pt-3.5 pb-3 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* ── BARRA SUPERIOR DE MARCA ── */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <QuestLogo variant="fit" withText size={34} />

          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-semibold">
              Temporada 2026
            </span>
          </div>
        </div>

        {/* ── ESTADO DEL ATLETA ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-[#18181b] rounded-full border border-white/15 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded border border-slate-950">
                L{player.level}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-100 text-sm leading-none">{player.name}</span>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded font-medium">
                  {player.title}
                </span>
              </div>

              {/* Indicadores */}
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>{player.gold} pts</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-orange-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{player.streak} d racha</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-medium">
              Progreso: <strong className="text-amber-400">{player.exp}</strong> / {expNeeded}
            </span>
          </div>
        </div>

        {/* Barra de Progreso de Rango */}
        <div className="w-full bg-[#18181b] h-1.5 rounded-full border border-white/5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500 shadow-sm"
            style={{ width: `${expPercent}%` }}
          />
        </div>

        {/* Filtros de Disciplina */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
