-- ==================================================================================
-- 🗄️ SCRIPT DE CREACIÓN DE BASE DE DATOS: QuestFit (MySQL) 
-- ==================================================================================

CREATE DATABASE IF NOT EXISTS questfit_db;
USE questfit_db;

DROP TABLE IF EXISTS historial_entrenamientos;
DROP TABLE IF EXISTS misiones;
DROP TABLE IF EXISTS usuarios;

-- ==================================================================================
-- ── 3. DEFINICIÓN DE TABLAS ──
-- ==================================================================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    clave_hash VARCHAR(255) NOT NULL,
    
    /* ENUM: Lista cerrada. Obliga a que el dato sea SÍ O SÍ uno de estos. 
       Evita que alguien escriba 'guerrerrro' (con faltas) en la DB. */
    clase_rpg ENUM('guerrero', 'explorador', 'mistico') NOT NULL,
    nivel_actividad ENUM('sedentario', 'moderado', 'activo') NOT NULL,
    
    multiplicador DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
    nivel_rpg INT NOT NULL DEFAULT 1,
    experiencia INT NOT NULL DEFAULT 0,
    oro INT NOT NULL DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    /* UNIQUE: Crea un candado. Impide que dos personas se registren con el mismo 
       correo o nombre. La DB da error automático si intentas duplicar. */
    CONSTRAINT uq_nombre_usuario UNIQUE (nombre_usuario),
    CONSTRAINT uq_correo UNIQUE (correo)
) 
/* ENGINE=InnoDB: Motor profesional que soporta 'Integridad Referencial' (las claves foráneas)
   y 'Transacciones' (si algo falla a medias, se deshace todo). */
ENGINE=InnoDB 
/* CHARSET utf8mb4: Soporta acentos, eñes y caracteres especiales (emojis). */
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE misiones (
    id INT AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria ENUM('cardio', 'fuerza', 'flexibilidad') NOT NULL,
    progreso_max_base INT NOT NULL,
    recompensa_base INT NOT NULL,
    dificultad ENUM('facil', 'media', 'dificil', 'epica') NOT NULL,
    etiqueta_tiempo VARCHAR(20) NOT NULL DEFAULT '24h',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE historial_entrenamientos (
    id INT AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    mision_id INT NOT NULL,
    progreso_final DECIMAL(5, 2) NOT NULL,
    oro_ganado INT NOT NULL,
    xp_ganado INT NOT NULL,
    tiempo_segundos INT NOT NULL,
    completado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    
    /* CASCADE: Si borro al usuario, bórralo todo. Es lógico: si el usuario no existe,
       su historial no tiene sentido (datos huérfanos). */
    CONSTRAINT fk_historial_usuario 
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    /* RESTRICT: Si alguien ha completado la misión, NO me dejes borrar la misión.
       Evita que borres por error el origen de datos de alguien. */
    CONSTRAINT fk_historial_mision 
        FOREIGN KEY (mision_id) REFERENCES misiones (id) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================================================
-- ── 4. OPTIMIZACIÓN: ÍNDICES ──
-- ==================================================================================
/* INDEX: Imagina el índice al final de un libro. Ayuda a MySQL a encontrar 
   los datos en segundos sin tener que leer toda la tabla fila a fila. 
   Es vital en las Foreign Keys donde hacemos JOINs frecuentemente. */
CREATE INDEX idx_historial_usuario ON historial_entrenamientos(usuario_id);
CREATE INDEX idx_historial_mision ON historial_entrenamientos(mision_id);

-- ==================================================================================
-- ── 6. CONSULTAS DE EVALUACIÓN ──
-- ==================================================================================

/* INNER JOIN: Solo nos trae los que existen en ambos lados. Si alguien no ha 
   entrenado, no sale en la lista. */
SELECT 
    h.id, u.nombre_usuario, m.titulo,
    /* CONCAT: Une texto. Hacemos esto para que el resultado sea legible (ej: "30m 10s") */
    CONCAT(FLOOR(h.tiempo_segundos / 60), 'm ', (h.tiempo_segundos % 60), 's') AS tiempo_formateado
FROM historial_entrenamientos h
INNER JOIN usuarios u ON h.usuario_id = u.id
INNER JOIN misiones m ON h.mision_id = m.id;

/* LEFT JOIN: ¡MUY IMPORTANTE! Nos trae a TODOS los usuarios aunque no tengan 
   historial de entrenamientos (los valores del historial saldrán como NULL). */
SELECT 
    u.nombre_usuario, 
    /* COUNT: Cuenta cuántas veces aparece el usuario en el historial. */
    COUNT(h.id) AS total_entrenamientos,
    /* SEC_TO_TIME: Función propia de MySQL que convierte segundos puros a formato reloj (HH:MM:SS) */
    SEC_TO_TIME(SUM(h.tiempo_segundos)) AS tiempo_total
FROM usuarios u
LEFT JOIN historial_entrenamientos h ON u.id = h.usuario_id
GROUP BY u.id, u.nombre_usuario;