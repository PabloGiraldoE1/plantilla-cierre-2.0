-- Base de datos para la Plantilla de Cierre
CREATE DATABASE IF NOT EXISTS plantilla_cierre_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plantilla_cierre_db;

-- Tabla para almacenar HU Raizales personalizadas (campo "Otro")
CREATE TABLE IF NOT EXISTS hu_raizales_custom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_historia VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'Historia',
    descripcion TEXT NOT NULL,
    creado_por VARCHAR(100) DEFAULT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usado_contador INT DEFAULT 1,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_historia (numero_historia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para historial de External Tickets generados
CREATE TABLE IF NOT EXISTS external_tickets_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_ticket TEXT NOT NULL,
    aplicativo VARCHAR(100) NOT NULL,
    proceso VARCHAR(100) NOT NULL,
    agrupador TEXT NOT NULL,
    usuario VARCHAR(100) DEFAULT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha_creacion DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos ejemplos de raizales custom (opcional)
INSERT INTO hu_raizales_custom (numero_historia, tipo, descripcion, usado_contador) VALUES
('999999', 'Historia', 'Ejemplo de historia personalizada', 0)
ON DUPLICATE KEY UPDATE descripcion = descripcion;
