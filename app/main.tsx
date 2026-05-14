/**
 * main.tsx — Punto de entrada de la aplicación React
 *
 * Este es el primer archivo de React que se ejecuta. Su única misión es
 * "montar" (mount) la aplicación dentro del HTML.
 *
 * Analogía: Si index.html es el edificio y <div id="root"> es la habitación vacía,
 * este archivo es quien coloca todos los muebles (componentes React) dentro.
 *
 * Flujo de ejecución:
 *   1. Vite procesa index.html y encuentra <script src="/app/main.tsx">
 *   2. Este archivo se ejecuta en el navegador
 *   3. createRoot() busca <div id="root"> en el HTML
 *   4. .render() pinta <App /> dentro de ese div
 */

// StrictMode es un componente especial de React que activa comprobaciones
// adicionales solo en desarrollo (no afecta al rendimiento en producción).
// Avisa de patrones de código obsoletos o potencialmente problemáticos.
import { StrictMode } from 'react';

// createRoot es la función moderna de React 18+ para inicializar la app.
// Reemplaza al antiguo ReactDOM.render() que quedó obsoleto.
import { createRoot } from 'react-dom/client';

// Importamos el archivo CSS principal que carga Tailwind, el tema y las fuentes.
// Al importarlo aquí, Vite lo incluye en el bundle y lo aplica globalmente.
import '../styles/index.css';

// Importamos el componente raíz de nuestra aplicación.
// La extensión .tsx indica que es un archivo TypeScript con JSX (componentes React).
import App from './App.tsx';

import { ThemeProvider } from './components/ThemeProvider';

/**
 * createRoot(element) — Crea el "árbol" de React anclado a un elemento HTML.
 *
 * El operador "!" al final de getElementById('root') es TypeScript diciéndole
 * al compilador: "confía en mí, este elemento existe y no es null".
 * Se llama "Non-null assertion operator". Lo usamos porque sabemos con
 * certeza que index.html tiene un <div id="root">.
 *
 * .render(<App />) dibuja el componente App y todos sus hijos en el DOM.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="obsidian" storageKey="guildboard-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
