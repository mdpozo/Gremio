# 🏰 GuildBoard — Tablón de Misiones

> **Proyecto académico** | Fase 1 + Fase 2 del Briefing  
> Aplicación web que convierte rutinas de ejercicio en misiones de rol (RPG), recompensando al usuario con EXP, Oro y subidas de nivel.

---

## 📋 Índice

1. [¿Qué es GuildBoard?](#qué-es-guildboard)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
5. [Arquitectura Mobile-First](#arquitectura-mobile-first)
6. [Sistema de Temas Dinámicos](#sistema-de-temas-dinámicos)
7. [Laboratorio de Diseño (Playground)](#laboratorio-de-diseño-playground)
8. [Componentes explicados](#componentes-explicados)
9. [Roadmap de fases](#roadmap-de-fases)

---

## ¿Qué es GuildBoard?

GuildBoard es una **Single Page Application (SPA)** diseñada bajo una estricta arquitectura **Mobile-First** que transforma las rutinas de entrenamiento físico en una experiencia gamificada. Inspirado en los tablones de misiones de los juegos de rol (RPG), cada ejercicio se presenta como una **misión** con recompensas, progreso, límite de tiempo y dificultad.

Este repositorio representa la culminación de la **Fase 1 y 2 del Briefing**: prototipado visual avanzado, desarrollo front-end en React y sistemas de diseño escalables.

---

## Tecnologías utilizadas

### Por qué este stack

| Tecnología | Versión | Rol en el proyecto | Por qué se eligió |
|---|---|---|---|
| **React** | 19 | Framework UI | Componentes reutilizables, estado reactivo |
| **TypeScript** | 5.8 | Superset de JS | Tipado estricto, similar a Java para el programador |
| **Vite** | 6 | Bundler y servidor | Arranque instantáneo, HMR ultrarrápido |
| **Tailwind CSS** | 4 | Utilidades CSS | Motor moderno que soporta variables CSS dinámicas |
| **Radix UI** | — | Componentes accesibles | Primitivos sin estilos propios, base para menús y barras |
| **Lucide React** | — | Iconos SVG | Librería de iconos moderna y escalable |

---

## Estructura del proyecto

```text
GuildBoard/
│
├── 📄 index.html              ← Punto de entrada HTML
├── 📄 package.json            ← Dependencias y scripts npm
│
├── 📁 app/                    ← Código fuente de React
│   ├── 📄 main.tsx            ← Punto de entrada de React (Inyecta el ThemeProvider)
│   ├── 📄 App.tsx             ← Contenedor móvil, BottomNav y orquestador de estado
│   │
│   └── 📁 components/
│       ├── 📄 BottomNav.tsx       ← Navegación inferior fija (Inicio, Misiones, etc.)
│       ├── 📄 QuestHeader.tsx     ← Cabecera superior con título y filtros
│       ├── 📄 ThemeProvider.tsx   ← Contexto global que guarda el tema visual en LocalStorage
│       ├── 📄 ThemeSwitcher.tsx   ← Botón desplegable para cambiar de estilo
│       ├── 📄 DesignPlayground.tsx← Entorno aislado para probar nuevas tarjetas
│       │
│       ├── 📁 experiments/
│       │   └── 📄 QuestCardV1.tsx ← Tarjeta individual de la misión (Versión 1)
│       │
│       └── 📁 ui/                 ← Componentes primitivos base (Radix/Shadcn)
│
└── 📁 styles/                 ← Sistema de estilos y Design Tokens
    ├── 📄 index.css           ← Importaciones de Tailwind
    ├── 📄 theme.css           ← ¡NÚCLEO DEL DISEÑO! Aquí viven los 4 estilos visuales
    └── 📄 fonts.css           ← Tipografías
```

---

## Cómo ejecutar el proyecto

### Prerrequisitos
- [Node.js](https://nodejs.org/) v18 o superior instalado

### Instalación y arranque

```bash
# 1. Instalar todas las dependencias
npm install

# 2. Iniciar el servidor de desarrollo (Accesible desde tu móvil)
npm run dev
```

> **¡Pruébalo en tu móvil!**
> Al ejecutar `npm run dev`, Vite levantará el servidor exponiéndolo a tu red local gracias al flag `--host`. En la terminal verás una IP local (ej. `http://192.168.1.XX:5173`). Si conectas tu teléfono al mismo WiFi y abres esa IP en el navegador, verás la aplicación ejecutándose en un entorno móvil real en vivo.

La aplicación estará disponible en: **http://localhost:5173**

---

## Arquitectura Mobile-First

El proyecto ha pivotado desde un layout tradicional de escritorio a una experiencia puramente móvil. 

**¿Cómo se logró esto en código web?**
En `App.tsx`, el contenedor principal está restringido por las clases de Tailwind:
`w-full max-w-md h-screen relative overflow-hidden flex flex-col`

- `max-w-md`: Fija un ancho máximo (aprox 448px) simulando la pantalla de un móvil.
- `h-screen` y `overflow-hidden`: Asegura que la "pantalla" no crezca infinitamente.
- Las listas (`main`) usan `overflow-y-auto` para permitir un scroll independiente, dejando el componente `BottomNav.tsx` fijado con posición absoluta (`absolute bottom-0`) al pie del contenedor virtual, nunca tapando el contenido.

---

## Sistema de Temas Dinámicos

En lugar de utilizar colores fijos (hardcoded) como `bg-slate-900`, la aplicación utiliza una arquitectura semántica de **Design Tokens** acoplada a las nuevas funcionalidades de Tailwind CSS v4.

### Los 4 Estilos Elegantes
1. **Obsidiana (Dark Mode Clásico):** Grises carbón profundos con acentos dorados cobrizos.
2. **Pergamino (Light Mode):** Blanco crema suavísimo con acentos azul pizarra intenso.
3. **Bosque Profundo:** Verde bosque desaturado con toques salvia.
4. **Acero Valyrio (Minimalista):** Gris azulado mate con acento plata/azul hielo.

### ¿Cómo funciona el cambio en tiempo real?
1. **El CSS (`theme.css`):** Definimos el valor hexadecimal de las variables según el atributo `data-theme` del HTML:
   ```css
   [data-theme='obsidian'] { --quest-bg: #0f1115; --quest-accent: #b8905b; }
   [data-theme='parchment'] { --quest-bg: #fdfbf7; --quest-accent: #1e293b; }
   ```
2. **Tailwind v4 (`@theme inline`):** Le enseñamos a Tailwind a generar clases basadas en esas variables:
   ```css
   @theme inline {
     --color-quest-bg: var(--quest-bg);
   }
   ```
   *Esto nos permite escribir `className="bg-quest-bg"` en nuestros componentes React.*
3. **El Contexto (`ThemeProvider.tsx`):** Guarda la elección del usuario en la memoria del navegador (`localStorage`) y modifica dinámicamente el `<html>` agregando el atributo correspondiente.

---

## Laboratorio de Diseño (Playground)

Al desarrollar interfaces complejas, es útil tener un "lienzo en blanco" para diseñar sin la contaminación visual del resto de la app o la necesidad de navegar hasta una ruta específica.

Se ha implementado el componente `DesignPlayground.tsx`. Es un entorno de pruebas aislado donde podemos poner a prueba nuevas iteraciones visuales de componentes (ej. `QuestCardV2`).

**¿Cómo activarlo?**
En `App.tsx`, modifica la constante de la línea 35:
```tsx
// Cambiar a true ocultará la App y mostrará el Laboratorio
const SHOW_PLAYGROUND = true; 
```

---

## Componentes explicados (Analogías con Java)

### `ThemeProvider.tsx` — El Patrón Singleton Global
En React, pasar un dato (como el Tema elegido) desde el componente más alto hasta el último componente hijo manualmente se llama *Prop Drilling*. Para evitarlo, usamos la API `Context`, que funciona de manera similar a un patrón **Singleton** o un inyector de dependencias en Spring Boot: el dato vive en una burbuja global a la que cualquier componente puede acceder usando el Hook `useTheme()`.

### `BottomNav.tsx` — Renderizado Dinámico
En lugar de repetir el código HTML para cada botón del menú inferior, creamos un array de objetos (nuestros datos) y lo iteramos con `.map()` (equivalente a un `Stream.map()` en Java).
```tsx
const navItems = [
  { id: 'home', icon: Home, label: 'Inicio', active: false },
  // ...
];

// React dibuja un botón por cada elemento en el array
{navItems.map((item) => ( <button key={item.id}>{item.label}</button> ))}
```

### `QuestCardV1.tsx` — Componente Presentacional
Es un componente que cumple el principio de Responsabilidad Única (SOLID). No guarda estado ni hace peticiones de red; solo recibe los datos de la misión a través de un contrato estricto (una interfaz TypeScript) y "pinta" la interfaz.
Esto lo hace altamente predecible: las mismas Props (datos de entrada) siempre producirán exactamente la misma vista.

---

## Roadmap de fases

Siguiendo el briefing del proyecto:

### ✅ Fase 1 — Prototipado y Diseño Visual (COMPLETADA)
- [x] Definición de la identidad visual.
- [x] Diseño arquitectónico Mobile-First.

### ✅ Fase 2 — Desarrollo Front-End Avanzado (COMPLETADA)
- [x] SPA construida con React 19 + TypeScript.
- [x] Refactorización completa a interfaz de Smartphone.
- [x] Sistema avanzado de Theming dinámico (Persistent State).
- [x] Creación de entorno de pruebas (Design Playground).

### 🔲 Fase 3 — Back-End y Base de Datos (PRÓXIMO PASO)
- [ ] API REST con Java + Spring Boot.
- [ ] Endpoints: `GET /quests`, `POST /quests/{id}/complete`.
- [ ] Base de datos MySQL con tablas: `Users`, `Quests`, `Progress`.
- [ ] Lógica de negocio (Cálculo de recompensas y subidas de nivel).

### 🔲 Fase 4 — Testing y Despliegue
- [ ] Pruebas unitarias del backend con JUnit.
- [ ] Deploy completo del sistema.

---

*Documentación extendida para presentación académica. Stack: React 19 + TypeScript + Vite + Tailwind CSS v4.*
