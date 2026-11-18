import { Flame, Trophy, Activity, Dumbbell, Zap, ArrowRight, TrendingUp, Plus } from 'lucide-react';
import { useQuestContext } from '../context/QuestContext';
import { QuestCardV1 } from '../components/experiments/QuestCardV1';

export function HomeView() {
  const { player, quests, setActiveTab } = useQuestContext();

  const activeWorkouts = quests.filter((q) => !q.completed);
  const featuredWorkout = activeWorkouts[0];

  const completedTodayCount = quests.filter((q) => q.completed).length;
  const estimatedCalories = completedTodayCount * 220 + player.level * 20;
  const estimatedMinutes = completedTodayCount * 30 + activeWorkouts.length * 15;

  const currentHour = new Date().getHours();
  let greeting = 'Buenos días';
  if (currentHour >= 12 && currentHour < 20) greeting = 'Buenas tardes';
  if (currentHour >= 20 || currentHour < 6) greeting = 'Buenas noches';

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gradient-to-b from-[#0f0f0f] via-[#121218] to-[#0f0f0f]">
      {/* ── TARJETA PRINCIPAL DEL ATLETA ── */}
      <div className="relative bg-[#16161c]/90 p-5 rounded-2xl border border-white/10 shadow-lg overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3 text-amber-400" />
              Rendimiento Deportivo
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {greeting}, <span className="text-amber-400">{player.name}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Plan diario de entrenamientos y acondicionamiento físico.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/[0.03] border border-white/10 px-3.5 py-2 rounded-xl">
            <div className="flex items-center gap-1 text-amber-400 font-black text-xl">
              <Flame className="w-5 h-5" />
              <span>{player.streak}</span>
            </div>
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Días Racha</span>
          </div>
        </div>
      </div>

      {/* ── MÉTRICAS DE ACTIVIDAD ── */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#16161c]/70 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex flex-col items-center text-center shadow-sm">
          <Activity className="w-4 h-4 text-rose-400 mb-1" />
          <span className="text-white font-black text-sm">{estimatedCalories}</span>
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Kcal Quemadas</span>
        </div>

        <div className="bg-[#16161c]/70 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex flex-col items-center text-center shadow-sm">
          <Zap className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-white font-black text-sm">{estimatedMinutes} min</span>
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Tiempo Activo</span>
        </div>

        <div className="bg-[#16161c]/70 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex flex-col items-center text-center shadow-sm">
          <Trophy className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-white font-black text-sm">{completedTodayCount}</span>
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Completados</span>
        </div>
      </div>

      {/* ── SESIÓN DESTACADA ── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
            <span>Entrenamiento Recomendado</span>
          </h3>
          <button
            onClick={() => setActiveTab('quests')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Ver plan completo</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {featuredWorkout ? (
          <QuestCardV1 {...featuredWorkout} />
        ) : quests.length === 0 ? (
          <div className="p-6 bg-[#16161c]/80 border border-white/10 rounded-2xl text-center flex flex-col items-center gap-3 shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Comienza tu Acondicionamiento</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
                Añade tu primera rutina de cardio, fuerza o movilidad para comenzar a registrar tu actividad y subir de nivel.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('quests')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Programar Primer Entrenamiento</span>
            </button>
          </div>
        ) : (
          <div className="p-6 bg-[#16161c]/60 border border-white/10 rounded-2xl text-center">
            <p className="text-xs text-gray-400">Todos los entrenamientos de hoy han sido completados con éxito.</p>
          </div>
        )}
      </div>

      {/* ── SEGUIMIENTO SEMANAL DE CONSTANCIA ── */}
      <div className="bg-[#16161c]/80 border border-white/10 p-4 rounded-2xl flex flex-col gap-3 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Constancia Semanal de Entrenamientos</h4>
              <p className="text-[10px] text-gray-400">
                {completedTodayCount >= 1
                  ? `${Math.min(player.streak, 7)} de 7 días activos esta semana`
                  : `${Math.min(player.streak, 6)} de 7 días completados. ¡Entrena hoy para mantener la racha!`}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400 font-mono">
            {Math.round((Math.min(player.streak, 7) / 7) * 100)}%
          </span>
        </div>

        {/* Tira de los 7 días de la semana */}
        {(() => {
          const days = [
            { label: 'L', name: 'Lun', dayIdx: 1 },
            { label: 'M', name: 'Mar', dayIdx: 2 },
            { label: 'X', name: 'Mié', dayIdx: 3 },
            { label: 'J', name: 'Jue', dayIdx: 4 },
            { label: 'V', name: 'Vie', dayIdx: 5 },
            { label: 'S', name: 'Sáb', dayIdx: 6 },
            { label: 'D', name: 'Dom', dayIdx: 0 },
          ];

          const todayDayIdx = new Date().getDay(); // 0 is Sunday, 1 is Monday

          return (
            <div className="grid grid-cols-7 gap-1.5 pt-1 border-t border-white/5">
              {days.map((d, index) => {
                const isToday = d.dayIdx === todayDayIdx;
                // Consideramos completados los días anteriores dentro del streak
                const isCompleted = index < Math.min(player.streak, 5) || (isToday && completedTodayCount > 0);

                return (
                  <div
                    key={d.label + index}
                    className={`flex flex-col items-center py-2 rounded-xl border transition-all ${
                      isToday
                        ? 'border-amber-400/50 bg-amber-400/10 shadow-sm'
                        : isCompleted
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">
                      {d.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : isToday
                          ? 'bg-amber-400 text-slate-950 animate-pulse'
                          : 'bg-white/5 text-gray-500'
                      }`}
                    >
                      {isCompleted ? '✓' : isToday ? '•' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
