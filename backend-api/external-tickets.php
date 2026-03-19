<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

switch($method) {
    case 'GET':
        obtenerHistorialTickets($conn);
        break;
    case 'POST':
        guardarExternalTicket($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

// Obtener últimos 10 external tickets
function obtenerHistorialTickets($conn) {
    try {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $stmt = $conn->prepare("
            SELECT 
                id, 
                external_ticket, 
                aplicativo, 
                proceso, 
                agrupador, 
                usuario,
                fecha_creacion
            FROM external_tickets_history 
            ORDER BY fecha_creacion DESC 
            LIMIT :limit
        ");
        
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $tickets,
            'total' => count($tickets)
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Guardar external ticket generado
function guardarExternalTicket($conn) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['external_ticket']) || !isset($input['aplicativo']) || 
            !isset($input['proceso']) || !isset($input['agrupador'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos requeridos']);
            return;
        }
        
        $stmt = $conn->prepare("
            INSERT INTO external_tickets_history 
                (external_ticket, aplicativo, proceso, agrupador, usuario) 
            VALUES 
                (:ticket, :aplicativo, :proceso, :agrupador, :usuario)
        ");
        
        $stmt->execute([
            ':ticket' => $input['external_ticket'],
            ':aplicativo' => $input['aplicativo'],
            ':proceso' => $input['proceso'],
            ':agrupador' => $input['agrupador'],
            ':usuario' => $input['usuario'] ?? null
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'External ticket guardado',
            'id' => $conn->lastInsertId()
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
