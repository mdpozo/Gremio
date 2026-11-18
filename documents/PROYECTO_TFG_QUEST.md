# 🛡️ Ecosistema QUEST — Proyecto de Fin de Grado (TFG DAM)

> **Ciclo Formativo de Grado Superior:** Desarrollo de Aplicaciones Multiplataforma (DAM)  
> **Alumno:** Manuel  
> **Título del Proyecto:** Ecosistema QUEST: Gamificación Integral Multiplataforma (Salud, Ocio y Productividad)  
> **Estado Actual:** Fase de Prototipado y Frontends Avanzados (Paso previo a la arquitectura Backend/BBDD y empaquetado móvil).

---

## 🎯 1. Visión General del Proyecto

El **Ecosistema QUEST** es una suite de tres aplicaciones interconectadas bajo una misma premisa: **la gamificación de la vida diaria** mediante mecánicas clásicas de videojuegos de rol (RPG: obtención de EXP, oro, rangos, avatares y progreso visual).

Para abarcar las tres áreas fundamentales del día a día de un usuario, el ecosistema se divide en una **tríada conceptual**:

```
                 ⚔️ ECOSISTEMA QUEST ⚔️
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
   QuestFit            QuestTask            QuestLog
 (Fuerza / Salud)   (Mente / Tareas)    (Ocio / Espíritu)
```

1. **QuestFit (Cuerpo / Salud):** Convierte rutinas deportivas (fuerza, cardio, flexibilidad) en misiones con recompensas.
2. **QuestTask (Mente / Productividad):** Convierte tareas cotidianas, estudio y sesiones de concentración (Pomodoro) en expediciones y mazmorras.
3. **QuestLog (Ocio / Cultura Digital):** Bitácora interactiva de videojuegos para documentar partidas, análisis técnicos y colecciones.

---

## 💻 2. Estado Actual: ¿Qué está ya implementado?

A continuación se detalla el trabajo técnico completado hasta la fecha:

### 🏋️ App 1: QuestFit (`/QuestFit`)
* **Stack Tecnológico:** React 19, TypeScript, Tailwind CSS v4, Vite, `@formkit/auto-animate`, `lucide-react`.
* **Arquitectura Mobile-First:**
  * Contenedor adaptativo estricto (`100dvh` y `sm:max-w-md`) que emula la experiencia táctil de un smartphone tanto en navegador como preparado para compilación móvil.
  * Menú de navegación inferior flotante (`BottomNav`).
* **Header de Personaje Dinámico:** Visualización del perfil del jugador (nivel, avatar, barra de experiencia acumulada, oro y filtros de categoría).
* **Tablón de Misiones Reactivo:**
  * Tarjetas de misiones físicas clasificadas por dificultad (*fácil, media, difícil, épica*) con barras de progreso y recompensas calculadas.
  * Filtrado instantáneo por categoría (*Cardio, Fuerza, Flexibilidad*) con animaciones fluidas (`useAutoAnimate`) y estados vacíos (*Empty States*).
* **Design Tokens y Temas en Caliente:** Sistema de temas mediante CSS Variables y Context API (`ThemeProvider`), permitiendo alternar estilos visuales (Obsidiana, Pergamino, Bosque).
* **Laboratorio de Componentes:** Entorno aislado de pruebas (`DesignPlayground`) para diseñar componentes sin alterar el flujo de datos principal.

### 🎮 App 2: QuestLog (`/QuestLog`)
* **Stack Tecnológico:** React, JavaScript (ES6+), Tailwind CSS, Chart.js, Context API.
* **Gestor de Estado y Persistencia:** `GameContext` con sincronización automática en `localStorage`, evitando pérdida de datos ante refrescos de página.
* **Módulo de Analítica y Gráficos (Chart.js):** Radar dinámico que mide facetas técnicas y artísticas de los videojuegos (jugabilidad, banda sonora, gráficos, historia).
* **Navegación y Rutas Dinámicas:** Vistas detalladas por juego con carga dinámica de parámetros (`/game/:id`) y gestión de scroll restaurado.
* **Colecciones Inteligentes:** Separación por estados (*Jugando, Pendientes, Completados*) evitando duplicidad mediante operaciones inmutables.
* **Buscador en Tiempo Real y Generador de Slugs:** Filtrado reactivo de títulos y creador de entradas con normalización de URLs (expresiones regulares).

---

## 🎨 3. Identidad Visual Cohesiva: QUEST Design System (Asignatura DI)

Para garantizar que el usuario perciba las 3 aplicaciones como una **suite unificada y profesional** (y no como proyectos aislados), el desarrollo se rige por un **Sistema de Diseño común**:

1. **Chasis Mobile-First Idéntico:** Las tres aplicaciones comparten exactamente el mismo contenedor adaptativo (`100dvh` en smartphone, marco con bordes redondeados y sombreado en escritorio).
2. **Header de Aventurero Unificado:** Barra superior persistente que muestra el avatar del usuario, nivel conjunto de cuenta, barra de experiencia (EXP) y bolsa de oro común.
3. **Navegación Inferior Homogénea (`BottomNav`):** Mismo estilo flotante, efecto *glassmorphism* (cristal translúcido con desenfoque) e iconografía estándar (`lucide-react`).
4. **Morfología de Tarjetas y Feedback:** Esquinas redondeadas (`rounded-2xl`), bordes sutiles con iluminación tenue (`border-white/10`) y sistema de notificaciones de recompensas (*toasts* dinámicos con `sonner`).
5. **Cromática: Fondo Común con Acento de Identidad:**
   * **Base universal:** Fondo oscuro profundo (Obsidiana `#0A0B10`) con toques dorados de recompensa (`#F59E0B`).
   * **QuestFit (Cuerpo/Fuerza):** Acento **Fuego/Ámbar** (`#F97316`) que evoca actividad física y dinamismo.
   * **QuestTask (Mente/Productividad):** Acento **Cian Rúnico/Zafiro** (`#06B6D4`) que evoca concentración y serenidad.
   * **QuestLog (Ocio/Espíritu):** Acento **Amatista Mística/Púrpura** (`#8B5CF6`) que evoca fantasía e inmersión en mundos virtuales.

---

## 🔨 4. ¿Qué falta por implementar? (Plan de Trabajo para el Curso)

Para completar los requisitos del TFG de DAM, los siguientes bloques están planificados:

### 📝 Bloque A: Desarrollo de la 3ª App — QuestTask (Productividad)
* **Gestor de Tareas Gamificadas:** Crear misiones diarias (ej. *"Estudiar 1 hora de Acceso a Datos"* = +50 EXP).
* **Mazmorra Pomodoro / Modo Foco:** Temporizador de concentración de 25 min; si el usuario no interrumpe la sesión, supera la sala y obtiene recompensas.
* **Integración del mismo lenguaje visual:** Reutilizar los componentes y diseño de QuestFit para mantener identidad de marca.

### ⚙️ Bloque B: Backend Centralizado y Base de Datos (Acceso a Datos / PSP)
* **Base de Datos Relacional (PostgreSQL / MySQL):**
  * Diseñar el esquema unificado: usuarios, stats globales de personaje, misiones físicas, tareas de productividad y backlog de videojuegos.
* **API REST en Java (Spring Boot):**
  * Creación de endpoints unificados para dar servicio a las 3 aplicaciones.
  * Lógica de negocio compartida (la EXP y el oro acumulados en las tres apps suman al mismo perfil de aventurero).
* **Autenticación Segura (JWT):** Sistema de registro/login centralizado con tokens cifrados.

### 📱 Bloque C: Empaquetado Móvil Nativo (PMDM)
* **Integración con Capacitor (Ionic):** Envolver los proyectos web dentro de contenedores nativos para Android.
* **Generación de APK:** Compilación con Android Studio, configuración de iconos, *splash screen* y acceso a APIs nativas (vibración háptica `Haptics` al completar misiones, notificaciones push).

---

## 🎓 4. Justificación y Vinculación con las Asignaturas de 2º de DAM

Este proyecto reúne las competencias clave exigidas en el ciclo:

| Módulo de DAM | Aplicación Práctica en el Ecosistema QUEST |
| :--- | :--- |
| **Programación Multimedia y Dispositivos Móviles (PMDM)** | Diseño Mobile-First, animaciones interactivas, empaquetado en APK mediante Capacitor, despliegue en dispositivo móvil real. |
| **Desarrollo de Interfaces (DI)** | Diseño UX/UI avanzado, coherencia de diseño (Design Tokens, temas dinámicos, Glassmorphism, accesibilidad y usabilidad). |
| **Acceso a Datos (AD)** | Diseño del modelo Entidad-Relación, persistencia en BBDD relacional, mapeo objeto-relacional (JPA/Hibernate). |
| **Programación de Servicios y Procesos (PSP)** | Arquitectura cliente-servidor, endpoints RESTful en Java Spring Boot, seguridad y autenticación sin estado mediante JWT. |

---

## 📌 5. Puntos a Tratar con el Profesor / Tutor

1. **Aprobación del Alcance:** Validar la tríada de aplicaciones (QuestFit + QuestTask + QuestLog) como propuesta global de TFG.
2. **Elección de Backend:** Confirmar si se prefiere el desarrollo del backend en **Java (Spring Boot)** para enlazar con las asignaturas de 2º, o si se permite otra alternativa si fuera necesario.
3. **Despliegue y Defensa:** Acordar el formato de demostración final (demostración en directo con APK instalada en smartphone físico o emulador Android Studio + presentación de arquitectura).
