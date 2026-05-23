import { QuestCardV1 } from './experiments/QuestCardV1';

const sampleQuests = [
  {
    id: 1,
    title: 'Carrera del Amanecer',
    description: 'Comienza tu día con energía. Corre 5km antes de que salga el sol. Mantén un ritmo constante y no te detengas hasta llegar a la meta.',
    category: 'cardio' as const,
    difficulty: 'medium' as const,
    reward: 150,
    progress: 3,
    maxProgress: 5,
    timeLeft: '12h restantes',
  },
  {
    id: 2,
    title: 'Levantamiento Titánico',
    description: 'Demuestra tu fuerza bruta. Supera tu marca personal en peso muerto. Asegúrate de calentar bien antes de intentar el récord.',
    category: 'strength' as const,
    difficulty: 'epic' as const,
    reward: 500,
    progress: 0,
    maxProgress: 1,
    timeLeft: '2 días',
  },
  {
    id: 3,
    title: 'Postura del Árbol Milenario',
    description: 'Encuentra tu centro y equilibrio. Mantén la postura de yoga durante 5 minutos seguidos sin perder la concentración ni la forma.',
    category: 'flexibility' as const,
    difficulty: 'hard' as const,
    reward: 200,
    progress: 2,
    maxProgress: 5,
    timeLeft: '4h restantes',
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
                <QuestCardV1 
                  key={`v1-${quest.id}`} 
                  {...quest} 
                  onStartQuest={() => console.log('Iniciar ejercicio en lab')}
                />
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
