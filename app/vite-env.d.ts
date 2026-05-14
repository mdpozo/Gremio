/**
 * vite-env.d.ts — Declaraciones de tipos para el entorno de Vite
 *
 * Este archivo le enseña a TypeScript a reconocer las importaciones
 * especiales que Vite soporta pero que TypeScript no conoce nativamente.
 *
 * ¿Por qué es necesario?
 * TypeScript solo entiende archivos .ts y .tsx de forma nativa.
 * Cuando escribimos:
 *   import '../styles/index.css'      ← ¿Qué tipo devuelve un CSS?
 *   import logoUrl from './logo.svg'  ← ¿Qué tipo tiene una imagen?
 *
 * TypeScript no lo sabe y da error. El paquete "vite/client" contiene
 * las declaraciones de tipo que resuelven este problema:
 *   - Importaciones de CSS (side-effect imports)
 *   - Importaciones de imágenes (.png, .svg, .jpg...)
 *   - Importaciones de archivos de texto, JSON, WASM...
 *   - Variables de entorno de Vite (import.meta.env.VITE_*)
 *   - Hot Module Replacement API (import.meta.hot)
 *
 * La directiva "triple slash" (///) es la forma de TypeScript de referenciar
 * un archivo de declaraciones externo, similar a un @import en CSS.
 */
/// <reference types="vite/client" />
