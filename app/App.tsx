/**
 * App.tsx — Componente Raíz (Root Component)
 *
 * Este es el componente principal de la aplicación. Actúa como "orquestador":
 * define el layout general, gestiona el estado compartido entre componentes
 * y distribuye los datos a cada parte de la interfaz.
 *
 * Analogía con Java: App sería como la clase Main, el punto de entrada
 * de la lógica de la aplicación, aunque en React es un componente visual.
 *
 * Árbol de componentes que compone este archivo:
 *
 *   <App>
 *     ├── <Sidebar>        (panel izquierdo con stats del jugador)
 *     ├── <QuestHeader>    (cabecera con título y botones de filtro)
 *     └── <QuestCard>×N   (grid de tarjetas de misión, N varía según filtro)
 */

// useState es el Hook más básico de React.
// Un Hook es una función que permite a los componentes funcionales
// tener "memoria" entre re-renderizados.
// Sin useState, cada vez que React re-renderiza el componente,
// todas las variables locales se reiniciarían a su valor inicial.
import { useState } from 'react';

// Importamos los tres componentes principales de la UI.
// Las llaves {} indican que son "named exports" (exportaciones nombradas).
// Son distintas de los "default exports" que van sin llaves (como App aquí abajo).
import { QuestHeader } from './components/QuestHeader';
import { QuestCardV1 } from './components/experiments/QuestCardV1';
import { BottomNav } from './components/BottomNav';
import { DesignPlayground } from './components/DesignPlayground';

// 🧪 MODO LABORATORIO: Cambia esto a 'true' para ver el Design Playground
const SHOW_PLAYGROUND = false;

/**
 * Definición del tipo Quest usando TypeScript.
 *
 * Un "type" (o "interface") en TypeScript funciona como un contrato:
 * define exactamente qué campos y qué tipos de datos debe tener un objeto Quest.
 *
 * Es similar a definir una clase en Java con sus atributos tipados,
 * pero más ligero (solo describe la forma del dato, sin lógica).
 *
 * Los "Union Types" (con |) equivalen a un Enum en Java:
 *   category: 'cardio' | 'strength' | 'flexibility'
 *   → Solo puede ser UNO de esos tres valores exactos. TypeScript da error si pones otro.
 */
type Quest = {
  id: number;                                          // Identificador único
  title: string;                                       // Nombre de la misión
  description: string;                                 // Descripción del reto
  category: 'cardio' | 'strength' | 'flexibility';    // Tipo de ejercicio
  progress: number;                                    // Unidades completadas
  maxProgress: number;                                 // Total de unidades del reto
  reward: number;                                      // Oro que se gana al completar
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';   // Nivel de dificultad
  timeLeft: string;                                    // Tiempo restante (texto)
};

/**
 * Componente principal App.
 *
 * En React, los componentes son funciones que devuelven JSX.
 * JSX es una extensión de JavaScript que permite escribir HTML dentro del código.
 * Aunque parece HTML, en realidad se convierte en llamadas a React.createElement().
 *
 * "export default" significa que este componente es la exportación principal
 * del archivo. Otros archivos pueden importarlo sin llaves: import App from './App'
 */
export default function App() {

  /**
   * Estado del filtro activo.
   *
   * useState<string>('all') crea una variable de estado:
   *   - activeFilter: el valor actual ('all', 'cardio', 'strength' o 'flexibility')
   *   - setActiveFilter: la función que actualiza ese valor y provoca un re-render
   *
   * Cuando el usuario clica un botón en QuestHeader, este llama a setActiveFilter(),
   * lo que hace que React re-ejecute App() con el nuevo valor de activeFilter,
   * actualizando automáticamente la lista de tarjetas visibles.
   */
  const [activeFilter, setActiveFilter] = useState('all');

  /**
   * Datos de las misiones (hardcoded para el MVP estático).
   *
   * En la Fase 3 del proyecto, estos datos vendrán de una API REST
   * (Java + Spring Boot) mediante una llamada fetch() o Axios.
   * Por ahora están definidos directamente en el código para el prototipo.
   *
   * El tipo Quest[] indica que es un Array de objetos Quest.
   * Cada objeto debe cumplir el contrato definido en el type Quest arriba.
   *
   * "as const" en los valores de category y difficulty le dice a TypeScript
   * que trate ese string como un tipo literal, no como string genérico.
   * Esto activa el chequeo de tipos del Union Type.
   */
  const quests: Quest[] = [
    {
      id: 1,
      title: 'Maratón del Guerrero',
      description: 'Corre 5km sin detenerte. Demuestra tu resistencia y velocidad.',
      category: 'cardio' as const,
      progress: 3,       // 3 de 5 km completados
      maxProgress: 5,
      reward: 500,       // Oro al completar
      difficulty: 'hard' as const,
      timeLeft: '2d 5h',
    },
    {
      id: 2,
      title: 'Forja de Acero',
      description: 'Completa 50 flexiones y 30 dominadas para fortalecer tus músculos.',
      category: 'strength' as const,
      progress: 35,
      maxProgress: 80,
      reward: 800,
      difficulty: 'epic' as const,
      timeLeft: '1d 12h',
    },
    {
      id: 3,
      title: 'Yoga del Amanecer',
      description: 'Realiza una sesión de 30 minutos de yoga al amanecer.',
      category: 'flexibility' as const,
      progress: 20,
      maxProgress: 30,
      reward: 300,
      difficulty: 'medium' as const,
      timeLeft: '3d',
    },
    {
      id: 4,
      title: 'Sprints del Cazador',
      description: 'Completa 10 sprints de 100 metros con descansos de 1 minuto.',
      category: 'cardio' as const,
      progress: 7,
      maxProgress: 10,
      reward: 450,
      difficulty: 'medium' as const,
      timeLeft: '1d 8h',
    },
    {
      id: 5,
      title: 'Levantamiento Titánico',
      description: 'Alcanza un nuevo récord personal en peso muerto.',
      category: 'strength' as const,
      progress: 1,
      maxProgress: 1,
      reward: 1000,
      difficulty: 'epic' as const,
      timeLeft: '5d',
    },
    {
      id: 6,
      title: 'Estiramientos del Sabio',
      description: 'Mantén cada postura de estiramiento por 60 segundos.',
      category: 'flexibility' as const,
      progress: 5,
      maxProgress: 8,
      reward: 250,
      difficulty: 'easy' as const,
      timeLeft: '2d',
    },
  ];

  /**
   * Lógica de filtrado de misiones.
   *
   * Equivalente en Java:
   *   List<Quest> filtered = activeFilter.equals("all")
   *     ? quests
   *     : quests.stream().filter(q -> q.category.equals(activeFilter)).collect(toList());
   *
   * En JavaScript/TypeScript:
   *   - El operador ternario (condición ? valorSiTrue : valorSiFalse) es igual que en Java
   *   - Array.filter() es como Stream.filter() de Java: devuelve un nuevo array
   *     con solo los elementos que cumplen la condición (el predicado)
   *   - La arrow function "quest => quest.category === activeFilter" es el predicado
   */
  const filteredQuests = activeFilter === 'all'
    ? quests
    : quests.filter(quest => quest.category === activeFilter);

  /**
   * JSX — La plantilla visual del componente.
   *
   * Diferencias con HTML puro:
   *   - "className" en lugar de "class" (class es palabra reservada en JS)
   *   - Los valores dinámicos van entre llaves: {activeFilter}
   *   - Los atributos booleanos se pasan con llaves: level={42}
   *   - Los comentarios dentro de JSX usan { /* ... * / }
   */
  return (
    <div className="min-h-[100dvh] bg-slate-950/50 flex justify-center items-center sm:p-4">
      <div className="w-full h-[100dvh] sm:max-w-md sm:h-[90vh] sm:rounded-3xl sm:border sm:border-quest-border bg-quest-bg text-quest-text-main font-sans transition-colors duration-500 relative overflow-hidden flex flex-col shadow-2xl">

        {SHOW_PLAYGROUND ? (
          <DesignPlayground />
        ) : (
          <>
            <QuestHeader
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-quest-header-from via-quest-header-via to-quest-header-from p-4 transition-colors duration-500">
              {/* Cambiado de grid a flex-col para apilamiento vertical móvil */}
              <div className="flex flex-col gap-4">
                {filteredQuests.map((quest) => (
                  <QuestCardV1 key={quest.id} {...quest} />
                ))}
              </div>

              {filteredQuests.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-quest-text-muted text-xl">No hay misiones disponibles</p>
                </div>
              )}
            </main>
          </>
        )}

        {/* ── NAVEGACIÓN INFERIOR (Mobile) ─────────────────────────── */}
        {!SHOW_PLAYGROUND && <BottomNav />}
      </div>
    </div>
  );
}