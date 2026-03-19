# 🚀 GUÍA DE DESPLIEGUE - AMBIENTE DE DESARROLLO

## Cambios Implementados

### 1. ✅ HU Raizal / Mejora - Selector desde Listado
- Se reemplazó el campo manual por un selector con autocompletado
- Se incluyen 26 historias raizales predefinidas
- Búsqueda inteligente por número o descripción
- Contador de uso para raizales más utilizadas

### 2. ✅ Campo "Otro / No Existe Raizal"
- Opción para agregar raizales personalizadas
- Formato: "123456 - Descripción"
- Persistencia en base de datos MySQL (XAMPP)
- Compartido entre analistas

### 3. ✅ Botón "Ver Raizales"
- Modal con listado completo de todas las raizales
- Ordenado por uso (más usadas primero)
- Clic para seleccionar directamente

### 4. ✅ Texto de Solución - Solo Número
- El texto generado muestra únicamente el número de la raizal
- Ejemplo: "* HU Raizal / Mejora: 1027578"

### 5. ✅ Historial de External Tickets
- Últimos 10 tickets generados guardados en base de datos
- Sección colapsable en "Ver Agrupadores"
- Opción para copiar tickets anteriores
- Muestra fecha, aplicativo, proceso y agrupador

### 6. ✅ Agrupadores en Secciones Desplegables
- Categorías colapsables/expandibles con clic
- Botones "Expandir Todas" / "Colapsar Todas"
- Mejor organización visual del contenido

---

## 📋 INSTRUCCIONES DE INSTALACIÓN

### Paso 1: Configurar Base de Datos (XAMPP)

1. **Iniciar XAMPP:**
   - Abre XAMPP Control Panel
   - Inicia **Apache** y **MySQL**

2. **Crear la Base de Datos:**
   - Abre tu navegador y ve a: `http://localhost/phpmyadmin`
   - Haz clic en la pestaña **SQL**
   - Copia el contenido del archivo: `backend-api/database.sql`
   - Pégalo en el área de texto y presiona **Continuar**

3. **Copiar archivos PHP:**
   - Copia toda la carpeta `backend-api` a: `C:\xampp\htdocs\`
   - La ruta final debe ser: `C:\xampp\htdocs\backend-api\`

4. **Verificar conexión:**
   - Abre en tu navegador: `http://localhost/backend-api/raizales.php`
   - Deberías ver un JSON con `{"success": true, ...}`

### Paso 2: Instalar Dependencias de Angular

Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
npm install
```

### Paso 3: Levantar Ambiente de Desarrollo

```powershell
npm start
```

La aplicación se abrirá automáticamente en: `http://localhost:4200`

---

## 🧪 VALIDACIÓN DE FUNCIONALIDADES

### Test 1: Selector de Raizales
1. Ve a "📝 Plantilla de Cierre"
2. En el campo "HU Raizal / Mejora", escribe: `1027`
3. ✅ Deberían aparecer sugerencias filtradas
4. Haz clic en una sugerencia
5. ✅ El campo se debe llenar automáticamente

### Test 2: Ver Raizales (Modal)
1. Haz clic en el botón "📋 Ver Raizales"
2. ✅ Debe abrir un modal con todas las raizales
3. Haz clic en cualquier raizal
4. ✅ Se debe seleccionar y cerrar el modal

### Test 3: Campo "Otro"
1. Escribe cualquier texto en el buscador de raizales
2. Haz clic en "➕ Otro / No Existe Raizal"
3. ✅ Debe aparecer un campo nuevo
4. Ingresa: `999888 - Nueva historia de prueba`
5. Haz clic en "💾 Guardar"
6. ✅ Debe guardarse en la base de datos

### Test 4: Texto con Solo Número
1. Completa el formulario con cualquier raizal
2. Haz clic en "📄 Generar Texto"
3. ✅ En el texto generado, la línea de HU Raizal debe mostrar solo el número
   - Ejemplo: `* HU Raizal / Mejora: 1027578`

### Test 5: Historial de External Tickets
1. Ve a "📋 Ver Agrupadores"
2. Genera un External Ticket completo
3. Haz clic en "📋 Copiar"
4. ✅ El ticket debe guardarse
5. Haz clic en "▶️ Historial de External Tickets"
6. ✅ Debe aparecer el ticket recién creado
7. Haz clic en "📋 Copiar" en cualquier ticket del historial
8. ✅ Debe copiarse al portapapeles

### Test 6: Categorías Desplegables
1. Ve a "📋 Ver Agrupadores"
2. ✅ Las categorías deben estar colapsadas por defecto
3. Haz clic en una categoría
4. ✅ Debe expandirse mostrando los agrupadores
5. Haz clic en "➕ Expandir Todas"
6. ✅ Todas las categorías se deben abrir
7. Haz clic en "➖ Colapsar Todas"
8. ✅ Todas se deben cerrar

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: No se conecta a la base de datos
- Verifica que Apache y MySQL estén corriendo en XAMPP
- Verifica la ruta: `C:\xampp\htdocs\backend-api\`
- Revisa la consola del navegador (F12) para ver errores de CORS

### Error: HttpClient not provided
- Ya está configurado en `app.config.ts`
- Si persiste, ejecuta: `npm install` nuevamente

### Error: Las raizales no se cargan
- Abre `http://localhost/backend-api/raizales.php` en el navegador
- Debe devolver un JSON válido
- Si hay error de conexión, verifica que MySQL esté corriendo

### Error: External tickets no se guardan
- Verifica: `http://localhost/backend-api/external-tickets.php`
- Revisa que la tabla `external_tickets_history` exista en phpMyAdmin

---

## 📦 MIGRACIÓN A PRODUCCIÓN

Una vez validado el ambiente de desarrollo:

1. **Base de datos:**
   - Exporta las tablas desde phpMyAdmin
   - Importa en el servidor de producción

2. **Backend API:**
   - Sube la carpeta `backend-api` al servidor web de producción
   - Actualiza `backend-api.ts` con la URL de producción:
     ```typescript
     private readonly baseUrl = 'https://tu-servidor.com/backend-api';
     ```

3. **Frontend Angular:**
   - Ejecuta: `npm run build`
   - Despliega la carpeta `dist/` en GitHub Pages o servidor web

---

## 📞 CONTACTO DE SOPORTE

Si encuentras algún problema:
1. Revisa la consola del navegador (F12)
2. Revisa la consola de la terminal donde corre Angular
3. Verifica los logs de Apache en XAMPP

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] XAMPP Apache y MySQL corriendo
- [ ] Base de datos creada correctamente
- [ ] Archivos PHP en `C:\xampp\htdocs\backend-api\`
- [ ] `npm install` ejecutado sin errores
- [ ] `npm start` corriendo en `http://localhost:4200`
- [ ] Selector de raizales funciona
- [ ] Modal "Ver Raizales" abre correctamente
- [ ] Campo "Otro" guarda en base de datos
- [ ] Texto generado muestra solo número
- [ ] Historial de tickets se guarda y muestra
- [ ] Categorías se expanden/colapsan correctamente

---

🎉 **¡Listo! Ambiente de desarrollo configurado correctamente.**
