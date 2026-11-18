# 🎓 Ecosistema QUEST — Guía de Diseño, Identidad y Defensa de TFG (DAM)

> **Documento Oficial de Preparación para la Defensa del TFG**  
> **Alumno:** Manuel  
> **Ciclo:** Desarrollo de Aplicaciones Multiplataforma (2º DAM)  
> **Asignaturas Vinculadas:** Desarrollo de Interfaces (DI), Programación Multimedia y Dispositivos Móviles (PMDM), Acceso a Datos (AD) y PSP.

---

## 🎨 1. Concepto y Justificación del Isotipo "Q"

El isotipo corporativo de **QUEST** se ha diseñado siguiendo principios de geometría euclidiana e isométrica:

1. **El Anillo Octogonal (El Núcleo):**
   * Representa la disciplina, el control y la estructura.
   * Acabado en cristal ahumado mate (*Smoked Glass*) al 15% de opacidad sobre fondo Obsidiana (`#0F0F0F`), con bisel blanco translúcido de 1px.
2. **La Cola Vectorial en 45° (El Vector de Avance):**
   * Un triángulo estilizado apuntando hacia la esquina superior derecha (45°).
   * **Significado Semiótico:** Superación personal, avance de nivel, progreso constante y vector de aceleración.
   * Se ilumina con el color de acento específico de cada aplicación:
     * 🏋️ **QuestFit (Cuerpo):** Ámbar / Fuego (`#F59E0B`)
     * 🎮 **QuestLog (Ocio):** Violeta Mística (`#8B5CF6`)
     * 📜 **QuestTask (Mente):** Cian Zafiro (`#06B6D4`)

---

## 🖼️ 2. Activos Gráficos Generados y Disponibles

| Archivo | Ubicación | Uso en el Proyecto y Memoria |
| :--- | :--- | :--- |
| **`quest-fit-icon.svg`** | `assets/` y `QuestFit/public/` | Vector SVG nítido para favicon web y cabecera móvil. |
| **`quest-log-icon.svg`** | `assets/` y `QuestLog/quest-log/public/` | Vector SVG con acento violeta para la bitácora gamer. |
| **`questfit_app_icon.jpg`** | `assets/` y `QuestFit/public/app-icon.jpg` | Render 3D fotorrealista para el icono nativo de Android (APK Capacitor) y carátula del TFG. |
| **`QuestLogo.tsx`** | `QuestFit/app/components/` | Componente React reutilizable con variantes para las tres apps. |

---

## 📊 3. Guion de las 3 Diapositivas Clave para el Tribunal de TFG

Utiliza esta estructura para impresionar al tribunal examinador:

### 📌 Diapositiva 1: La Problemática y la Identidad de Marca
* **Título:** *Ecosistema QUEST: Gamificación Enterprise sin Clichés Infantilizados.*
* **Puntos a defender:**
  * **El problema de mercado:** El 90% de las apps gamificadas recurren a estéticas infantiles (espadas de píxeles, pociones mágicas, tabernas) que alejan a usuarios adultos o deportistas serios.
  * **Nuestra solución:** Aplicar los resortes psicológicos del videojuego (bucles de dopamina saludables, progreso visual medible, consistencia) bajo una interfaz **sobria, clásica, deportiva y premium** (inspirada en marcas como *Strava, Whoop y Linear*).
* **Apoyo visual:** Mostrar el logotipo en Obsidiana con las tres variantes de color alineadas.

---

### 📌 Diapositiva 2: Arquitectura del Ecosistema y Escalabilidad
* **Título:** *Tres Dimensiones de la Vida Cotidiana bajo un Mismo Núcleo Técnico.*
* **Puntos a defender:**
  * **Tríada conceptual:** Salud física (QuestFit), Cultura digital y ocio (QuestLog) y Productividad mental (QuestTask).
  * **Coherencia de diseño (Asignatura DI):** Ambas interfaces comparten exactamente la misma morfología de chasis móvil (`100dvh`), sistema de variables CSS (`theme.css`), navegación inferior de cristal ahumado (`BottomNav`) y jerarquía tipográfica (`Plus Jakarta Sans` para títulos y `Inter` para datos).
  * **Economía de escala:** Un usuario que aprende a usar QuestFit se siente inmediatamente familiarizado en QuestLog.

---

### 📌 Diapositiva 3: Impacto Técnico, Eficiencia y Empaquetado Móvil
* **Título:** *Arquitectura Robusta, Eficiente y Multiplataforma (PMDM + AD + PSP).*
* **Puntos a defender:**
  * **Frontend moderno:** React 19 + TypeScript estricto con validación de formularios en tiempo de ejecución con **Zod**.
  * **Eficiencia energética:** Paleta en negro puro Obsidiana (`#0F0F0F`) diseñada específicamente para pantallas OLED de smartphones, reduciendo el consumo de batería durante los entrenamientos.
  * **Despliegue Nativo (Capacitor):** Sincronización transparente entre código web y plataforma nativa Android (APK funcional en dispositivo físico, acceso a vibración háptica con `Haptics` y ciclo de vida de la app).
