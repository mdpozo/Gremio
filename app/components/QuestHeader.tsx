/**
 * QuestHeader.tsx — Cabecera del Tablón de Misiones
 *
 * Responsabilidades de este componente:
 *   1. Mostrar el título épico de la sección
 *   2. Renderizar los botones de filtro por categoría
 *   3. Comunicar al componente padre qué filtro ha seleccionado el usuario
 *
 * Patrón de diseño: "Presentational Component" (Componente de Presentación)
 * Este componente no gestiona estado propio. Recibe todo lo que necesita
 * mediante props del padre (App.tsx) y le devuelve eventos mediante callbacks.
 *
 * Flujo de comunicación:
 *   App.tsx  ──props──▶  QuestHeader  ──callback──▶  App.tsx
 *   (da filtro activo)   (muestra UI)   (avisa del clic)  (actualiza estado)
 */

// Sparkles es un componente SVG de la librería Lucide React.
// Lucide ofrece más de 1000 iconos como componentes React,
// lo que significa que se renderizan como SVG inline (escalables y personalizables).
import { Sparkles } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

/**
 * QuestHeaderProps — Interfaz de Props
 *
 * En TypeScript, una "interface" define la forma (shape) de un objeto.
 * Aquí define exactamente qué datos debe recibir QuestHeader de su padre.
 *
 * Comparación con Java:
 *   - interface QuestHeaderProps ≈ clase con atributos + getters en Java
 *   - (filter: string) => void ≈ interfaz funcional (Consumer<String>) en Java
 *
 * Si App.tsx pasa una prop que no está en esta interfaz, TypeScript da error.
 * Si App.tsx omite una prop requerida, TypeScript también da error.
 * Esto previene bugs en tiempo de desarrollo, no en tiempo de ejecución.
 */
interface QuestHeaderProps {
  /** Categoría actualmente seleccionada: 'all', 'cardio', 'strength' o 'flexibility' */
  activeFilter: string;
  /** Función callback que se llama cuando el usuario clica un botón de filtro */
  onFilterChange: (filter: string) => void;
}

/**
 * Componente QuestHeader.
 *
 * La sintaxis "{ activeFilter, onFilterChange }: QuestHeaderProps" se llama
 * "desestructuración de parámetros". En lugar de recibir un objeto props
 * y acceder con props.activeFilter, extraemos directamente las propiedades.
 *
 * Equivalente sin desestructurar:
 *   function QuestHeader(props: QuestHeaderProps) {
 *     const activeFilter = props.activeFilter;
 *     const onFilterChange = props.onFilterChange;
 *   }
 */
export function QuestHeader({ activeFilter, onFilterChange }: QuestHeaderProps) {

  /**
   * Array de filtros disponibles.
   *
   * Cada filtro tiene:
   *   - id: el valor que se pasa al sistema de filtrado (coincide con quest.category)
   *   - label: el texto visible en el botón
   *
   * Esta estructura (array de objetos) permite añadir nuevas categorías
   * simplemente agregando un objeto al array, sin tocar el JSX.
   * Principio de programación: "Open/Closed" — abierto a extensión, cerrado a modificación.
   */
  const filters = [
    { id: 'all', label: 'Todas' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'strength', label: 'Fuerza' },
    { id: 'flexibility', label: 'Flexibilidad' },
  ];

  return (
    // <header> es un elemento semántico de HTML5.
    // Usar elementos semánticos mejora la accesibilidad (lectores de pantalla)
    // y el SEO (los motores de búsqueda entienden mejor la estructura).
    <header className="bg-gradient-to-r from-quest-header-from via-quest-header-via to-quest-header-from border-b border-quest-border px-4 py-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Top Header Row with Title and Theme Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-quest-accent animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-quest-text-title via-quest-accent to-quest-text-title bg-clip-text text-transparent">
              Misiones
            </h1>
          </div>
          
          <div className="flex-shrink-0">
            <ThemeSwitcher />
          </div>
        </div>

        {/* ── BOTONES DE FILTRO ─────────────────────────────────────────────
            Iteramos el array "filters" con .map() para generar un botón por cada filtro.
            Es el patrón más común en React para renderizar listas dinámicas.
        */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            // Usamos una arrow function en onClick para pasar el argumento filter.id.
            // Si escribiéramos onClick={onFilterChange}, React la llamaría sin argumentos.
            // onClick={() => onFilterChange(filter.id)} = "cuando ocurra el clic, ejecuta esto".
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-quest-accent-bg-from to-quest-accent-bg-to text-quest-bg shadow-lg shadow-quest-accent-glow scale-105'
                  : 'bg-quest-border-card/50 text-quest-text-main hover:bg-quest-border/50 hover:text-quest-text-title border border-quest-border'
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
