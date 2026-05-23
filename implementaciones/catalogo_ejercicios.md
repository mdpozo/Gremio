# 🏋️ QuestFit — Catálogo de Ejercicios y Fuentes de Datos

Para que una aplicación de gamificación deportiva como **QuestFit** se sienta completa y variada, necesita un catálogo sólido de ejercicios clasificado por perfiles de usuario. 

Como estudiante de **DAM**, tienes dos vías principales para alimentar esta lista de ejercicios. A continuación, te detallo las mejores fuentes de datos y cómo estructurarlas en tu base de datos relacional.

---

## 🔌 1. Fuentes de Datos: APIs Públicas Gratuitas

Si en la **Fase 4** decides que tu servidor backend consuma datos de servicios externos en lugar de tenerlos en local, estas son las dos mejores opciones del mercado:

### Opción A: wger API (La opción recomendada)
*   **¿Qué es?** Es un proyecto open-source colaborativo y gratuito para gestionar entrenamientos y ejercicios.
*   **Punto fuerte:** **Es 100% gratuita y abierta** (no requiere tarjetas de crédito ni tiene límites de peticiones). Dispone de descripciones traducidas a varios idiomas (incluido el español) y filtros por músculos y equipamiento.
*   **Enlace de la API:** `https://wger.de/api/v2/exercise/`
*   **Uso:** Puedes hacer un `GET` a su endpoint para obtener cientos de ejercicios de fuerza y cardio con imágenes ilustrativas libres de derechos.

### Opción B: ExerciseDB (De RapidAPI)
*   **¿Qué es?** Una de las bases de datos de ejercicio más populares del mundo web.
*   **Punto fuerte:** Contiene más de 1300 ejercicios y cada uno incluye un **GIF animado** de alta calidad que muestra la técnica correcta para realizar el ejercicio.
*   **Inconveniente:** Requiere registrarse en RapidAPI y su plan gratuito está limitado a 500 peticiones al mes.

---

## 📊 2. El Esquema de Datos para QuestFit (Modelado de Base de Datos)

Para tu base de datos de PostgreSQL/MySQL en tu servidor Java Spring Boot, esta es la estructura lógica ideal para representar una misión/ejercicio:

```typescript
type Exercise = {
  id: number;
  title: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  maxProgress: number;          // Cantidad objetivo (Ej: 5 para 5km, 50 para 50 reps)
  unit: 'km' | 'rep' | 'min';   // Unidad de medida física
  reward: number;               // Monedas de oro que otorga
  profileClass: 'warrior' | 'ranger' | 'mystic'; // El perfil de rol al que va enfocado
};
```

---

## ⚔️ 3. Catálogo Propuesto por Perfiles RPG (Gamificación)

Para motivar al usuario, hemos clasificado los ejercicios en **tres perfiles de personajes RPG** que representan los distintos estilos de vida deportiva. Este catálogo ya está adaptado y listo para cargarse como la "semilla de datos" (Seed Data) en tu base de datos:

### 🛡️ Perfil 1: El Guerrero (Guerreros del Acero)
*   **Enfoque:** Fuerza, potencia, hipertrofia muscular y calistenia.
*   **Ejercicios del catálogo:**

| Ejercicio | Categoría | Dificultad | Objetivo | Unidad | Recompensa (Oro) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Forja de Acero** (Flexiones) | Fuerza | Media | 50 | reps | 500 |
| **Levantamiento Titánico** (Peso Muerto) | Fuerza | Épica | 1 | rep (máximo peso)| 1000 |
| **Poder de la Gravedad** (Dominadas) | Fuerza | Difícil | 15 | reps | 600 |
| **Pilar de Piedra** (Sentadillas con peso) | Fuerza | Media | 30 | reps | 400 |
| **Rompe-Límites** (Fondos de tríceps) | Fuerza | Difícil | 20 | reps | 550 |

---

### 🏹 Perfil 2: El Explorador (Cazadores del Viento)
*   **Enfoque:** Resistencia aeróbica, velocidad, quema de calorías y salud cardiovascular.
*   **Ejercicios del catálogo:**

| Ejercicio | Categoría | Dificultad | Objetivo | Unidad | Recompensa (Oro) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Maratón del Guerrero** (Running) | Cardio | Difícil | 5.0 | km | 500 |
| **Sprints del Cazador** (HIIT) | Cardio | Media | 10 | sprints | 450 |
| **Cruce de Ríos** (Natación) | Cardio | Difícil | 1.5 | km | 700 |
| **El Vuelo del Halcón** (Saltar a la comba)| Cardio | Fácil | 10 | minutos | 250 |
| **Ruta del Nómada** (Ciclismo de ruta) | Cardio | Épica | 25.0 | km | 900 |

---

### 🧘 Perfil 3: El Místico (Monjes de la Armonía)
*   **Enfoque:** Elasticidad, movilidad, equilibrio mental, control de la respiración y recuperación muscular activa.
*   **Ejercicios del catálogo:**

| Ejercicio | Categoría | Dificultad | Objetivo | Unidad | Recompensa (Oro) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Yoga del Amanecer** (Vinyasa Flow) | Flexibilidad | Media | 30 | minutos | 300 |
| **Estiramientos del Sabio** (Full body) | Flexibilidad | Fácil | 15 | minutos | 200 |
| **Postura del Árbol Milenario** (Equilibrio) | Flexibilidad | Difícil | 5 | minutos | 400 |
| **Aliento del Dragón** (Meditación y respiración)| Flexibilidad| Fácil | 10 | minutos | 150 |
| **Despertar Articular** (Movilidad matutina) | Flexibilidad | Fácil | 12 | minutos | 180 |

---

## 💡 Recomendación Académica para tu Presentación de DAM

Para tu proyecto, la estrategia más profesional y que más valorará el tribunal es la **híbrida**:
1.  **Datos Locales Controlados (Tu Catálogo RPG):** Crear el catálogo de arriba precargado en tu base de datos mediante un script SQL (`data.sql` en Spring Boot). Esto asegura que tu sistema de gamificación (misiones y recompensas) esté 100% equilibrado y sea visualmente perfecto para la demo.
2.  **Integración con API Externa (wger):** Ofrecer una sección opcional llamada *"Explorar más ejercicios"* en la aplicación, donde consumas en tiempo real la API de `wger` para buscar rutinas adicionales por músculos o equipamiento. ¡Esto demostrará al tribunal que sabes consumir servicios web REST externos avanzados!
