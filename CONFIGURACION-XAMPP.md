# 🔧 CONFIGURACIÓN XAMPP - GUÍA PASO A PASO

## 📥 INSTALACIÓN DE XAMPP

Si aún no tienes XAMPP instalado:

1. Descarga desde: https://www.apachefriends.org/
2. Ejecuta el instalador
3. Instala en: `C:\xampp\` (ruta por defecto)
4. Asegúrate de instalar **Apache** y **MySQL**

---

## ⚙️ CONFIGURACIÓN INICIAL

### 1. Iniciar XAMPP Control Panel

1. Abre **XAMPP Control Panel** (como Administrador si es necesario)
2. Verás una lista de servicios disponibles

### 2. Iniciar Servicios

**Apache:**
- Haz clic en **Start** junto a Apache
- El botón debe volverse verde
- Puerto por defecto: **80**

**MySQL:**
- Haz clic en **Start** junto a MySQL
- El botón debe volverse verde
- Puerto por defecto: **3306**

### 3. Verificar que Apache está corriendo

Abre tu navegador y ve a: `http://localhost`

✅ Deberías ver la página de bienvenida de XAMPP

---

## 🗄️ CREAR BASE DE DATOS

### 1. Acceder a phpMyAdmin

1. Abre: `http://localhost/phpmyadmin`
2. Usuario por defecto: `root`
3. Contraseña por defecto: *(vacía, no ingreses nada)*

### 2. Crear la Base de Datos

**Opción A: Ejecutar el script SQL completo**

1. En phpMyAdmin, haz clic en la pestaña **SQL**
2. Abre el archivo: `backend-api/database.sql`
3. Copia TODO el contenido
4. Pégalo en el área de texto de phpMyAdmin
5. Haz clic en **Continuar** (botón abajo a la derecha)
6. ✅ Deberías ver: "Base de datos creada correctamente"

**Opción B: Crear manualmente**

1. Clic en **New** (Nueva) en el panel izquierdo
2. Nombre de la base de datos: `plantilla_cierre_db`
3. Cotejamiento: `utf8mb4_unicode_ci`
4. Clic en **Crear**

Luego, en la pestaña **SQL**, pega solo las sentencias CREATE TABLE del archivo `database.sql`

### 3. Verificar Tablas Creadas

1. En el panel izquierdo, clic en `plantilla_cierre_db`
2. Deberías ver 2 tablas:
   - `hu_raizales_custom`
   - `external_tickets_history`

---

## 📂 COPIAR ARCHIVOS PHP

### 1. Ubicar la Carpeta htdocs

Ruta por defecto: `C:\xampp\htdocs\`

### 2. Copiar backend-api

1. Copia la carpeta completa `backend-api` desde el proyecto
2. Pégala en: `C:\xampp\htdocs\`
3. La estructura final debe ser:
   ```
   C:\xampp\htdocs\backend-api\
   ├── config.php
   ├── raizales.php
   ├── external-tickets.php
   ├── database.sql
   └── README.md
   ```

---

## ✅ VERIFICAR CONFIGURACIÓN

### Test 1: Verificar Apache

Abre: `http://localhost`

✅ Debe cargar la página de XAMPP

### Test 2: Verificar phpMyAdmin

Abre: `http://localhost/phpmyadmin`

✅ Debe cargar el panel de administración

### Test 3: Verificar Base de Datos

En phpMyAdmin:
1. Clic en `plantilla_cierre_db` (panel izquierdo)
2. Clic en la tabla `hu_raizales_custom`
3. Pestaña **Examinar**
4. ✅ Deberías ver al menos 1 fila (el ejemplo insertado)

### Test 4: Verificar API de Raizales

Abre en el navegador: `http://localhost/backend-api/raizales.php`

✅ Debes ver un JSON como:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "numero_historia": "999999",
      "tipo": "Historia",
      "descripcion": "Ejemplo de historia personalizada",
      ...
    }
  ],
  "total": 1
}
```

### Test 5: Verificar API de External Tickets

Abre: `http://localhost/backend-api/external-tickets.php`

✅ Debes ver:
```json
{
  "success": true,
  "data": [],
  "total": 0
}
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Problema: Apache no inicia (Puerto 80 ocupado)

**Causa:** Otro programa usa el puerto 80 (IIS, Skype, etc.)

**Solución:**

1. En XAMPP Control Panel, clic en **Config** junto a Apache
2. Selecciona **httpd.conf**
3. Busca la línea: `Listen 80`
4. Cámbiala a: `Listen 8080`
5. Guarda y cierra
6. Reinicia Apache
7. Ahora accede a: `http://localhost:8080`

**Si cambias el puerto, actualiza también en Angular:**
```typescript
// src/app/services/backend-api.ts
private readonly baseUrl = 'http://localhost:8080/backend-api';
```

### Problema: MySQL no inicia (Puerto 3306 ocupado)

**Causa:** Otro servicio de MySQL ya está corriendo

**Solución:**

1. Abre **Servicios de Windows** (services.msc)
2. Busca "MySQL" u otros servicios de base de datos
3. Detén el servicio conflictivo
4. Reinicia MySQL en XAMPP

### Problema: Error 404 al acceder al API

**Causa:** La carpeta `backend-api` no está en la ubicación correcta

**Solución:**

1. Verifica que la carpeta esté en: `C:\xampp\htdocs\backend-api\`
2. La URL debe ser exactamente: `http://localhost/backend-api/raizales.php`
3. Nota: **NO** debe tener espacios ni caracteres especiales en la ruta

### Problema: Error de conexión a la base de datos

**Síntoma:** JSON con error: `"error": "Error de conexión: ..."`

**Solución:**

1. Verifica que MySQL esté corriendo en XAMPP
2. Abre: `backend-api/config.php`
3. Verifica las credenciales:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');  // Vacío por defecto
   define('DB_NAME', 'plantilla_cierre_db');
   ```
4. Si cambiaste la contraseña de root en MySQL, actualiza `DB_PASS`

### Problema: CORS - Acceso bloqueado desde Angular

**Síntoma:** Error en consola del navegador: `CORS policy: No 'Access-Control-Allow-Origin'`

**Solución:**

Los archivos PHP ya tienen configurado CORS. Si persiste:

1. Abre: `backend-api/config.php`
2. Verifica que tenga estas líneas al inicio:
   ```php
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");
   ```

### Problema: Datos no se guardan en la base de datos

**Diagnóstico:**

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Intenta guardar una raizal
4. Busca la petición a `raizales.php`
5. Haz clic y revisa la **Response**

**Si hay error en Response:**
- Revisa los logs de Apache: `C:\xampp\apache\logs\error.log`
- Verifica permisos de escritura en la base de datos

---

## 📊 VERIFICACIÓN DE ESTRUCTURA COMPLETA

### Base de Datos
```sql
-- Debe existir
Database: plantilla_cierre_db

-- Tablas
Tables:
  - hu_raizales_custom
  - external_tickets_history

-- Datos de ejemplo
SELECT * FROM hu_raizales_custom;
-- Debe retornar al menos 1 fila
```

### Archivos PHP
```
C:\xampp\htdocs\backend-api\
├── config.php           ✅ 
├── raizales.php         ✅
├── external-tickets.php ✅
├── database.sql         ✅
└── README.md            ✅
```

### URLs Funcionales
```
✅ http://localhost/phpmyadmin
✅ http://localhost/backend-api/raizales.php
✅ http://localhost/backend-api/external-tickets.php
```

---

## 🔐 SEGURIDAD (Producción)

**⚠️ IMPORTANTE:** Estas configuraciones son para DESARROLLO LOCAL

Para producción:
1. Cambia la contraseña de `root` en MySQL
2. Actualiza `config.php` con las nuevas credenciales
3. Restringe CORS solo a tu dominio:
   ```php
   header("Access-Control-Allow-Origin: https://tu-dominio.com");
   ```
4. Considera usar HTTPS en producción
5. Implementa autenticación en las APIs

---

## ✅ CHECKLIST FINAL

- [ ] XAMPP instalado
- [ ] Apache corriendo (luz verde)
- [ ] MySQL corriendo (luz verde)
- [ ] `http://localhost` carga correctamente
- [ ] `http://localhost/phpmyadmin` accesible
- [ ] Base de datos `plantilla_cierre_db` creada
- [ ] Tablas `hu_raizales_custom` y `external_tickets_history` existen
- [ ] Carpeta `backend-api` en `C:\xampp\htdocs\`
- [ ] `http://localhost/backend-api/raizales.php` devuelve JSON válido
- [ ] `http://localhost/backend-api/external-tickets.php` devuelve JSON válido

---

## 🎉 ¡Listo!

Si completaste todos los pasos del checklist, XAMPP está correctamente configurado y listo para usar con la aplicación Angular.

**Siguiente paso:** Vuelve a [AMBIENTE-DESARROLLO.md](AMBIENTE-DESARROLLO.md) para continuar con la instalación de Angular.

---

**Soporte:**
- Logs de Apache: `C:\xampp\apache\logs\error.log`
- Logs de MySQL: `C:\xampp\mysql\data\mysql_error.log`
- phpMyAdmin: `http://localhost/phpmyadmin`
