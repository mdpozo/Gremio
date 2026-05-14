/**
 * vite.config.ts — Configuración del bundler Vite
 *
 * Vite es la herramienta que:
 *   - Sirve la aplicación durante el desarrollo (servidor local con hot-reload)
 *   - Compila y optimiza el código para producción (genera la carpeta dist/)
 *
 * Este archivo le indica a Vite qué plugins usar. Los plugins extienden
 * las capacidades de Vite para soportar tecnologías concretas.
 */

import { defineConfig } from 'vite';

/**
 * Plugin de React para Vite.
 * React usa una sintaxis especial llamada JSX (o TSX para TypeScript):
 *   return <div className="...">Hello</div>;
 *
 * El navegador no entiende JSX de forma nativa. Este plugin transforma
 * el JSX a llamadas JavaScript puras que sí comprende el navegador:
 *   return React.createElement('div', { className: '...' }, 'Hello');
 *
 * También activa el Fast Refresh: cuando modificas un componente,
 * el navegador actualiza SOLO ese componente sin recargar la página.
 */
import react from '@vitejs/plugin-react';

/**
 * Plugin oficial de Tailwind CSS v4 para Vite.
 *
 * Tailwind v4 cambió su sistema de integración: ya no usa PostCSS como
 * procesador intermedio, sino que se integra directamente con Vite
 * a través de este plugin.
 *
 * Funciones del plugin:
 *   1. Escanea todos los archivos .tsx/.ts para detectar qué clases Tailwind se usan
 *   2. Genera solo el CSS necesario (tree-shaking de estilos)
 *   3. Aplica hot-reload cuando cambias clases en los componentes
 */
import tailwindcss from '@tailwindcss/vite';

/**
 * defineConfig() es una función helper de Vite que proporciona
 * autocompletado TypeScript en la configuración.
 */
export default defineConfig({
  plugins: [
    react(),       // Soporte para JSX/TSX y Fast Refresh
    tailwindcss(), // Procesamiento de utilidades CSS de Tailwind v4
  ],
});
