# Backend API - Plantilla de Cierre

## Configuración con XAMPP

### 1. Instalación de Base de Datos

1. Inicia **XAMPP Control Panel**
2. Arranca los servicios **Apache** y **MySQL**
3. Accede a **phpMyAdmin** en `http://localhost/phpmyadmin`
4. Ve a la pestaña **SQL**
5. Copia y pega el contenido del archivo `database.sql`
6. Haz clic en **Continuar**

### 2. Configuración de los archivos PHP

1. Copia la carpeta `backend-api` completa a:
   ```
   C:\xampp\htdocs\backend-api
   ```

2. Verifica que la estructura sea:
   ```
   C:\xampp\htdocs\backend-api\
   ├── config.php
   ├── raizales.php
   ├── external-tickets.php
   └── database.sql
   ```

### 3. Endpoints Disponibles

#### HU Raizales Custom
- **GET** `http://localhost/backend-api/raizales.php` - Obtener todas las raizales custom
- **POST** `http://localhost/backend-api/raizales.php` - Crear nueva raizal
  ```json
  {
    "numero_historia": "1234567",
    "tipo": "Historia",
    "descripcion": "Descripción de la raizal",
    "creado_por": "Usuario"
  }
  ```
- **PUT** `http://localhost/backend-api/raizales.php` - Incrementar uso
  ```json
  {
    "numero_historia": "1234567"
  }
  ```

#### External Tickets History
- **GET** `http://localhost/backend-api/external-tickets.php?limit=10` - Obtener últimos tickets
- **POST** `http://localhost/backend-api/external-tickets.php` - Guardar ticket
  ```json
  {
    "external_ticket": "Cotizador Salud.Nuevo Error de validación",
    "aplicativo": "Cotizador Salud",
    "proceso": "Nuevo",
    "agrupador": "Error de validación",
    "usuario": "Usuario"
  }
  ```

### 4. Verificar Funcionamiento

Accede a: `http://localhost/backend-api/raizales.php`

Deberías ver un JSON similar a:
```json
{
  "success": true,
  "data": [...],
  "total": 1
}
```

### 5. Solución de Problemas

- Si hay errores de conexión, verifica que MySQL esté corriendo en XAMPP
- La contraseña por defecto de MySQL en XAMPP es vacía (`''`)
- Asegúrate de que el puerto 80 (Apache) y 3306 (MySQL) no estén ocupados
