import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Dumbbell, CheckCircle2 } from 'lucide-react';
import { useQuestContext } from '../context/QuestContext';
import { QuestHeader } from '../components/QuestHeader';
import { QuestCardV1 } from '../components/experiments/QuestCardV1';
import { CreateQuestModal } from '../components/CreateQuestModal';

export function QuestsView() {
  const { quests, activeFilter, setActiveFilter, activeStatusFilter, setActiveStatusFilter } = useQuestContext();
  const [parent] = useAutoAnimate();

  const filteredByCategory = activeFilter === 'all'
    ? quests
    : quests.filter((q) => q.category === activeFilter);

  const filteredQuests = filteredByCategory.filter((q) =>
    activeStatusFilter === 'completed' ? q.completed : !q.completed
  );

  const activeCount = quests.filter((q) => !q.completed).length;
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#0f0f0f] via-[#121218] to-[#0f0f0f]">
      {/* Cabecera de Disciplinas */}
      <QuestHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Barra de Filtro de Estado + Añadir Rutina */}
      <div className="px-4 py-2.5 bg-[#0f0f0f]/90 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#18181b] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveStatusFilter('active')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeStatusFilter === 'active'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pendientes ({activeCount})
          </button>
          <button
            onClick={() => setActiveStatusFilter('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeStatusFilter === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Completados ({completedCount})
          </button>
        </div>

        {/* Modal para añadir nuevo entrenamiento */}
        <CreateQuestModal />
      </div>

      {/* Lista de Rutinas y Entrenamientos */}
      <main className="flex-1 overflow-y-auto p-4">
        <div ref={parent} className="flex flex-col gap-3">
          {filteredQuests.map((workout) => (
            <QuestCardV1 key={workout.id} {...workout} />
          ))}

          {filteredQuests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-[#18181b] rounded-full flex items-center justify-center mb-3 border border-white/10 shadow-inner">
                {activeStatusFilter === 'completed' ? (
                  <CheckCircle2 className="w-8 h-8 opacity-40 text-emerald-400" />
                ) : (
                  <Dumbbell className="w-8 h-8 opacity-40" />
                )}
              </div>
              <h3 className="text-base font-bold text-gray-200 mb-1">
                {activeStatusFilter === 'completed' ? 'Sin Entrenamientos Completados' : 'Sin Sesiones Programadas'}
              </h3>
              <p className="text-xs text-center max-w-[240px] text-gray-400">
                {activeStatusFilter === 'completed'
                  ? 'No hay registros completados en esta disciplina hoy.'
                  : 'No tienes rutinas pendientes en esta categoría. Puedes añadir una nueva con el botón superior.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
