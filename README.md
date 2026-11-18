# ⚔️ QuestFit — Gamified Mobile Fitness Experience

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.5.2-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Component--Driven%20%2B%20Context%20API-FF6B6B?style=for-the-badge)](https://react.dev/learn)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-green?style=for-the-badge&logo=android&logoColor=white)](https://android.com)

---

## 📖 Descripción General

**QuestFit** es una aplicación móvil híbrida orientada al entrenamiento deportivo que transforma las rutinas de ejercicio físico tradicional en **misiones de rol épicas (RPG)**. El usuario asume el rol de aventurero, ganando puntos de experiencia (EXP), oro virtual y subidas de nivel a medida que cumple sus sesiones de fuerza, cardio y movilidad.

Forma parte del **Ecosistema QUEST** (Desarrollo de Aplicaciones Multiplataforma - DAM) como el pilar enfocado en *Cuerpo & Salud*, diseñado específicamente para resolver la falta de adherencia al ejercicio físico mediante la psicología del refuerzo positivo gamificado y una experiencia visual inmersiva de alta gama.

---

## 🎨 Diseño UI/UX & Decisiones Visuales

El diseño visual de QuestFit ha sido concebido desde una perspectiva híbrida **Diseño Gráfico / UI-UX + Desarrollo Front-end**:

- **Filosofía Visual (Dark Fantasy Neo-Arcade):** Inspirada en interfaces RPG modernas con contraste optimizado para paneles OLED, evitando la fatiga visual en entornos de entrenamiento interior y exterior.
- **Jerarquía Tipográfica Limpia:** Uso de tipografías sans-serif modernas con titulares impactantes en tracking cerrado y cuerpos de texto de alta legibilidad técnica (`Inter` / `Geist`).
- **Sistema Cromático (Design Tokens):**
  - **Fondo Primario:** Negro puro (`#0B0E14` / `#000000`) para eficiencia energética y profundidad en pantallas AMOLED.
  - **Acento Heroico / Energía:** Cian eléctrico (`#00F2FE` / `#06B6D4`) y Dorado Épico (`#FFD700`) para recompensas, EXP y barras de progresión.
  - **Superficies Glassmorphism:** Tarjetas con fondos translúcidos difuminados (`backdrop-blur-md`), bordes sutiles de 1px con brillo perimetral y elevaciones basadas en sombras de color.
- **Microinteracciones y Háptica:** Retroalimentación táctil nativa mediante `@capacitor/haptics` en cada toque de acción crítica, cierre de misión y subida de nivel.
- **Componentes Reutilizables:** Diseñados sobre primitivas accesibles sin estilos de **Radix UI**, garantizando cumplimiento de estándares WAI-ARIA en modales, desplegables, sliders y tabs.

### Galería de Capturas de Pantalla

<div align="center">
  <img src="docs/screenshots/preview.png" alt="Vista previa de QuestFit" width="750" />
</div>

> *Nota: Inserta capturas adicionales del flujo de entrenamiento en `docs/screenshots/` (dashboard, modal de entrenamiento en vivo, radar de estadísticas).*

---

## ⚙️ Arquitectura y Stack Técnico

La aplicación sigue una **arquitectura Component-Driven desacoplada**, separando completamente las responsabilidades de renderizado de la gestión del estado global y el puente con el hardware nativo:

- **Capa de Presentación (UI Views & Components):** Componentes funcionales atómicos y modulares construidos con React 19 y Tailwind CSS v4.
- **Capa de Estado y Lógica (Context API + Hooks personalizados):**
  - Contexto de usuario y estadísticas (`LevelContext`, `QuestContext`) para centralizar la progresión, racha y cálculo de EXP.
  - Sincronización reactiva con almacenamiento persistente local (`StorageService`).
- **Puente Multiplataforma (Capacitor Runtime):** Envoltura de WebView de ultra-alto rendimiento que conecta con el SDK nativo de Android, barra de estado, splash screen y motor de vibración háptica.

### Tecnologías Clave:
- **Core:** React 19, TypeScript, Vite.
- **Mobile Runtime:** Capacitor 8 (`@capacitor/android`, `@capacitor/haptics`, `@capacitor/core`).
- **Estilos & UI Primitives:** Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Vaul (drawers móviles).
- **Métricas & Visualización:** Recharts (gráficos de rendimiento y estadísticas de atributos tipo RPG).
- **Formularios & Validación:** React Hook Form + Zod.

---

## 📂 Estructura del Proyecto

```plaintext
QuestFit/
├── android/                   # Proyecto nativo Android (Capacitor)
│   ├── app/src/main/          # Manifest, assets y configuración Gradle
│   └── build.gradle           # Configuración de compilación Android
├── app/                       # Código fuente de la aplicación React/TS
│   ├── components/            # Componentes reutilizables (BottomNav, Modals, Cards)
│   │   ├── experiments/       # Variaciones de laboratorio UI/UX
│   │   └── ui/                # Primitivas accesibles de interfaz (Radix UI)
│   ├── context/               # Proveedores de estado global (Context API)
│   ├── services/              # Lógica de almacenamiento y puente nativo
│   ├── types/                 # Interfaces y contratos de tipos TypeScript
│   ├── utils/                 # Helpers matemáticos de EXP y formateadores
│   ├── views/                 # Pantallas principales (Dashboard, Quests, Stats, Profile)
│   └── App.tsx                # Raíz de navegación y montaje
├── assets/                    # Identidad de marca, isotipos y banners
├── docs/                      # Documentación y memorias de diseño
│   └── screenshots/           # Capturas de pantalla para portfolio
├── public/                    # Archivos estáticos públicos
├── styles/                    # Tokens de diseño y hojas CSS globales
├── capacitor.config.ts        # Configuración de empaquetado nativo Capacitor
├── package.json               # Dependencias y scripts del proyecto
└── vite.config.ts             # Configuración de Vite y plugins
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- **Node.js** (v18.0.0 o superior)
- **npm** o **pnpm**
- *(Opcional para Android)*: **Android Studio** con SDK Android 34+ y dispositivo o emulador configurado.

### 1. Clonar el repositorio
```bash
git clone https://github.com/mdpozo/Gremio.git
cd Gremio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo (Web)
```bash
npm run dev
```
La aplicación estará disponible de inmediato en `http://localhost:5173`.

### 4. Compilar y sincronizar con Android
```bash
# Compilar la aplicación web y sincronizar los recursos en la carpeta nativa
npm run build
npx cap sync android

# Abrir el proyecto directamente en Android Studio
npx cap open android
```
Desde Android Studio podrás desplegar el APK en un dispositivo físico o emulador con un solo clic.

---

<div align="center">
  <sub>Desarrollado con dedicación técnica y visual por <b>Manuel</b> como parte del Ecosistema QUEST (DAM).</sub>
</div>
