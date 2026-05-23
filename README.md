# 🏰 QuestFit — Tablón de Misiones (Documentación Académica Exhaustiva)

> **Proyecto Fin de Grado — Desarrollo de Aplicaciones Multiplataforma (DAM)**  
> **Autor/Desarrollador:** Aventurero del Gremio DAM  
> **Propósito del Documento:** Servir como guía teórica y técnica exhaustiva para la defensa del proyecto ante el tribunal académico.

---

## 📋 Índice General de Defensa
1. [El Concepto Core y Gamificación RPG](#1-el-concepto-core-y-gamificación-rpg)
2. [El Onboarding IPAQ: El Algoritmo Científico](#2-el-onboarding-ipaq-el-algoritmo-científico)
3. [Fase 2: Conteo GPS Real y la Fórmula del Haversine](#3-fase-2-conteo-gps-real-y-la-fórmula-del-haversine)
4. [La Seguridad en la Web Móvil: Contextos Seguros (Secure Contexts)](#4-la-seguridad-en-la-web-móvil-contextos-seguros-secure-contexts)
5. [Accesibilidad y Experiencia Sensorial Dual (Voz y Haptics)](#5-accesibilidad-y-experiencia-sensorial-dual-voz-y-haptics)
6. [Persistencia Local de Datos (LocalStorage vs SharedPreferences)](#6-persistencia-local-de-datos-localstorage-vs-sharedpreferences)
7. [Stack Tecnológico Explicado (Para el Tribunal)](#7-stack-tecnológico-explicado-para-el-tribunal)
8. [Arquitectura de Código y Mobile-First](#8-arquitectura-de-código-y-mobile-first)
9. [🗺️ Hoja de Ruta de Desarrollo Incremental (Roadmap DAM)](#9-️-hoja-de-ruta-de-desarrollo-incremental-roadmap-dam)

---

## 1. El Concepto Core y Gamificación RPG

**QuestFit** nace de una problemática social crítica: **el sedentarismo y la falta de adherencia al deporte**. Las aplicaciones deportivas tradicionales (como Nike Run Club o Strava) son excelentes para deportistas ya motivados, pero resultan aburridas y monótonas para el público sedentario o la gente joven que busca estímulos constantes.

La solución de QuestFit es la **Gamificación Social RPG (Role Playing Game)**. Transformamos el esfuerzo físico en el "combate" de un héroe de videojuego:
*   **Misiones:** Los entrenamientos son misiones asignadas por el Gremio.
*   **Clases RPG:** Guerrero 🛡️ (Fuerza), Explorador 🏹 (Cardio) o Místico 🧘 (Flexibilidad).
*   **Recompensas:** Al sudar en la realidad, el aventurero gana monedas de **Oro**, **Experiencia (XP)** y **Sube de Nivel** en la aplicación.

> **¿Qué es una SPA (Single Page Application)?**  
> QuestFit está estructurada como una SPA. A diferencia de las webs tradicionales donde cada clic recarga la página por completo, en una SPA solo se descarga **un único archivo HTML (`index.html`)** al inicio. JavaScript (React) se encarga de interceptar la navegación y sustituir componentes visuales en milisegundos en la pantalla del usuario. Esto crea una fluidez idéntica a la de una app nativa descargada en la tienda.

---

## 2. El Onboarding IPAQ: El Algoritmo Científico

Para evitar un error común en la medicina deportiva, **QuestFit rechaza por completo el uso del IMC (Índice de Masa Corporal)** para calcular perfiles deportivos, ya que el IMC no distingue entre grasa y masa muscular, resultando en una métrica obsoleta y desfasada.

En su lugar, implementamos el **IPAQ (International Physical Activity Questionnaire)**, un estándar científico internacional avalado por la Organización Mundial de la Salud (OMS) para evaluar el nivel de actividad física real basándose en hábitos de tiempo sentado y esfuerzo físico metabólico.

### 📐 ¿Cómo funciona nuestro algoritmo en el código?
1.  **Evaluación en 4 Pasos:**
    *   **Paso 1:** Selección de Clase RPG (Guerrero, Explorador o Místico).
    *   **Paso 2:** Horas al día sentado (Indicador de Sedentarismo extremo).
    *   **Paso 3:** Días a la semana con ejercicio moderado/intenso.
    *   **Paso 4:** Nivel de fatiga percibida en sus esfuerzos cotidianos.
2.  **Clasificación y Multiplicadores de Recompensa:**
    *   **Perfil Sedentario (Bajo):** Multiplicador de **`x0.5`**. Las misiones reducen sus objetivos a la mitad para evitar frustración (ej. en vez de 50 flexiones, te pide 25).
    *   **Perfil Activo (Moderado):** Multiplicador de **`x1.0`**. Dificultad estándar y recompensas balanceadas.
    *   **Perfil Élite (Alto):** Multiplicador de **`x1.5`**. Retos exigentes aumentados en un 50% (ej. 75 flexiones en vez de 50) pero premiados con un 50% más de Oro y XP.
3.  **Persistencia del Perfil:** El resultado de la clase RPG (`questfit_class`), el multiplicador (`questfit_multiplier`) y la superación del quiz (`questfit_onboarded`) se graban de manera indefinida en el navegador.

---

## 3. Fase 2: Conteo GPS Real y la Fórmula del Haversine

En los entrenamientos de Cardio (como andar o correr), la aplicación elimina la introducción manual de kilómetros. El chip GPS físico del teléfono toma el mando mediante la API de Geolocalización Web (`navigator.geolocation.watchPosition`).

### 🌍 La Fórmula Matemática del Haversine
Dado que la Tierra no es un plano sino una esfera tridimensional, no podemos usar el teorema de Pitágoras para calcular la distancia entre dos coordenadas GPS (Latitud y Longitud). Si lo hiciéramos, el error de cálculo sería catastrófico a medida que nos desplazamos.

En su lugar, implementamos la **Fórmula del Haversine**:

$$a = \sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1) \cdot \cos(\text{lat}_2) \cdot \sin^2\left(\frac{\Delta\text{lon}}{2}\right)$$

$$c = 2 \cdot \arctan2\left(\sqrt{a}, \sqrt{1-a}\right)$$

$$d = R \cdot c$$

*(Donde $R = 6371\text{ km}$ es el radio medio de la Tierra).*

### 🛠️ Filtros de Calidad de Datos (Software Robusto)
Los chips GPS de los teléfonos móviles sufren de mucho ruido electromagnético y rebotes de señal (especialmente bajo tejados o árboles). Para evitar que un usuario "entrene" sumando kilómetros sentado en su sofá debido a la deriva del GPS, implementamos dos filtros de calidad en el código:
1.  **Filtro de Precisión (`accuracy`):** Si la precisión reportada por el satélite es mayor a 50 metros (baja señal), el punto se descarta inmediatamente.
2.  **Filtro de Ruido de Umbral (`distanceDelta`):**
    *   Si la distancia entre el punto anterior y el actual es **menor a 2 metros (`0.002 km`)**, se ignora (descarte de temblor del pulso del usuario).
    *   Si la distancia es **mayor a 500 metros (`0.5 km`)** en un solo segundo, se ignora (descarte de saltos fantasmas por pérdida temporal de señal).
3.  **Redondeo de Flotantes:** Evitamos los típicos errores de coma flotante binarios de JavaScript usando redondeos estrictos a dos decimales.

---

## 4. La Seguridad en la Web Móvil: Contextos Seguros (Secure Contexts)

Un problema común al probar aplicaciones con sensores en red local es que el GPS devuelva error inmediato. **Esto es una medida de seguridad obligatoria de los navegadores modernos.**

El consorcio internacional W3C obliga a que APIs que accedan a la privacidad física (Geolocalización, Cámara, Micrófono) se ejecuten **únicamente en Contextos Seguros (Secure Contexts)**:
*   **Seguros por definición:** `http://localhost` (para desarrollo en tu propio PC) y conexiones cifradas bajo **`https://`**.
*   **Inseguros:** Direcciones de red local `http://192.168.1.XX:5173/`. Al no estar cifrada la comunicación, el navegador del móvil bloquea el sensor por completo para evitar ataques de interceptación (Man-in-the-Middle).

### 💡 Soluciones de producción explicadas ante el tribunal:
1.  **Vite HTTPS Plugin (Certificados autofirmados):** Configurar Vite para levantar el servidor local bajo `https://` y forzar al móvil a permitir la geolocalización.
2.  **Chrome Flags (Workaround):** Forzar al navegador móvil a tratar la IP local como un entorno seguro mediante la bandera de desarrollo `chrome://flags/#unsafely-treat-insecure-origin-as-secure`.

---

## 5. Accesibilidad y Experiencia Sensorial Dual (Voz y Haptics)

Un deportista no puede estar mirando la pantalla de su teléfono móvil continuamente mientras corre o realiza flexiones. Esto causaría caídas o una pésima ejecución biomecánica. Para solventarlo, QuestFit integra una **Experiencia Sensorial Dual** basada en APIs nativas de los teléfonos:

### 🎙️ Web Speech API (Síntesis de Voz)
*   **Uso:** La aplicación te habla a viva voz para avisarte de hitos: *"¡Kilómetro 1 completado! Sigue así, cazador del viento"*, o al cobrar misiones.
*   **Ventaja Académica:** Es 100% gratuita y funciona **totalmente offline**, ya que utiliza el motor Text-To-Speech (TTS) integrado de forma nativa en el sistema operativo del teléfono (Android/iOS). Ahorra ancho de banda y batería.

### 📳 Vibration API (Respuesta Háptica)
*   **Uso:** Emisión de pulsos vibratorios físicos diferenciados según la acción.
    *   Selección del test: Vibraciones sutiles rápidas de confirmación (`vibrate(60)`).
    *   **Hito del Kilómetro (Milestone):** Un patrón pesado de vibración doble (`vibrate([300, 100, 300])`) para que el usuario sienta en su muslo que ha superado el kilómetro sin tener que sacar el teléfono de su bolsillo.
*   **Ventaja:** Inclusión de deportistas con discapacidades visuales o auditivas (A11y - Accesibilidad).

---

## 6. Persistencia Local de Datos (LocalStorage vs SharedPreferences)

Actualmente, QuestFit implementa una persistencia local mediante la **API de Web Storage (`localStorage`)**.

### 💻 ¿Cómo funciona y cuál es su equivalencia móvil?
*   **En la Web (Vite/React):** Los datos se escriben en parejas Clave-Valor en formato de cadenas de texto (`string`). Se guardan en el disco duro del dispositivo y persisten aun cuando el navegador se apaga o el móvil se reinicia.
*   **En Android Nativo (Kotlin/Java):** El equivalente directo a `localStorage` es la clase **`SharedPreferences`** (o la moderna Jetpack DataStore). Estructuran los datos de la misma manera (Clave-Valor) en un archivo XML privado dentro del almacenamiento de la app.
*   **En iOS Nativo (Swift):** Su equivalente es la clase **`UserDefaults`**.

---

## 7. Stack Tecnológico Explicado (Para el Tribunal)

Este es el desglose técnico del porqué de cada herramienta elegida, ideal para justificar tu memoria de proyecto:

*   **React 19:** Librería de renderizado declarativo basada en componentes. En lugar de manipular el DOM web directamente (con los lentos e inseguros `document.getElementById`), React usa un **Virtual DOM** en memoria RAM, recalculando las diferencias visuales de forma ultra veloz antes de pintar en la pantalla física.
*   **TypeScript:** Superconjunto tipado de JavaScript. Añade tipado estricto en tiempo de compilación. En lugar de fallar en producción en el móvil del cliente por una variable mal escrita, TypeScript nos avisa en el editor y frena la compilación hasta que esté 100% libre de errores lógicos de tipos.
*   **Vite:** El empaquetador (*bundler*) de nueva generación. Utiliza compiladores nativos escritos en Go (`esbuild`) para servir el código en milisegundos en desarrollo, y genera un empaquetado optimizado en producción en menos de 2 segundos.
*   **Lucide React:** Colección de iconos en formato SVG vectorial. Al ser vectoriales, escalan infinitamente sin pixelarse en pantallas móviles de alta densidad (como pantallas Retina o AMOLED de gama alta) y su peso en bytes es despreciable.

---

## 8. Arquitectura de Código y Mobile-First

El diseño de QuestFit está concebido desde el primer día bajo la premisa **Mobile-First** (El móvil es el dispositivo prioritario):

### 📱 Estructura Responsiva de Contención
En el archivo `App.tsx`, el contenedor principal está bloqueado de la siguiente manera:
```tailwindcss
w-full h-[100dvh] sm:max-w-md sm:h-[90vh] overflow-hidden flex flex-col mx-auto
```
*   `h-[100dvh]` (**Dynamic Viewport Height**): Evita que en los navegadores móviles reales (como Safari en iPhone o Chrome en Android), la barra de navegación del navegador tape los botones inferiores de la aplicación, recalculando la altura en tiempo real.
*   `sm:max-w-md`: En ordenadores de sobremesa, la app se encajona en proporciones de teléfono inteligente (`448px`), centrada en pantalla, manteniendo la experiencia inmersiva.
*   `BottomNav`: Menú de navegación inferior diseñado para el alcance del dedo pulgar, sustituyendo los clásicos menús de escritorio inaccesibles en pantallas táctiles de una sola mano.

---

## 9. 🗺️ Hoja de Ruta de Desarrollo Incremental (Roadmap DAM)

El desarrollo del proyecto está estructurado para avanzar de forma segura, garantizando la comprensión absoluta de cada pilar informático:

1.  **Fase 1: Persistencia e Historial (LocalStorage):** Guardar el nivel y las monedas en el móvil de forma permanente. *(Completada parcial).*
2.  **Fase 2: Conteo GPS Real (Haversine):** Automatización de entrenamientos de cardio a través de lecturas del sensor GPS físico del móvil. *(Completada).*
3.  **Fase 3: Cartografía Cyberpunk (Leaflet.js):** Renderizado de tu ruta neón sobre mapas de OpenStreetMap en pantalla. *(Próximo paso).*
4.  **Fase 4: El Oráculo Central (Java Spring Boot + DB):** Salto a la nube. Sincronización multiusuario mediante base de datos relacional y APIs REST en Java. *(Futuro).*
5.  **Fase 5: El Gremio Social (Rankings, Lobbies y Piques):** Piques deportivos en directo y salas compartidas para entrenar con amigos en tiempo real. *(Futuro).*
6.  **Fase 6: La Forja Multiplataforma (Capacitor & Android Studio):** Envoltura de la aplicación web en un contenedor nativo Gradle para compilar archivos `.apk` firmados e interactuar con smartwatches (WearOS). *(Futuro).*

---

> [!TIP]
> **Para llevar un control exacto de tus progresos diarios en tu editor de código:**  
> Consulta nuestro archivo local: [progreso_del_gremio.md](file:///c:/Users/mdpoz/Desktop/Gremio/implementaciones/progreso_del_gremio.md). Allí registramos de forma pormenorizada qué partes del código tenemos listas, a medias y cuáles nos quedan por hacer. ¡Nunca te perderás en el gremio de desarrollo!
