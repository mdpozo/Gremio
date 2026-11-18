import { useState } from 'react';
import { Dumbbell, Activity, Heart, Award, Flame, Edit2, Check, Shield, Settings } from 'lucide-react';
import { useQuestContext } from '../context/QuestContext';
import { SettingsModal } from '../components/SettingsModal';

export function ProfileView() {
  const { player, updatePlayerProfile } = useQuestContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(player.name);
  const [titleInput, setTitleInput] = useState(player.title);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    updatePlayerProfile({
      name: nameInput.trim(),
      title: titleInput.trim() || 'Atleta en Progreso',
    });
    setIsEditing(false);
  };

  const expNeeded = player.level * 150;
  const expPercent = Math.min((player.exp / expNeeded) * 100, 100);

  const ranks = [
    { range: 'Nivel 1 - 4', title: 'Recluta Físico', desc: 'Iniciación al hábito y adaptación articular' },
    { range: 'Nivel 5 - 9', title: 'Atleta Intermedio', desc: 'Consistencia semanal y progresión de cargas' },
    { range: 'Nivel 10 - 14', title: 'Titán del Acero', desc: 'Alta capacidad cardiovascular y de fuerza' },
    { range: 'Nivel 15+', title: 'Leyenda Deportiva', desc: 'Maestría física y constancia inquebrantable' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gradient-to-b from-[#0f0f0f] via-[#121218] to-[#0f0f0f]">
      {/* ── BARRA SUPERIOR DE PERFIL ── */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold block">
            Hoja de Atleta
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">Tu Perfil Físico</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNameInput(player.name);
              setTitleInput(player.title);
              setIsEditing(!isEditing);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
            title="Editar Perfil"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 border border-white/10 transition-colors"
            title="Ajustes y Configuración"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── FICHA DEL ATLETA ── */}
      <div className="bg-[#16161c]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center text-center relative">
        {/* Avatar accesible y protegido de desbordamientos */}
        <div className="relative mb-3 flex-shrink-0 pt-1">
          <div className="w-20 h-20 bg-[#0f0f0f] rounded-full border-2 border-amber-400 flex items-center justify-center text-3xl shadow-md flex-shrink-0 select-none">
            🏋️
          </div>
          <div className="absolute bottom-0 right-0 bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full border border-slate-950 shadow-sm flex-shrink-0">
            L{player.level}
          </div>
        </div>

        {/* Nombre y Título o Formulario de Edición */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="w-full flex flex-col gap-2.5 my-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 text-left mb-1">Nombre</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 text-left mb-1">Especialidad / Título</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center max-w-full px-2">
            <h3 className="text-xl font-bold text-white tracking-tight break-words text-center">{player.name}</h3>
            <span className="text-xs bg-white/5 text-amber-400 font-semibold px-3 py-1 rounded-full border border-white/10 mt-1 max-w-full">
              {player.title}
            </span>
          </div>
        )}

        {/* Barra de Progreso Atlético */}
        <div className="w-full mt-4 bg-[#0f0f0f] p-3.5 rounded-xl border border-white/5">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
            <span>Progreso hacia Nivel {player.level + 1}</span>
            <span className="text-amber-400 font-bold font-mono">{player.exp} / {expNeeded} pts</span>
          </div>
          <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-amber-400 h-full transition-all duration-500 shadow-sm"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <div className="bg-[#0f0f0f]/80 p-3 rounded-xl border border-white/5 flex flex-col items-center shadow-sm">
            <Award className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-base font-black text-white">{player.completedQuestsCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Sesiones Hechas</span>
          </div>
          <div className="bg-[#0f0f0f]/80 p-3 rounded-xl border border-white/5 flex flex-col items-center shadow-sm">
            <Flame className="w-4 h-4 text-orange-400 mb-1" />
            <span className="text-base font-black text-white">{player.gold}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Puntos de Actividad</span>
          </div>
        </div>
      </div>

      {/* ── ESCALA DE RANGOS ATLÉTICOS ── */}
      <div className="bg-[#16161c]/70 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex flex-col gap-2.5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1.5 mb-1">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Escala de Rangos de Rendimiento</span>
        </h3>

        {ranks.map((rank, idx) => {
          const isCurrent =
            (idx === 0 && player.level < 5) ||
            (idx === 1 && player.level >= 5 && player.level < 10) ||
            (idx === 2 && player.level >= 10 && player.level < 15) ||
            (idx === 3 && player.level >= 15);

          return (
            <div
              key={rank.range}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                isCurrent
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-400 shadow-sm'
                  : 'bg-white/[0.02] border-white/5 text-gray-400'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                    {rank.title}
                  </span>
                  <span className="text-[10px] font-mono opacity-60">({rank.range})</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{rank.desc}</p>
              </div>
              {isCurrent && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 flex-shrink-0">
                  Actual
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── PERFIL DE RENDIMIENTO FÍSICO ── */}
      <div className="bg-[#16161c]/70 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex flex-col gap-3.5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Perfil de Rendimiento Físico</span>
        </h3>

        {/* Fuerza */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Dumbbell className="w-4 h-4" /> Fuerza Muscular (Fuerza)
            </span>
            <span className="text-rose-400 font-mono">{player.stats.strength} pts</span>
          </div>
          <div className="w-full bg-[#0f0f0f] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(player.stats.strength * 2, 100)}%` }}
            />
          </div>
        </div>

        {/* Resistencia */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Activity className="w-4 h-4" /> Capacidad Aeróbica (Cardio)
            </span>
            <span className="text-sky-400 font-mono">{player.stats.endurance} pts</span>
          </div>
          <div className="w-full bg-[#0f0f0f] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(player.stats.endurance * 2, 100)}%` }}
            />
          </div>
        </div>

        {/* Movilidad */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Heart className="w-4 h-4" /> Movilidad & Flexibilidad
            </span>
            <span className="text-emerald-400 font-mono">{player.stats.agility} pts</span>
          </div>
          <div className="w-full bg-[#0f0f0f] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(player.stats.agility * 2, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modal de Ajustes y Configuración */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
