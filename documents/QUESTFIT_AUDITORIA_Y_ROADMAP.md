# ⚔️ QuestFit — Radiografía de Estado y Hoja de Ruta al 100%

> **Documento de Auditoría y Especificación Técnica**  
> **Proyecto:** QuestFit (App de Salud y Fitness Gamificado)  
> **Objetivo:** Transformar el prototipo actual en una aplicación móvil completa, funcional, interactiva y segura para el TFG de DAM.

---

## 1. 🔍 ¿Qué tenemos implementado y cómo funciona hoy?

### 🛠️ Stack Tecnológico Actual
* **Core:** React 19 + TypeScript (tipado estricto sin tipos `any`).
* **Estilos y Maquetación:** Tailwind CSS v4 + Variables CSS (Design Tokens en `theme.css`).
* **Empaquetador:** Vite (arranque ultrarrápido y compilación optimizada).
* **Animaciones y UX:** `@formkit/auto-animate` (animaciones automáticas en inserción/borrado de listas), `lucide-react` (iconografía vectorial), `sonner` (sistema de notificaciones toast).

---

### 🧩 Componentes Existentes y su Función

| Componente | Ubicación | Estado Actual | Funcionamiento Técnico |
| :--- | :--- | :---: | :--- |
| **`App.tsx`** | `app/App.tsx` | 🟡 Parcial | Orquestador principal. Define el contenedor móvil (`100dvh`, `sm:max-w-md`), almacena el filtro de categorías en un `useState` local y renderiza la lista de misiones estáticas. |
| **`QuestHeader.tsx`** | `app/components/QuestHeader.tsx` | 🟢 Maquetado | Barra superior con avatar, nivel de jugador, barra de experiencia visual (EXP) y bolsa de oro. Incluye los botones de filtro rápido (*Todos, Cardio, Fuerza, Flexibilidad*). |
| **`QuestCardV1.tsx`** | `app/components/experiments/QuestCardV1.tsx` | 🟡 Visual | Tarjeta de misión con título, descripción, icono de categoría, indicador de dificultad (*fácil, media, difícil, épica*), tiempo restante y barra de progreso. *(Aún no tiene botón para interactuar o sumar repeticiones)*. |
| **`BottomNav.tsx`** | `app/components/BottomNav.tsx` | 🟡 Visual | Menú inferior móvil con 4 accesos: *Inicio, Misiones, Inventario, Perfil*. Actualmente solo tiene la pestaña *Misiones* marcada como activa y no cambia de pantalla al pulsar. |
| **`ThemeProvider.tsx`** | `app/components/ThemeProvider.tsx` | 🟢 Funcional | Contexto React global que lee y persiste el tema elegido en `localStorage`, inyectando el atributo `data-theme` al elemento raíz para conmutar paletas de color en caliente. |
| **`ThemeSwitcher.tsx`** | `app/components/ThemeSwitcher.tsx` | 🟢 Funcional | Selector interactivo de temas (Obsidiana, Pergamino, Bosque, etc.). |
| **`DesignPlayground.tsx`**| `app/components/DesignPlayground.tsx` | 🟢 Auxiliar | Laboratorio aislado activable con un booleano para diseñar y testear nuevos componentes de UI sin romper el flujo real. |

---

### ⚠️ Limitaciones del Prototipo Actual
1. **Datos volátiles (Hardcoded):** Las 6 misiones existen como un array fijo en `App.tsx`. Si se recarga la página, nada persiste.
2. **Sin interacción de progreso:** No se puede pulsar sobre una misión para decir *"He hecho 1 km más"* o *"Completada"*.
3. **Navegación bloqueada:** Las otras tres secciones del menú inferior (*Inicio*, *Inventario*, *Perfil*) no tienen pantalla asociada todavía.
4. **Economía y EXP estáticas:** El oro (500) y el nivel (12) son números pintados a mano; no hay una fórmula real de ganancia ni de subida de nivel.

---

## 2. 🚀 ¿Qué falta implementar para que esté 100% COMPLETA en uso?

Para que un usuario real (o el tribunal examinador de DAM) pueda utilizar la app de forma satisfactoria en su día a día, implementaremos las siguientes cuatro capas:

### 🎮 Capa A: El Motor RPG y Mecánicas de Juego (Game Loop)
* **Gestor de Estado Centralizado (`QuestContext`):**
  * Estado global con: `player` (nivel, expActual, expSiguienteNivel, oro, rachaDeDias) y `quests` (array dinámico de misiones).
  * **Persistencia local automática:** Todo cambio se sincroniza en `localStorage` al instante.
* **Fórmula de Nivel y Experiencia:**
  * Curva de progresión: `EXP_SIGUIENTE_NIVEL = Nivel * 150`.
  * Al llegar al 100% de la barra: **Celebración de Level-Up** (modal con confeti/animación de rango y aumento de nivel).
* **Interacción con las Misiones:**
  * Botón para sumar progreso a una misión activa (`+1` km, `+10` repeticiones).
  * Botón de **"Reclamar Recompensa"** cuando `progreso >= maxProgreso`:
    * Notificación enriquecida con `sonner` (+Oro, +EXP).
    * La misión pasa a estado *"Completada"* y se archiva en el historial del día.

---

### 📱 Capa B: Las 4 Pantallas del Menú Inferior

```
                           QUESTFIT
                              │
     ┌────────────────┬───────┴────────┬────────────────┐
     ▼                ▼                ▼                ▼
 1. INICIO        2. MISIONES     3. BAZAR/TIENDA    4. PERFIL
(Dashboard)      (Tablón + Crea)   (Recompensas)    (Stats RPG)
```

1. **Pantalla 1 — Inicio (El Campamento Base):**
   * Saludo al aventurero según la hora del día (*"Buenos días, Guerrero"*).
   * **Racha activa (Daily Streak):** Días consecutivos entrenando con icono de fuego.
   * **Misión del Día Destacada:** Acceso rápido para continuar el entrenamiento actual.
   * Resumen rápido: Calorías estimadas, minutos entrenados y misiones hechas hoy.

2. **Pantalla 2 — Tablón de Misiones (Mejorado):**
   * Mantener el tablón actual con sus filtros por categoría y animaciones.
   * **Botón Flotante de Creación (`+ Nueva Misión`):** Modal con formulario validado con Zod para que el usuario cree sus propios retos (Nombre, Categoría, Repeticiones/Km, Recompensa estimada y Dificultad).
   * Filtro adicional: *Activas* vs *Completadas hoy*.

3. **Pantalla 3 — Inventario y Bazar (Gastar el Oro):**
   * **Tienda de Recompensas Reales:** El usuario puede crearse autorecompensas canjeables con oro del juego (ej: *"Ver un capítulo de serie = 200 Oro"*, *"Comida trampa fin de semana = 1000 Oro"*).
   * **Pociones de Buff:**
     * *Poción de Sabiduría:* Duplica la EXP de las misiones durante las próximas 2 horas.
     * *Poción de la Suerte:* Añade +50% de oro extra a la siguiente misión.
   * **Títulos de Aventurero:** Títulos desbloqueables por nivel (*"Recluta", "Cazador de Hierro", "Titán del Acero"*).

4. **Pantalla 4 — Perfil de Personaje (Hoja RPG):**
   * Radar o barras de estadísticas RPG basadas en el tipo de ejercicio completado:
     * **Fuerza (STR):** Aumenta con misiones de musculación/pesas/calistenia.
     * **Resistencia (END):** Aumenta con cardio/running/bicicleta.
     * **Agilidad (AGI):** Aumenta con estiramientos/yoga.
   * Historial de misiones completadas.
   * Selector de temas de color y botón para reiniciar datos (con confirmación).

---

### 🔊 Capa C: Efectos Sensoriales (Feedback Inmersivo)
* **Feedback Háptico:** Vibración corta del smartphone al marcar progreso y vibración enérgica al subir de nivel (vía `navigator.vibrate` / Capacitor Haptics).
* **Efectos de Sonido RPG:** Sonidos sintéticos ligeros mediante la API nativa de Audio de la web (tintineo de monedas al ganar oro, fanfarria breve al subir de nivel).

---

## 3. 🔒 Seguridad, Robustez y Buenas Prácticas a Considerar

Para que el proyecto tenga un nivel de acabado intachable de cara a la defensa del TFG de DAM:

### 🛡️ 1. Seguridad en Frontend y Gestión de Datos
* **Validación de Formularios con Zod:**
  * Al crear una misión, validar que el título no esté vacío, las repeticiones sean enteros positivos (> 0) y los textos tengan longitud máxima para evitar desbordamientos visuales.
* **Sanitización contra XSS:**
  * No inyectar HTML arbitrario (`dangerouslySetInnerHTML`). React escapa texto por defecto, pero sanitizaremos cualquier input que pueda contener caracteres conflictivos.
* **Integridad del Almacenamiento Local (`localStorage`):**
  * Control de errores con bloques `try/catch` para manejar modo incógnito o cuotas de almacenamiento llenas.
  * Estructura versionada de datos (`QUESTFIT_V1_STATE`) con valores por defecto seguros por si el JSON almacenado se corrompe.

### 🌐 2. Preparación para el Backend Futuro (Spring Boot / API REST)
* **Arquitectura desacoplada (Patrón Service / Repository en React):**
  * Todo acceso a datos debe pasar por una capa intermedia (`questService.ts`). Hoy este servicio lee y escribe en `localStorage`. Cuando se levante Spring Boot en la siguiente fase, solo habrá que cambiar las funciones internas por llamadas `fetch('/api/quests')` sin tocar ningún componente visual.
* **Seguridad sin estado (Stateless):**
  * Preparar las cabeceras para inyectar `Authorization: Bearer <JWT>` tan pronto como se conecte el módulo de login.

### 📱 3. Empaquetado Nativo en Android (Capacitor)
* **Permisos Justificados:** Solo solicitar permisos estrictamente necesarios en `AndroidManifest.xml` (acceso a vibración háptica y notificaciones locales).
* **Manejo del Ciclo de Vida Móvil:** Asegurar que si el usuario minimiza la aplicación mientras entrena, el estado no se pierde al volver a abrirla.

---

## 4. 📅 Plan de Ejecución y Estado de Entrega

### ✅ Fase 1: Arquitectura y Vistas Principales (Completado)
* [x] **Paso 1:** Crear el **`QuestContext`** con persistencia en `localStorage` (oro, nivel, EXP, misiones dinámicas y acciones de sumar progreso / completar).
* [x] **Paso 2:** Hacer interactiva la **`QuestCard`** (botones de sumar avance, barra reactiva y botón de cobrar recompensa con animación y sonido).
* [x] **Paso 3:** Conectar la navegación del **`BottomNav`** para alternar entre las 4 pantallas (*Inicio, Misiones, Bazar, Perfil*).
* [x] **Paso 4:** Desarrollar la pantalla de **Inicio (Dashboard del Atleta)**.
* [x] **Paso 5:** Desarrollar el modal de **Creación de Nuevas Misiones** con validación Zod.
* [x] **Paso 6:** Desarrollar la pantalla de **Inventario/Bazar** (canje de recompensas y autorecompensas).
* [x] **Paso 7:** Desarrollar la pantalla de **Perfil (Hoja RPG con stats de Fuerza, Resistencia y Agilidad)**.

---

### 🚀 Fase 2: Perfeccionamiento y Remate al 100% de QuestFit (Completado al 100%)
Para garantizar una experiencia de usuario sobresaliente y una defensa impecable de TFG antes de pasar a las otras dos apps del ecosistema:

* [x] **Tarea 2.1 — CRUD y Control Flexible de Rutinas:**
  * Implementar acción y confirmación de **eliminación de misiones** (`deleteQuest`) tanto desde el Drawer de detalle como con acceso rápido.
  * Selector de incremento de progreso flexible (`+1`, `+5`, `+10` o entrada manual de km/reps/minutos), superando la limitación del avance unitario simple.
* [x] **Tarea 2.2 — Modo "Sesión en Vivo" / Cronómetro HIIT & Descanso (PMDM Factor WOW):**
  * Modal/Vista de entrenamiento activo integrado en la rutina seleccionada (`LiveWorkoutModal.tsx`).
  * Cronómetro de series con temporizador de descanso configurable (30s, 45s, 60s, 90s).
  * Feedback auditivo interactivo (cuenta atrás 3, 2, 1, pitido de inicio de serie y campana de descanso en `sound.ts`).
  * Volcado automático de series/repeticiones completadas al progreso de la misión al finalizar la sesión con auto-completado si se alcanza el objetivo.
* [x] **Tarea 2.3 — Widget Semanal Interactivo en `HomeView`:**
  * Sustituir el texto plano por un componente de seguimiento de los 7 días de la semana (L, M, X, J, V, S, D).
  * Estado visual reactivo de días con entrenamientos completados y cómputo dinámico de adherencia semanal.
* [x] **Tarea 2.4 — Personalización del Atleta y Gestión de Premios:**
  * Edición del nombre del usuario y meta de condición física en `ProfileView` con guardado persistente.
  * Visualización de la escala de títulos atléticos por nivel (*Recluta, Atleta Intermedio, Titán del Acero, Leyenda Deportiva*).
  * Función para eliminar autorecompensas obsoletas en `ShopView` con confirmación.
* [x] **Tarea 2.5 — Sincronización y Validación Nativa con Android Capacitor:**
  * Compilación limpia con Vite + TypeScript (`npm run build`).
  * Sincronización automática de assets y plugins hacia Android (`npx cap sync android`).
  * Proyecto listo para compilar APK y ejecutar en emulador o dispositivo real.

---

## 📱 5. Guía de Ejecución y Emulación Móvil (Capacitor + Android Studio)

Esta sección documenta el flujo de trabajo híbrido para probar QuestFit en un teléfono virtual real en Windows sin perder la ayuda de la IA:

### 🔄 Flujo de Trabajo Profesional
1. **Programación con IA:** Todo el código (React, TypeScript, CSS y lógica) se desarrolla en este editor.
2. **Sincronización:** Capacitor traslada automáticamente el código web compilado a la carpeta nativa `/android`.
3. **Visor Móvil:** Android Studio actúa exclusivamente como el emulador del smartphone (`Pixel 9 Pro`).

### ⚡ Cómo ponerlo en marcha las siguientes veces

#### Opción A: Atajo Automático (Recomendado)
Desde la terminal en la carpeta `QuestFit`, ejecuta:
```bash
npm run android
```
Este comando encadena automáticamente:
1. `vite build` → Compila los últimos cambios web.
2. `cap sync` → Copia los assets a la plataforma Android nativa.
3. `cap open android` → Abre Android Studio con todo listo.

#### Opción B: Ejecución Manual o Directa desde Android Studio
1. Abre **Android Studio** desde el menú Inicio de Windows.
2. Abre el proyecto ubicado en:
   `C:\Users\Manu\Desktop\CESUR\SEGUNDO CURSO\Programacion Multimedia\QuestFit\android`
3. En la barra superior, asegúrate de que el dispositivo seleccionado es **Pixel 9 Pro** (o tu emulador de preferencia).
4. Pulsa el botón verde **Play ▶ (Run 'app')** o pulsa `Shift + F10`.
5. En la barra lateral derecha de Android Studio, haz clic en la pestaña **Running Devices** para ver la pantalla del teléfono interactiva.

---

## 4. 💎 Mejoras Recientes de Experiencia de Usuario (UX/UI)

1. **Pantalla de Inicio / Splash Screen de Arranque (Estilo Nativo / Instagram):**
   - Animación centrada del logotipo oficial `QuestLogo` (variante `: FIT`) con efecto respiración y halo de energía ámbar.
   - Eliminada la barra artificial de progreso para maximizar la percepción de agilidad y rendimiento instantáneo (*Perceived Performance* según directrices de Apple HIG y Material 3).
   - Tiempo de exposición ajustado a 1.0s con desvanecimiento y ligero escalado expansivo (*scale-105 fade-out*) hacia la aplicación principal.
   - Pie institucional de autoría del TFG.

2. **Perfeccionamiento del Tema Pergamino (Alta Legibilidad y Contraste):**
   - Reestructuración completa en [theme.css](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/styles/theme.css) mediante selectores de atributo comprehensivos (`[class*="bg-[#16161c]"]`, `[class*="bg-[#18181b]"]`, etc.).
   - Eliminación total de bloques oscuros o textos con bajo contraste que solapaban la lectura; títulos en tono tinta profunda (`#1c1917`), textos descriptivos en piedra cálida (`#57534e`) y fondos apergaminados limpios (`#faf6ee` y `#ffffff`).
   - Mantenimiento del contraste en botones de acción y badges de categorías/dificultades.

3. **Corrección de Modales y Accesibilidad (Botones de Cierre):**
   - Eliminadas las "X" duplicadas en [SettingsModal.tsx](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/app/components/SettingsModal.tsx) y [LiveWorkoutModal.tsx](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/app/components/LiveWorkoutModal.tsx), conservando un único botón de cierre flotante accesible en la esquina superior derecha (`DialogPrimitive.Close`).
   - Acceso al modal de ajustes centralizado exclusivamente en la pestaña de **Perfil** para mayor coherencia en la arquitectura de información.

4. **Accesibilidad de Fuentes del Sistema Android (Font Scaling):**
   - Corrección en [ProfileView.tsx](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/app/views/ProfileView.tsx) para evitar recortes del avatar y textos cuando el usuario activa fuentes grandes en los ajustes de accesibilidad de su teléfono Pixel.

5. **Entrenador Virtual por Voz (Text-to-Speech PMDM) y Vibración Háptica Nativa:**
   - Creación de [voiceCoach.ts](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/app/utils/voiceCoach.ts) utilizando la API de síntesis de voz en español para locución deportiva de inicio, series completadas, cuenta atrás de descanso y subida de nivel.
   - Conexión nativa con `@capacitor/haptics` en [haptics.ts](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/app/utils/haptics.ts) para vibración háptica táctil en dispositivos físicos Android.
   - Desbloqueo automático del contexto de audio en [sound.ts](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/app/utils/sound.ts) tras el primer toque en Android WebView.
   - Switch de control de la voz en el modal de Ajustes.

6. **Modo Entrenamiento Activo Focus (Estilo Hevy / NTC):**
   - Rediseño de [LiveWorkoutModal.tsx](file:///c:/Users/Manu/Desktop/CESUR/SEGUNDO%20CURSO/Programacion%20Multimedia/QuestFit/app/components/LiveWorkoutModal.tsx) con selector tri-modal:
     1. **Por Series (Hevy-style):** Botón táctil gigante según la Ley de Fitts para marcar fin de serie, con inicio automático del descanso y cuenta atrás por voz.
     2. **Toque Suelo (Hands-Free):** Superficie táctil masiva para flexiones/abdominales con el móvil en el suelo (toque con barbilla o palma con feedback sonoro/vibratorio inmediato).
     3. **Lote Rápido:** Botones de suma en bloque (`+5`, `+10`, `+25`, etc.) para registro ágil sin distracciones.

7. **Icono Oficial de Lanzador Android (Launcher & Adaptive Icons):**
   - Generadas todas las densidades de iconos nativos (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) para `ic_launcher.png`, `ic_launcher_round.png` y la capa de primer plano adaptativa `ic_launcher_foreground.png`.
   - Fondo de lanzador unificado en obsidiana `#09090C` para encajar con el diseño adaptativo squircle de los Google Pixel.
   - APK nativo recompilado con el icono oficial 3D de la `Q` y la hoja de energía ámbar.




