# 🛡️ Tablón de Misiones de Desarrollo — QuestFit

¡Bienvenido al panel de control del Gremio de Desarrollo! Este archivo es tu cuaderno de bitácora interactivo. Aquí registramos las misiones de código completadas, los sistemas que tenemos "a medias" y los próximos desafíos según nuestra ruta incremental de aprendizaje para **DAM**.

---

## 📊 Estadísticas del Desarrollador
*   **Progreso del Proyecto:** `[████░░░░░░░░░░░] 25% completado`
*   **Nivel del Gremio:** `Nivel 2 — Adepto de Sensores 🛰️`
*   **Estado del Servidor local:** `Activo (Vite + React)`

---

## 🏆 Misiones de Código Completadas (100% Listas)
Estas misiones han sido integradas, probadas y están 100% operativas en la aplicación.

*   `[x]` **Misión 1: Iniciación del Héroe (Onboarding Quiz)**
    *   *Detalle:* Cuestionario interactivo basado en el estándar científico **IPAQ** para clasificar la actividad física y el sedentarismo del usuario.
    *   *Sensorial:* Efecto de carga rítmica con la Vibration API y bienvenida sonora interactiva con la Web Speech API al revelar la clase RPG (Guerrero 🛡️, Explorador 🏹, Místico 🧘).
*   `[x]` **Misión 2: El Códice de Recompensas (Persistencia de Perfil)**
    *   *Detalle:* Guardado persistente de la Clase, Multiplicador físico, Oro, Nivel RPG y Experiencia (XP) en el dispositivo del usuario con `localStorage`.
    *   *Gamificación:* Algoritmo de subida de nivel automática (Level Up) cada 100 XP con alertas en pantalla.
*   `[x]` **Misión 3: El Espejo de Dificultad (Algoritmo Dinámico)**
    *   *Detalle:* Adaptación matemática de los objetivos y recompensas de las misiones del tablón usando los multiplicadores resultantes del test de iniciación (Bajo `x0.5`, Moderado `x1.0`, Alto `x1.5`).
*   `[x]` **Misión 4: Rastreo del Explorador (GPS & Haversine - Fase 2)**
    *   *Detalle:* Sensor de geolocalización físico activo (`watchPosition`) para misiones de Cardio. Cálculo trigonométrico de distancia real mediante la Fórmula del Haversine con filtro estricto de precisión (`accuracy > 50`) para evitar saltos fantasma.
    *   *UX:* Panel de telemetría satelital con coordenadas dinámicas en vivo.
    *   *Hitos Sensoriales:* Alerta de voz sintética y vibración pesada doble (`[300, 100, 300]`) cada vez que el usuario completa 1 kilómetro real.

---

## ⏳ Misiones en Progreso / A Medias (Parciales)
Sistemas que tienen la base lógica estructurada pero les falta desarrollo visual o persistencia para estar completos.

*   `[/]` **Misión 5: El Historial de Hazañas (Historial de Sesiones - Fase 1)**
    *   *Estado:* La persistencia del perfil actual ya funciona, pero nos falta crear una **vista dedicada en el dashboard** que pinte el listado histórico de entrenamientos completados con sus respectivas fechas de consecución, para que el usuario pueda ver sus logros pasados.

---

## 🔮 Próximas Misiones del Tablón (Pendientes en la Ruta)
Desafíos organizados cronológicamente según la ruta de aprendizaje incremental de DAM.

### 🗺️ Fase 3: Cartografía Cyberpunk (El Mapa Visual)
*   `[ ]` Integrar la librería **Leaflet.js** y capas gratuitas de **OpenStreetMap** con estilo oscuro neón.
*   `[ ]` Dibujar la línea de trayecto (`polyline`) en tiempo real en la pantalla de entrenamiento activo a medida que el GPS reporta movimiento.

### 🌐 Fase 4: El Oráculo Central (Servidor Backend + DB)
*   `[ ]` Crear una base de datos relacional (MySQL/PostgreSQL) para registrar cuentas y sincronizar progresos.
*   `[ ]` Desarrollar la API REST en **Java Spring Boot** (o Node.js) con endpoints de Login, Registro y guardado en la nube.
*   `[ ]` Reemplazar `localStorage` por llamadas fetch asíncronas para la persistencia global de cuentas.

### 👥 Fase 5: El Gremio Social (Rankings, Lobbies y Piques)
*   `[ ]` Desarrollar la estructura Many-to-Many en base de datos para la lista de amigos y solicitudes.
*   `[ ]` Integrar **WebSockets** para sincronizar entrenamientos compartidos en vivo.
*   `[ ]` Diseñar la pantalla de Ranking Semanal con podio para comparar oro y XP entre amigos.
*   `[ ]` Programar las notificaciones internas de pique cuando un amigo supera tu récord.

### 📱 Fase 6: La Forja Multiplataforma (Capacitor & Android Studio)
*   `[ ]` Configurar **Capacitor** para empaquetar el frontend en un proyecto nativo de Android.
*   `[ ]` Compilar y generar el archivo **`.apk`** instalable desde Android Studio.
*   `[ ]` Estudiar la sincronización nativa Bluetooth con smartwatches (WearOS).

---

## 📖 Instrucciones de Uso para el Aventurero
1.  Cada vez que termines una sesión de programación, actualiza este archivo en tu editor de código.
2.  Si has terminado un sistema, mueve el check a `[x]`.
3.  Si has empezado uno nuevo, márcalo como `[/]`.
4.  ¡Mantener este tablón limpio y ordenado te dará una claridad absoluta y una disciplina de desarrollo impecable!
