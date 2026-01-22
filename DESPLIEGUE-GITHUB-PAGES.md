# 🚀 Guía para Desplegar en GitHub Pages

Esta guía te ayudará a publicar tu Sistema de Gestión de Incidentes en GitHub Pages de forma gratuita.

## 📋 Requisitos Previos

- ✅ Tener una cuenta en [GitHub](https://github.com)
- ✅ Git instalado en tu computadora
- ✅ Node.js y npm instalados (ya lo tienes)
- ✅ Proyecto Angular funcionando (ya está listo)

## 🎯 Pasos para Publicar

### Paso 1: Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** o **"+"** → **"New repository"**
3. Configura tu repositorio:
   - **Nombre**: `sistema-incidentes` (o el que prefieras)
   - **Descripción**: "Sistema de Gestión de Incidentes"
   - **Visibilidad**: Public (para GitHub Pages gratuito)
   - **NO marques** "Initialize with README" (ya tienes archivos)
4. Haz clic en **"Create repository"**

### Paso 2: Configurar Git Local

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd d:\plantilla-incidentes-main\incidentes-angular

# Configurar tu identidad (si no lo has hecho antes)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@example.com"

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - Sistema de Gestión de Incidentes"

# Cambiar rama a main
git branch -M main

# Conectar con tu repositorio (CAMBIA usuario/repositorio por los tuyos)
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# Subir el código
git push -u origin main
```

**⚠️ IMPORTANTE**: Reemplaza `TU-USUARIO/TU-REPOSITORIO` con tu usuario y nombre de repositorio real.

### Paso 3: Compilar para Producción

Compila el proyecto optimizado para GitHub Pages:

```powershell
# Compilar con la ruta base correcta (CAMBIA tu-usuario/tu-repositorio)
ng build --configuration production --base-href "https://TU-USUARIO.github.io/TU-REPOSITORIO/"
```

**Ejemplo real**:
```powershell
ng build --configuration production --base-href "https://juanperez.github.io/sistema-incidentes/"
```

### Paso 4: Desplegar a GitHub Pages

```powershell
# Desplegar usando angular-cli-ghpages
npx angular-cli-ghpages --dir=dist/incidentes-angular/browser
```

**Alternativa manual**:
```powershell
# Si el comando anterior no funciona, usa:
npx ngh --dir=dist/incidentes-angular/browser
```

### Paso 5: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** (Configuración)
3. En el menú lateral, busca **"Pages"**
4. En **"Source"**, selecciona la rama `gh-pages`
5. Haz clic en **"Save"**

### Paso 6: ¡Espera y Accede!

- GitHub tardará 1-5 minutos en publicar tu sitio
- Tu aplicación estará disponible en: `https://TU-USUARIO.github.io/TU-REPOSITORIO/`

---

## 🔧 Script de Despliegue Automatizado

Para futuras actualizaciones, usa este script:

```powershell
# Guardar como: deploy.ps1

# Variables (CAMBIA ESTOS VALORES)
$REPO_NAME = "sistema-incidentes"
$USER_NAME = "tu-usuario"

# Compilar
Write-Host "🔨 Compilando proyecto..." -ForegroundColor Cyan
ng build --configuration production --base-href "https://$USER_NAME.github.io/$REPO_NAME/"

# Desplegar
Write-Host "🚀 Desplegando a GitHub Pages..." -ForegroundColor Green
npx angular-cli-ghpages --dir=dist/incidentes-angular/browser --no-silent

Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host "🌐 Tu sitio estará disponible en: https://$USER_NAME.github.io/$REPO_NAME/" -ForegroundColor Yellow
```

Para ejecutar:
```powershell
.\deploy.ps1
```

---

## 📝 Comandos Rápidos (Cheat Sheet)

```powershell
# Ver estado de Git
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de cambios"

# Subir cambios a GitHub
git push origin main

# Compilar y desplegar (después de push)
ng build --configuration production --base-href "https://TU-USUARIO.github.io/TU-REPOSITORIO/"
npx angular-cli-ghpages --dir=dist/incidentes-angular/browser
```

---

## 🔄 Actualizar la Página Web

Cuando hagas cambios en tu proyecto:

```powershell
# 1. Guardar cambios en Git
git add .
git commit -m "Descripción de tus cambios"
git push origin main

# 2. Compilar nueva versión
ng build --configuration production --base-href "https://TU-USUARIO.github.io/TU-REPOSITORIO/"

# 3. Desplegar actualización
npx angular-cli-ghpages --dir=dist/incidentes-angular/browser
```

---

## ⚙️ Configuración Alternativa (Sin angular-cli-ghpages)

Si prefieres no usar angular-cli-ghpages:

### Opción A: GitHub Actions (Automatizado)

Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build -- --configuration production --base-href "/sistema-incidentes/"
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/incidentes-angular/browser
```

Con esto, cada vez que hagas push a main, se desplegará automáticamente.

### Opción B: Manual con gh-pages branch

```powershell
# Compilar
ng build --configuration production --base-href "/TU-REPOSITORIO/"

# Navegar a la carpeta dist
cd dist/incidentes-angular/browser

# Inicializar git
git init
git add -A
git commit -m 'deploy'

# Subir a gh-pages
git push -f https://github.com/TU-USUARIO/TU-REPOSITORIO.git main:gh-pages

# Volver a la raíz
cd ../../..
```

---

## 🐛 Solución de Problemas

### Error: "Repository not found"
- Verifica que el URL del repositorio sea correcto
- Asegúrate de tener permisos de escritura

### Error: "Permission denied (publickey)"
- Configura SSH keys o usa HTTPS con token de acceso personal
- Guía: https://docs.github.com/en/authentication

### Error: "Failed to load resource"
- Verifica que `--base-href` esté correctamente configurado
- El formato debe ser: `/nombre-repositorio/` (con barras)

### La página muestra 404
- Espera 5-10 minutos después del primer despliegue
- Verifica que GitHub Pages esté habilitado en Settings
- Asegúrate de que la rama `gh-pages` exista

### Estilos o imágenes no cargan
- Problema de rutas: usa rutas relativas en tu código
- Verifica el `--base-href` en el comando build

---

## 📊 Verificar Despliegue

Después de desplegar, verifica:

1. ✅ El sitio carga en `https://TU-USUARIO.github.io/TU-REPOSITORIO/`
2. ✅ La navegación entre páginas funciona
3. ✅ Los estilos se aplican correctamente
4. ✅ Las funcionalidades de formulario e historial funcionan
5. ✅ LocalStorage guarda los datos

---

## 🎯 Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. Crea un archivo `CNAME` en `public/` con tu dominio:
   ```
   www.tudominio.com
   ```

2. Configura DNS de tu dominio:
   ```
   Type: CNAME
   Name: www
   Value: TU-USUARIO.github.io
   ```

3. En GitHub Pages Settings, agrega tu dominio personalizado

---

## 📱 Compartir tu Página

Una vez publicada, comparte el link:
```
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

**Ejemplos**:
- https://juanperez.github.io/sistema-incidentes/
- https://maria-dev.github.io/incidentes-app/

---

## 🎉 ¡Listo!

Tu Sistema de Gestión de Incidentes ahora es una página web pública y profesional.

### Ventajas de GitHub Pages:

✅ **Gratis**: Hosting gratuito permanente  
✅ **Rápido**: CDN global de GitHub  
✅ **HTTPS**: Certificado SSL automático  
✅ **99.9% Uptime**: Alta disponibilidad  
✅ **Fácil actualización**: Con un solo comando  

---

## 📞 Recursos Adicionales

- [Documentación GitHub Pages](https://pages.github.com/)
- [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages)
- [Angular Deployment Guide](https://angular.dev/tools/cli/deployment)

---

**¿Necesitas ayuda?** Revisa la sección de Solución de Problemas arriba.

**¡Tu aplicación ya está lista para el mundo! 🌍🚀**
