# 🎨 Decisiones de Diseño & Arquitectura de Marca — Ecosistema QUEST

> **Memoria Técnica de Diseño de Interfaces (DI) y Experiencia de Usuario (UX/UI)**  
> **Proyecto:** Ecosistema QUEST (TFG 2º DAM — CESUR)  
> **Autor:** Manuel  
> **Aplicaciones de la Suite:** QuestFit (Cuerpo & Salud), QuestLog (Ocio & Cultura Gamer), QuestTask (Mente & Enfoque)  
> **Visor Web:** [`VISOR_BRAND_QUEST.html`](./VISOR_BRAND_QUEST.html)

---

## 📑 Índice de Contenidos
1. [Galería de Activos Visuales & Merchandising](#1-galería-de-activos-visuales--merchandising)
2. [Fundamento Filosófico: Deporte Real vs Clichés Infantiles](#2-fundamento-filosófico-deporte-real-vs-clichés-infantiles)
3. [Geometría y Construcción del Isotipo: La "Q" Aerodinámica](#3-geometría-y-construcción-del-isotipo-la-q-aerodinámica)
4. [Sistema de Variantes: Nombre Largo vs Solo la "Q"](#4-sistema-de-variantes-nombre-largo-vs-solo-la-q)
5. [Sistema Cromático & Accesibilidad Ergonómica OLED](#5-sistema-cromático--accesibilidad-ergonómica-oled)
6. [Lenguaje de Materiales: Glassmorphism de Alto Rendimiento](#6-lenguaje-de-materiales-glassmorphism-de-alto-rendimiento)
7. [Microinteracciones, Audio Síntesis y Feedback Háptico](#7-microinteracciones-audio-síntesis-y-feedback-háptico)

---

## 1. Galería de Activos Visuales & Merchandising

### A. La Tríada del Ecosistema QUEST Completo (Fit, Log, Task)
*Visión global de la marca matriz QUEST y los tres pilares de producto con su equipamiento y colores identificativos.*

![La Tríada del Ecosistema QUEST](./assets/quest_ecosystem_triad.jpg)
*Ruta del activo:* [`assets/quest_ecosystem_triad.jpg`](./assets/quest_ecosystem_triad.jpg)

---

### B. Despliegue en Merchandising Deportivo QuestFit (Cuerpo)
*Fotografía de estudio mostrando la identidad en productos físicos reales de entrenamiento.*

![Kit Oficial de Merchandising QuestFit](./assets/quest_brand_merchandise.jpg)
*Ruta del activo:* [`assets/quest_brand_merchandise.jpg`](./assets/quest_brand_merchandise.jpg)

* **Camiseta Técnica Gymwear:** Silueta atlética con la "Q" aerodinámica y "QUESTFIT" en silicona mate.
* **Termo / Shaker Negro Mate:** Acero inoxidable con grabado láser de alta precisión.
* **Gorra Deportiva:** Isotipo "Q" bordado en relieve 3D en la corona frontal.

---

### C. Despliegue en Merchandising Pro-Gaming QuestLog (Ocio & Gaming)
*Setup oficial esport y accesorios de juego.*

![Kit Oficial Pro-Gaming QuestLog](./assets/questlog_brand_merch.jpg)
*Ruta del activo:* [`assets/questlog_brand_merch.jpg`](./assets/questlog_brand_merch.jpg)

* **Auriculares Inalámbricos Pro:** Acabado mate con copa iluminada con la "Q" violeta.
* **Mando Custom Esport:** Sticks con aro violeta y branding "QUESTLOG".
* **Alfombrilla XXL Topográfica:** Tejido micro-texturizado para sensor óptico.
* **Sudadera Heavyweight Gamer:** Corte oversize con serigrafía "Q QUESTLOG".
* **Tecla Artesanal:** Resina translúcida con "Q" violeta flotante.

---

### D. Despliegue en Merchandising Deep-Work QuestTask (Mente & Enfoque)
*Accesorios de escritorio y productividad ejecutiva.*

![Kit Oficial Deep-Work QuestTask](./assets/questtask_brand_merch.jpg)
*Ruta del activo:* [`assets/questtask_brand_merch.jpg`](./assets/questtask_brand_merch.jpg)

* **Temporizador Pomodoro CNC:** Aluminio cepillado con display cian 25:00.
* **Libreta Dot-Grid:** Encuadernación en piel sintética con bajorrelieve "Q".
* **Bolígrafo de Precisión:** Aluminio anodizado negro mate con anillo cian.
* **Taza de Cerámica:** Acabado carbón mate con grabado "QUESTTASK".
* **Desk Pad:** Cuero genuino pespunteado para escritorio.

---

### E. Manual de Variantes de Marca (Brand Lockups & Vajilla)
*Guía de construcción del logotipo completo, variantes cromáticas, menaje y botellín de agua.*

![Guía de Logotipos y Variantes QUEST](./assets/quest_brand_guidelines.jpg)
*Ruta del activo:* [`assets/quest_brand_guidelines.jpg`](./assets/quest_brand_guidelines.jpg)

* **Logotipo Principal:** Tipografía horizontal deportiva de alto impacto "QUEST".
* **Variantes por Aplicación:** `QUESTFIT` (Kinetic Amber) y `QUESTLOG` (Velocity Violet).
* **Accesorios:** Taza de cerámica oscura mate y botellín deportivo de ciclismo/running.

---

### C. Activos Vectoriales SVG (Integración Nativa en Código)
* **Vector Oficial QuestFit (Ámbar):** [`assets/quest-fit-icon.svg`](./assets/quest-fit-icon.svg)  
* **Vector Oficial QuestLog (Violeta):** [`assets/quest-log-icon.svg`](./assets/quest-log-icon.svg)  
* **Componente React Modular:** [`QuestFit/app/components/QuestLogo.tsx`](./QuestFit/app/components/QuestLogo.tsx)

---

## 2. Fundamento Filosófico: Deporte Real vs Clichés Infantiles

### Diagnóstico del Problema
La gran mayoría de aplicaciones que implementan mecánicas de gamificación (como *Habitica*) recurren a monstruos, espadas de madera pixeladas y pociones mágicas. Esto genera una barrera psicológica en el usuario deportista o adulto que entrena en serio.

### La Solución: "Gamificación Enterprise / Atlética"
QUEST adopta los resortes de la psicología conductual (barras de experiencia, consistencia de rachas y micro-recompensas), pero envueltos en una identidad **sobria, clásica, deportiva y de alta tecnología** inspirada en firmas como *Gymshark, Strava, Whoop, Apple Fitness y Nike Lab*.

| Dimensión | Gamificación Tradicional (Cliché) | Ecosistema Deportivo QUEST |
| :--- | :--- | :--- |
| **Estilo Visual** | Pixel Art / Fantasía Medieval infantil | Dark Tech / Minimalismo Deportivo de Lujo |
| **Unidades de Medida** | "Puntos de Maná" / "Monedas de Oro" | Repeticiones, Kilómetros, Minutos, Series, XP |
| **Paleta Base** | Fondos multicolor saturados | Graphite Base (`#1C1C1F`) y Obsidiana (`#0C0C0F`) |
| **Logotipo** | Espadas de madera o pergaminos | Emblema aerodinámico de velocidad continua ("Q") |
| **Recompensas** | Armaduras virtuales / Mascotas | Auto-recompensas reales (masaje deportivo, comida trampa, descanso) |

---

## 3. Geometría y Construcción del Isotipo: La "Q" Aerodinámica

El isotipo central abandona la rigidez estática para adoptar una geometría inspirada en la dinámica de fluidos y la velocidad:

1. **Inclinación Deportiva Itálica (-14°):** Rompe la verticalidad estática transmitiendo movimiento hacia adelante y aceleración continua.
2. **Curvatura Perimetral Suave:** Transiciones fluidas entre tramos verticales y horizontales, evocando las líneas de diseño del material deportivo de alta gama (calzado de running de placa de carbono, cuadros aerodinámicos de ciclismo).
3. **Cuña de Aceleración (Cola de la "Q"):** Un corte en bisel afilado que arranca del cuadrante inferior y se proyecta dinámicamente hacia la derecha.
4. **Respuesta Vectorial:** Renderizado nativo por coordenadas SVG, permitiendo su escalado sin pérdida de nitidez desde un favicon de 16x16 px hasta una serigrafía en gran formato.

---

## 4. Sistema de Variantes: Nombre Largo vs Solo la "Q"

Para asegurar versatilidad en todos los puntos de contacto de la marca:

* **Logotipo Completo (Horizontal con Sintaxis Modular):**
  * Uso prioritario en encabezados, interfaces de escritorio, frontal de prendas deportivas y cabeceras de documentación.
  * Jerarquía modular mediante separador de dos puntos: **`QUEST`** (marca matriz) ➔ **`QUEST : FIT`**, **`QUEST : LOG`**, **`QUEST : TASK`**. Esta arquitectura resuelve cualquier colisión de nombres con webs externas y refuerza la identidad como ecosistema unificado.
* **Isotipo Aislado (Solo la "Q"):**
  * Uso en el icono nativo de la aplicación móvil (Capacitor Android APK), avatares, bordados de gorras, menaje y favicons.
  * Funciona como sello identificativo instantáneo gracias a su silueta inconfundible.

---

## 5. Sistema Cromático & Accesibilidad Ergonómica OLED

| Token Semántico | Código HEX | Uso en Interfaz | Justificación Técnica & Psicológica |
| :--- | :---: | :--- | :--- |
| **Graphite Base** | `#1C1C1F` / `#0C0C0F` | Fondo basal de la aplicación | Píxeles completamente apagados en paneles OLED/AMOLED durante el entrenamiento, ahorrando batería. |
| **Zinc Surface** | `#14141A` | Fondo de cards y modales | Genera una elevación visual sutil respecto al fondo sin necesidad de contrastes agresivos. |
| **Glass Border** | `rgba(255,255,255,0.08)` | Bordes y divisores | Delimita componentes táctiles respetando la jerarquía visual limpia. |
| **Kinetic Amber (Fit)** | `#FF9F1C` | Acento principal de QuestFit | Longitud de onda cálida asociada al calor metabólico, sudor y esfuerzo físico. |
| **Velocity Violet (Log)** | `#7D3CFF` | Acento principal de QuestLog | Color asociado a la cultura de videojuegos, inmersión y creatividad digital. |
| **Cyan Sapphire (Task)**| `#06B6D4` | Acento principal de QuestTask | Color frío que reduce la fatiga visual y promueve la concentración profunda. |
| **Text Primary** | `#FFFFFF` | Títulos y métricas clave | Contraste WCAG AAA (> 14:1) para lectura inmediata durante el ejercicio. |

---

## 6. Lenguaje de Materiales: Glassmorphism de Alto Rendimiento

```css
.quest-glass-card {
  background: rgba(20, 20, 26, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.5);
}
```

* **Filtro `blur(14px)`:** Suaviza el fondo sin penalizar la GPU de los dispositivos móviles.
* **Micro-borde de 1px:** Delimita las tarjetas táctiles con precisión quirúrgica.

---

## 7. Microinteracciones, Audio Síntesis y Feedback Háptico

* **Audio Síntesis en Tiempo Real (Web Audio API):**
  * Tono sinusoidal a `880 Hz` (duración `0.08s`) al registrar repeticiones o kilómetros.
  * Acorde armónico ascendente (`440 Hz` -> `554 Hz` -> `659 Hz`) al completar rutinas o subir de nivel.
* **Capacitor Haptics Nativo:**
  * Toque de botón: `ImpactStyle.Light`.
  * Fin de rutina: `ImpactStyle.Medium`.
  * Canjear premio: `NotificationType.Success`.
