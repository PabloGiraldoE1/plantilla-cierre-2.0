# ========================================
# Script de Despliegue a GitHub Pages
# Plantilla de Gestión de Incidentes
# ========================================

# CONFIGURACIÓN - EDITA ESTOS VALORES
$REPO_NAME = "sistema-incidentes"
$USER_NAME = "tu-usuario-github"
$BASE_URL = "https://$USER_NAME.github.io/$REPO_NAME/"

# ========================================

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   DESPLIEGUE A GITHUB PAGES" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "angular.json")) {
    Write-Host "❌ Error: No se encuentra angular.json" -ForegroundColor Red
    Write-Host "   Asegúrate de estar en la raíz del proyecto Angular" -ForegroundColor Yellow
    exit 1
}

# Paso 1: Compilar el proyecto
Write-Host "🔨 Paso 1: Compilando proyecto para producción..." -ForegroundColor Cyan
Write-Host "   Base URL: $BASE_URL" -ForegroundColor Gray
Write-Host ""

ng build --configuration production --base-href $BASE_URL

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error en la compilación" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Compilación exitosa" -ForegroundColor Green
Write-Host ""

# Paso 2: Verificar que existe la carpeta dist
if (-not (Test-Path "dist/incidentes-angular/browser")) {
    Write-Host "❌ Error: No se encontró la carpeta de distribución" -ForegroundColor Red
    Write-Host "   Esperado: dist/incidentes-angular/browser" -ForegroundColor Yellow
    exit 1
}

# Paso 3: Desplegar a GitHub Pages
Write-Host "🚀 Paso 2: Desplegando a GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

npx angular-cli-ghpages --dir=dist/incidentes-angular/browser --no-silent

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error en el despliegue" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "   1. Verifica que hayas hecho push al repositorio de GitHub" -ForegroundColor Gray
    Write-Host "   2. Asegúrate de tener configurado el remote 'origin'" -ForegroundColor Gray
    Write-Host "   3. Ejecuta: git remote -v" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "   ✅ DESPLIEGUE COMPLETADO" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Tu sitio estará disponible en:" -ForegroundColor Cyan
Write-Host "   $BASE_URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏱️  Espera 1-5 minutos para que GitHub Pages procese los cambios" -ForegroundColor Gray
Write-Host ""
Write-Host "📊 Para verificar el estado:" -ForegroundColor Cyan
Write-Host "   1. Ve a: https://github.com/$USER_NAME/$REPO_NAME/settings/pages" -ForegroundColor Gray
Write-Host "   2. Verifica que 'Source' esté en rama 'gh-pages'" -ForegroundColor Gray
Write-Host ""
Write-Host "¡Listo! 🎉" -ForegroundColor Green
Write-Host ""
