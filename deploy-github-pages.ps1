# Script para desplegar en GitHub Pages

Write-Host "🚀 Desplegando en GitHub Pages..." -ForegroundColor Cyan

# Verificar que existe el build
if (-not (Test-Path "dist\incidentes-angular\browser")) {
    Write-Host "❌ Error: No se encontró el build. Ejecuta 'npm run build' primero." -ForegroundColor Red
    exit 1
}

# Crear rama gh-pages si no existe
git show-ref --verify --quiet refs/heads/gh-pages
if ($LASTEXITCODE -ne 0) {
    Write-Host "📝 Creando rama gh-pages..." -ForegroundColor Yellow
    git checkout --orphan gh-pages
    git reset --hard
    git commit --allow-empty -m "Inicializar rama gh-pages"
    git checkout main
}

# Guardar cambios actuales
Write-Host "💾 Guardando estado actual..." -ForegroundColor Yellow
git checkout main

# Cambiar a gh-pages
Write-Host "🔄 Cambiando a rama gh-pages..." -ForegroundColor Yellow
git checkout gh-pages

# Limpiar contenido anterior
Write-Host "🧹 Limpiando contenido anterior..." -ForegroundColor Yellow
Get-ChildItem -Path . -Exclude .git,dist,node_modules,.gitignore | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# Copiar build
Write-Host "📦 Copiando archivos del build..." -ForegroundColor Yellow
Copy-Item -Path "dist\incidentes-angular\browser\*" -Destination . -Recurse -Force

# Crear .nojekyll para GitHub Pages
New-Item -ItemType File -Path ".nojekyll" -Force | Out-Null

# Commit y push
Write-Host "📤 Subiendo cambios..." -ForegroundColor Yellow
git add .
git commit -m "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin gh-pages --force

# Volver a main
Write-Host "🔙 Regresando a rama main..." -ForegroundColor Yellow
git checkout main

Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host "📍 Tu aplicación estará disponible en: https://pablogiraldoe1.github.io/plantilla-cierre-2.0/" -ForegroundColor Cyan
Write-Host "⏱️  Puede tomar unos minutos en aparecer..." -ForegroundColor Yellow
