import { QuestCardV1 } from './experiments/QuestCardV1';

const sampleQuests = [
  {
    id: '1',
    title: 'Carrera Continua 5K (Zona 2)',
    description: 'Entrenamiento aeróbico constante para potenciar la resistencia cardiovascular y la eficiencia metabólica.',
    category: 'cardio' as const,
    difficulty: 'medium' as const,
    reward: 200,
    progress: 3,
    maxProgress: 5,
    timeLeft: 'Hoy',
    completed: false,
    unit: 'km',
  },
  {
    id: '2',
    title: 'Fuerza: Peso Muerto Pesado',
    description: 'Trabajo neuromuscular de cadena posterior. 5 series efectivas de peso muerto convencional.',
    category: 'strength' as const,
    difficulty: 'epic' as const,
    reward: 450,
    progress: 2,
    maxProgress: 5,
    timeLeft: 'Esta semana',
    completed: false,
    unit: 'series',
  },
  {
    id: '3',
    title: 'Movilidad y Apertura de Cadera',
    description: 'Rutina de descarga articular y estiramientos estáticos para acelerar la recuperación.',
    category: 'flexibility' as const,
    difficulty: 'easy' as const,
    reward: 120,
    progress: 10,
    maxProgress: 20,
    timeLeft: 'Hoy',
    completed: false,
    unit: 'min',
  },
];

export function DesignPlayground() {
  return (
    <div className="flex-1 overflow-y-auto bg-quest-bg p-6 pb-32">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-quest-text-title mb-6 flex items-center gap-2">
          <span className="bg-quest-accent text-quest-bg px-2 py-1 rounded text-sm uppercase tracking-wide">Lab</span>
          UI Playground
        </h2>
        
        <div className="space-y-12">
          {/* V1 Block */}
          <section>
            <div className="border-b border-quest-border pb-2 mb-4">
              <h3 className="text-lg font-semibold text-quest-text-main">QuestCard <span className="text-quest-text-muted font-normal">(v1.0 - Actual)</span></h3>
            </div>
            <div className="flex flex-col gap-4">
              {sampleQuests.map((quest) => (
                <QuestCardV1 key={`v1-${quest.id}`} {...quest} />
              ))}
            </div>
          </section>

          {/* V2 Placeholder */}
          <section className="opacity-50 grayscale">
            <div className="border-b border-quest-border pb-2 mb-4">
              <h3 className="text-lg font-semibold text-quest-text-main">QuestCard <span className="text-quest-text-muted font-normal">(v2.0 - Próximamente)</span></h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-40 border-2 border-dashed border-quest-border rounded-xl flex items-center justify-center text-quest-text-muted">
                Espacio para el nuevo diseño...
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
