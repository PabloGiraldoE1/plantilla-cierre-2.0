# 🚀 GUÍA RÁPIDA DE PUBLICACIÓN EN GITHUB

## ⚡ Publicar en 5 Minutos

### Paso 1: Crear Repositorio en GitHub (2 min)

1. Ve a https://github.com/new
2. **Nombre del repositorio**: `sistema-incidentes` (o el que prefieras)
3. **Descripción**: `Sistema de Gestión de Incidentes - Angular`
4. **Visibilidad**: ✅ Public
5. **NO marques** "Add a README file"
6. Click en **"Create repository"**

### Paso 2: Conectar y Subir (2 min)

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd d:\plantilla-incidentes-main\incidentes-angular

# Configurar Git (primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Agregar archivos
git add .

# Primer commit
git commit -m "Sistema de Gestión de Incidentes v2.0"

# Conectar con GitHub (CAMBIA tu-usuario y tu-repositorio)
git remote add origin https://github.com/tu-usuario/sistema-incidentes.git
git branch -M main

# Subir código
git push -u origin main
```

### Paso 3: Desplegar Automáticamente (1 min)

**¡GitHub Actions lo hará por ti!** 

Espera 2-3 minutos y tu sitio estará en:
```
https://tu-usuario.github.io/sistema-incidentes/
```

### Paso 4: Verificar (30 seg)

1. Ve a tu repositorio en GitHub
2. Click en **"Actions"** - verás el despliegue en proceso
3. Cuando aparezca ✅ verde, ¡está listo!
4. Ve a **Settings → Pages** para ver la URL

---

## 🎯 COMANDOS COMPLETOS (Copia y Pega)

**IMPORTANTE**: Reemplaza `tu-usuario` y `sistema-incidentes` con tus datos.

```powershell
# Navegar al proyecto
cd d:\plantilla-incidentes-main\incidentes-angular

# Configurar Git (solo primera vez)
git config --global user.name "Tu Nombre Aquí"
git config --global user.email "tuemail@ejemplo.com"

# Inicializar y subir
git add .
git commit -m "Sistema de Gestión de Incidentes v2.0"
git remote add origin https://github.com/tu-usuario/sistema-incidentes.git
git branch -M main
git push -u origin main
```

---

## ✅ Checklist Rápido

- [ ] Crear repositorio en GitHub
- [ ] Configurar nombre y email en Git
- [ ] Ejecutar comandos de subida
- [ ] Esperar que GitHub Actions termine (2-3 min)
- [ ] Visitar tu sitio web

---

## 🎉 ¡Listo!

Tu aplicación ya está publicada en:
```
https://tu-usuario.github.io/tu-repositorio/
```

### 🔄 Para Actualizar en el Futuro

```powershell
# Hacer cambios en tu código...

# Luego:
git add .
git commit -m "Descripción de cambios"
git push

# GitHub Actions desplegará automáticamente
```

---

## ❓ Problemas Comunes

### "Permission denied"
```powershell
# Usa HTTPS con tu token de GitHub
git remote set-url origin https://TU-TOKEN@github.com/tu-usuario/tu-repo.git
```

### "Repository not found"
- Verifica que el nombre del repositorio sea correcto
- Asegúrate de que el repositorio existe en GitHub

### "Site not found (404)"
- Espera 5-10 minutos después del primer deploy
- Ve a Settings → Pages y verifica que esté habilitado
- Asegúrate de que la rama sea `gh-pages`

---

## 📚 Más Información

- [Guía Detallada](./DESPLIEGUE-GITHUB-PAGES.md) - Instrucciones completas
- [Documentación del Proyecto](./README.md) - Todo sobre el proyecto
- [GitHub Pages Docs](https://pages.github.com/) - Documentación oficial

---

**¿Primera vez usando Git/GitHub?** No te preocupes, solo sigue los pasos exactamente como están escritos. 😊
