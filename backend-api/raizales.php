<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

switch($method) {
    case 'GET':
        obtenerRaizalesCustom($conn);
        break;
    case 'POST':
        crearRaizalCustom($conn);
        break;
    case 'PUT':
        incrementarUsoRaizal($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

// Obtener todas las HU raizales custom
function obtenerRaizalesCustom($conn) {
    try {
        $stmt = $conn->prepare("
            SELECT 
                id, 
                numero_historia, 
                tipo, 
                descripcion, 
                usado_contador, 
                fecha_creacion,
                ultima_actualizacion
            FROM hu_raizales_custom 
            ORDER BY usado_contador DESC, ultima_actualizacion DESC
        ");
        $stmt->execute();
        $raizales = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $raizales,
            'total' => count($raizales)
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Crear una nueva HU raizal custom
function crearRaizalCustom($conn) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['numero_historia']) || !isset($input['descripcion'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos requeridos']);
            return;
        }
        
        $stmt = $conn->prepare("
            INSERT INTO hu_raizales_custom 
                (numero_historia, tipo, descripcion, creado_por, usado_contador) 
            VALUES 
                (:numero, :tipo, :descripcion, :creado_por, 1)
            ON DUPLICATE KEY UPDATE 
                usado_contador = usado_contador + 1,
                ultima_actualizacion = CURRENT_TIMESTAMP
        ");
        
        $stmt->execute([
            ':numero' => trim($input['numero_historia']),
            ':tipo' => $input['tipo'] ?? 'Historia',
            ':descripcion' => trim($input['descripcion']),
            ':creado_por' => $input['creado_por'] ?? null
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Raizal guardada correctamente',
            'id' => $conn->lastInsertId()
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Incrementar contador de uso
function incrementarUsoRaizal($conn) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['numero_historia'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta numero_historia']);
            return;
        }
        
        $stmt = $conn->prepare("
            UPDATE hu_raizales_custom 
            SET usado_contador = usado_contador + 1,
                ultima_actualizacion = CURRENT_TIMESTAMP
            WHERE numero_historia = :numero
        ");
        
        $stmt->execute([':numero' => $input['numero_historia']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Contador actualizado'
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
