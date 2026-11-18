# 🏰 QuestFit — Tablón de Misiones (Documentación Exhaustiva)

> **Proyecto Académico de Desarrollo Multiplataforma (DAM)**  
> **Objetivo Final:** Publicación de la aplicación en Google Play Store y Apple App Store.  
> Aplicación web (futura app nativa) que gamifica el deporte convirtiendo rutinas de entrenamiento físico en misiones de rol (RPG), recompensando al usuario con Puntos de Experiencia (EXP), Oro y subidas de nivel.

---

## 📋 Índice General

1. [Introducción y Concepto Core](#1-introducción-y-concepto-core)
2. [Stack Tecnológico Explicado](#2-stack-tecnológico-explicado)
3. [Arquitectura Mobile-First](#3-arquitectura-mobile-first)
4. [Sistema de Temas Dinámicos (Design Tokens)](#4-sistema-de-temas-dinámicos)
5. [Laboratorio de Diseño (Component Playground)](#5-laboratorio-de-diseño)
6. [🗺️ ROADMAP HACIA LAS APP STORES (Guía Paso a Paso)](#6-️-roadmap-hacia-las-app-stores)

---

## 1. Introducción y Concepto Core

QuestFit nace bajo la premisa de unir dos mundos: el esfuerzo físico real y los sistemas de recompensa de los videojuegos. Es una **Single Page Application (SPA)**. 

> **¿Qué significa SPA?**  
> En una web tradicional (como Wikipedia), cada vez que haces clic en un enlace, el navegador descarga una página HTML nueva por completo. En una **SPA** (como Instagram o Netflix web), solo se descarga **un único archivo HTML** (`index.html`). A partir de ahí, JavaScript (React) se encarga de "borrar y pintar" nuevos elementos en la pantalla a la velocidad del rayo, sin que la página parpadee ni se recargue nunca. Esto es vital para engañar al cerebro y hacer que la web se sienta como una app nativa descargada en el móvil.

---

## 2. Stack Tecnológico Explicado

Para lograr un rendimiento de aplicación nativa, hemos escogido un stack moderno. Aquí tienes la explicación de cada pieza: 

*   **React 19:** Es una librería de JavaScript creada por Facebook. En lugar de programar una página entera, programamos **Componentes** (pequeños bloques de Lego como un Botón, una Tarjeta, o un Menú). *Analogía: Cada componente es como una Clase en Java que devuelve código visual en lugar de datos.*
*   **TypeScript (TS):** Es JavaScript "con esteroides". JavaScript puro te permite meter un texto en una variable que debería ser un número, y la app explotará en el móvil del usuario. TypeScript obliga a definir el **Tipo de Dato** exacto. *Analogía: Te da la misma seguridad y restricciones estrictas que tienes al programar en Java o C#.*
*   **Tailwind CSS v4:** En lugar de tener un archivo `.css` externo gigante con miles de reglas, Tailwind nos permite escribir clases directamente en el HTML (ej: `class="text-red-500 font-bold"`). Esto agiliza el desarrollo enormemente y elimina código CSS muerto.
*   **Vite:** Es el motor (bundler). Coge todos nuestros cientos de archivos `.tsx` (TypeScript + HTML) y los comprime en un solo archivo JavaScript optimizado que el navegador del móvil pueda entender al instante.

---

## 3. Arquitectura Mobile-First

El código de esta aplicación ha sido estructurado para ser estrictamente móvil, preparándolo para su futura conversión a app de iOS/Android.

### ¿Cómo hemos logrado el contenedor móvil?
En nuestro archivo `App.tsx`, el contenedor padre tiene las siguientes clases críticas:
`w-full h-[100dvh] sm:max-w-md sm:h-[90vh] overflow-hidden flex flex-col`

*   `h-[100dvh]`: **Dynamic Viewport Height**. Es una medida revolucionaria. En los móviles, la barra de búsqueda de Chrome/Safari desaparece al hacer scroll. Si usamos el 100% clásico (`100vh`), nuestro contenido inferior (el menú) se escondería bajo el borde físico de la pantalla. `dvh` se recalcula matemáticamente cada vez que la barra del navegador se mueve, manteniendo la app anclada a la perfección.
*   `sm:max-w-md`: En pantallas grandes (monitores), la app no se estira de lado a lado quedando horrenda. Se bloquea en 448px de ancho, imitando las proporciones de un iPhone Max en medio del monitor.
*   **BottomNav:** Hemos prescindido de los clásicos menús laterales (Sidebars) de escritorio. Hemos creado `BottomNav.tsx`, anclado al fondo (`flex-shrink-0`), para que el usuario pueda navegar con el dedo pulgar.

---

## 4. Sistema de Temas Dinámicos

La app cuenta con un inyector de estilos que permite al usuario alternar entre modos (Obsidiana, Pergamino, Bosque, etc.). 

**¿Cómo funciona esta magia por debajo?**
1.  **Variables CSS (`theme.css`):** Definimos *Design Tokens*. En lugar de decir "fondo azul", decimos `--quest-bg: #121212`.
2.  **El Contexto Global (`ThemeProvider.tsx`):** Usamos la API de React llamada *Context*. Funciona como un **Patrón Singleton** en Java. Es un "estado global" flotante. Cuando el usuario hace clic en el botón de cambiar tema, el `ThemeProvider` atrapa ese clic, guarda la decisión en la memoria del navegador (`localStorage`), y le inyecta al HTML base un atributo (ej. `data-theme="parchment"`).
3.  **La reacción:** Al cambiar ese atributo, todas las variables CSS de la aplicación permutan al instante y Tailwind repinta los colores en microsegundos.

---

## 5. Laboratorio de Diseño

Hemos implementado un componente llamado `DesignPlayground.tsx`. ¿Por qué?
Cuando trabajas en una empresa real como Desarrollador Front-End, no pruebas tus nuevos diseños de botones dentro de la pantalla real de la aplicación, porque los datos reales podrían distraerte o romper tu diseño. 
El **Playground** es un lienzo en blanco aislado. Si vas a `App.tsx` y cambias la variable `const SHOW_PLAYGROUND = true;`, la app real desaparece y te deja un entorno de laboratorio para testear componentes (como la `QuestCardV1`) viendo cómo responden a los cambios de tamaño sin afectar al flujo del usuario.

---

## 6. 🗺️ ROADMAP HACIA LAS APP STORES

Aquí está el mapa de ruta definitivo. Pasos detallados y técnicos de cómo llevaremos esta aplicación desde tu carpeta local de 1º de DAM hasta las pantallas de los teléfonos de los usuarios en todo el mundo.

### ✅ FASE 1 y 2: Prototipado y Front-End (ACTUAL - COMPLETADA)
**Lo que hemos conseguido:**
*   Maquetación de la interfaz completa y responsiva.
*   Componentización en React (tarjetas, botones, menús aislados).
*   Mockup de datos: Los datos ahora mismo son estáticos (escritos en el código).

### 🔲 FASE 3: Arquitectura de Base de Datos (Diseño del Motor)
**Tu próximo paso académico (Conecta con tu asignatura de Bases de Datos).**
La app necesita recordar quién es el usuario y qué misiones ha completado.
*   **Paso 3.1: Diagrama ER (Entidad-Relación).** Tienes que diseñar cómo se relacionan los datos. Ejemplo:
    *   Tabla `Users`: `id`, `username`, `email`, `password_hash`, `level`, `current_exp`, `gold`.
    *   Tabla `Quests`: `id`, `title`, `description`, `category_id`, `difficulty_id`, `reward_gold`, `reward_exp`.
    *   Tabla `User_Quest_Log`: `id`, `user_id`, `quest_id`, `completed_at`, `status`. (Para saber si un usuario tiene una misión en progreso o ya la cobró).
*   **Paso 3.2: Creación del motor SQL.** Levantar una base de datos PostgreSQL o MySQL localmente.

### 🔲 FASE 4: Back-End y API REST (El Cerebro)
**Conecta con tu asignatura de Programación (Java).**
La app web de React no puede hablar directamente con la Base de Datos (sería un riesgo de seguridad catastrófico, los hackers verían tus contraseñas en el código fuente de la web).
*   **Paso 4.1: Spring Boot.** Desarrollaremos un servidor backend en Java usando Spring Boot.
*   **Paso 4.2: Creación de la API REST.** Tu servidor Java tendrá "puertas" abiertas (Endpoints). 
    *   Si React le hace un `GET` a `http://tu-servidor.com/api/quests`, Java conectará con MySQL, sacará las misiones, las transformará en un texto de formato JSON y se las devolverá a React para que las pinte en pantalla.
    *   Si el usuario completa una misión, React hará un `POST` a `/api/quests/complete/5` y Java le sumará el oro al usuario en la base de datos.

### 🔲 FASE 5: Autenticación y Seguridad (Cuentas de Usuario)
*   **Paso 5.1: Registro/Login en React.** Crear la pantalla visual de iniciar sesión.
*   **Paso 5.2: JWT (JSON Web Tokens).** Cuando un usuario ponga su contraseña en React, viaja a Java. Si es correcta, Java no devuelve "ok", devuelve un Token (una cadena de texto encriptada super larga). React guardará este Token en el móvil del usuario. A partir de ese momento, cada vez que React pida datos al servidor, le enseñará ese Token a Java como si fuera una "entrada de discoteca VIP" para demostrar quién es.

### 🔲 FASE 6: Conversión a App Nativa Móvil (El gran salto)
¿Cómo subimos una web hecha en React a Google Play si solo admiten código Java/Kotlin para Android, y Swift para iOS? ¡No vamos a reescribir la app entera!
*   **La magia de "Capacitor" (de Ionic):** Capacitor es una herramienta que coge toda nuestra web de React y la "envuelve" en un navegador web invisible dentro de una App nativa vacía.
*   **Paso 6.1: Instalar Capacitor.** En la consola ejecutaremos `npm install @capacitor/core`.
*   **Paso 6.2: Funciones nativas.** Capacitor nos dará acceso al hardware del teléfono mediante plugins. Por ejemplo, en lugar de usar comandos web, usaremos código Capacitor para hacer vibrar el teléfono cuando completes una misión (`Haptics.vibrate()`), o enviaremos notificaciones Push reales al móvil del usuario.
*   **Paso 6.3: Compilación.** Ejecutaremos `npx cap open android`, lo que abrirá *Android Studio*, y desde ahí le daremos al botón "Build APK" para generar el archivo instalable.

### 🔲 FASE 7: Publicación en las Tiendas (Deployment final)
El último paso de todo desarrollador independiente.
*   **Para Android (Google Play Store):**
    1. Hay que pagar una licencia de desarrollador de Google de pago único (unos ~25$).
    2. Crearemos un archivo encriptado llamado "Keystore" para firmar digitalmente la app (garantiza que nadie más pueda subir actualizaciones de QuestFit haciéndose pasar por nosotros).
    3. Rellenaremos las fichas de producto (subir las capturas de pantalla, descripciones, y responder los cuestionarios de clasificación por edades PEGI).
    4. Google la revisará manualmente (tarda unos 3-7 días) y la publicará.
*   **Para iOS (Apple App Store):**
    1. Se requiere tener un Mac (imprescindible para compilar el código con Xcode).
    2. Pagar la licencia anual de Apple Developer (unos ~99$ AL AÑO).
    3. Pasar el estricto proceso de revisión humana de Apple, donde son muy exigentes con que la app "no parezca una web cutre" (afortunadamente, QuestFit ya está diseñada de forma premium y pasará sin problema).

### FUNCIONAMIENTO AHORA EN TIEMPO DE VACACIONES Y COMO ORGANIZARLO PARA EL AÑO QUE VIENE
**Para este verano:**
    1. Preparar todo o la mayoria del front y dejando preparados los modulos que ahora mismo estan activos
    2. Primer vistazo a la base de datos pero sin conectarla aun a la app ya que esperaremos a verlo en segundo año
    3. Hacer pruebas tecnicas saliendo a andar con la app
    4. Investigar un poco con funcionaria la migracion a reloj

---

