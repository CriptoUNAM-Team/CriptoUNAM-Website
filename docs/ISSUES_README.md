# 📋 Guía de Issues de CriptoUNAM

## 🎯 ¿Qué es esto?

Este directorio contiene documentación sobre todas las tareas pendientes del proyecto CriptoUNAM organizadas como issues de GitHub.

## 📂 Archivos

- **`PENDING_ISSUES.md`**: Lista detallada de todos los issues con descripción completa
- **`create-issues.sh`**: Script para crear automáticamente todos los issues en GitHub
- **`.github/ISSUE_TEMPLATE/`**: Templates para crear nuevos issues

---

## 🚀 Opción 1: Crear issues automáticamente (Recomendado)

### Prerequisitos

Necesitas tener instalado **GitHub CLI**:

```bash
# En macOS
brew install gh

# En Linux
sudo apt install gh

# En Windows
winget install GitHub.cli
```

### Paso 1: Autenticarse

```bash
gh auth login
```

Sigue las instrucciones en pantalla.

### Paso 2: Ejecutar el script

```bash
cd /Users/gerryp/Documents/Documentos/CriptoUNAM-Web
./create-issues.sh
```

¡Listo! El script creará automáticamente los 15 issues en tu repositorio de GitHub.

### Ver los issues creados

```bash
# Ver todos los issues
gh issue list --repo MarxMad/CriptoUNAM-Website

# Ver issues por etiqueta
gh issue list --repo MarxMad/CriptoUNAM-Website --label "critical"
gh issue list --repo MarxMad/CriptoUNAM-Website --label "high priority"
gh issue list --repo MarxMad/CriptoUNAM-Website --label "content"
```

O visita: https://github.com/MarxMad/CriptoUNAM-Website/issues

---

## 📝 Opción 2: Crear issues manualmente

Si prefieres crear los issues uno por uno:

1. Ve a: https://github.com/MarxMad/CriptoUNAM-Website/issues
2. Click en **"New Issue"**
3. Copia el contenido de `PENDING_ISSUES.md` para cada issue
4. Agrega las etiquetas correspondientes

---

## 🏷️ Sistema de Etiquetas

Los issues están organizados por prioridad y categoría:

### Prioridad
- 🔴 `critical` - Bloqueante, debe resolverse inmediatamente
- 🟡 `high priority` - Importante, resolver pronto
- 🟢 `medium` - Puede esperar
- 🔵 `low` - Nice to have

### Categorías
- `bug` - Algo no funciona
- `enhancement` - Nueva funcionalidad
- `content` - Contenido del sitio (fotos, textos, etc)
- `documentation` - Documentación
- `database` - Base de datos
- `blockchain` - Smart contracts y Web3
- `ui/ux` - Interfaz y experiencia de usuario
- `performance` - Optimización
- `testing` - Tests y calidad
- `configuration` - Configuración del sistema

---

## 📊 Resumen de Issues

| Prioridad | Cantidad | Tiempo Estimado |
|-----------|----------|-----------------|
| 🔴 Crítica | 2 | ~30 min |
| 🟡 Alta | 5 | ~8-10 horas |
| 🟢 Media | 5 | ~18-22 horas |
| 🔵 Baja | 5 | ~20-25 horas |
| **TOTAL** | **17** | **~47-58 horas** |

---

## 🎯 Roadmap Sugerido

### Sprint 1 (Esta semana) - CRÍTICO ⏰
- [ ] #1: Ejecutar script SQL de likes (5 min)
- [ ] #2: Configurar dominio de email (20 min)
- [ ] #4: Agregar fotos recientes (30 min)

**Total: ~1 hora**

### Sprint 2 (Próxima semana) - CONTENIDO 📝
- [ ] #5: Crear newsletters (6-9 horas)
- [ ] #6: Actualizar cursos (1 hora)
- [ ] #9: Información de proyectos (2 horas)

**Total: ~9-12 horas**

### Sprint 3 (Siguiente mes) - BLOCKCHAIN ⛓️
- [ ] #3: Desplegar contrato PUMA (2 horas)
- [ ] Integrar wallet con recompensas
- [ ] Testing del sistema PUMA

**Total: ~5-8 horas**

### Sprint 4 (Futuro) - MEJORAS ✨
- [ ] #7-15: Mejoras de UX, performance y features

**Total: ~30-40 horas**

---

## 💡 Tips para Gestionar Issues

### Asignar issues a ti mismo
```bash
gh issue edit [NÚMERO] --add-assignee @me
```

### Cerrar un issue completado
```bash
gh issue close [NÚMERO]
```

### Agregar comentarios
```bash
gh issue comment [NÚMERO] --body "Comentario aquí"
```

### Ver detalles de un issue
```bash
gh issue view [NÚMERO]
```

### Filtrar issues
```bash
# Solo críticos
gh issue list --label "critical"

# Solo de contenido
gh issue list --label "content"

# Asignados a ti
gh issue list --assignee @me
```

---

## 📈 Siguiendo el Progreso

### En GitHub
Ve a la pestaña **Projects** y crea un tablero Kanban:
- 📝 To Do
- 🏗️ In Progress
- ✅ Done

### Localmente
Puedes usar este comando para ver el estado:

```bash
gh issue list --repo MarxMad/CriptoUNAM-Website --json number,title,state,labels
```

---

## 🤝 Contribuyendo

Si quieres trabajar en un issue:

1. **Asígnate el issue**
   ```bash
   gh issue edit [NÚMERO] --add-assignee @me
   ```

2. **Crea una rama**
   ```bash
   git checkout -b issue-[NÚMERO]-descripcion-corta
   ```

3. **Haz tus cambios y commits**
   ```bash
   git add .
   git commit -m "fix: descripción del cambio (closes #[NÚMERO])"
   ```

4. **Sube tus cambios**
   ```bash
   git push origin issue-[NÚMERO]-descripcion-corta
   ```

5. **Crea un Pull Request**
   ```bash
   gh pr create --title "Fix #[NÚMERO]: Título del PR"
   ```

---

## 📚 Referencias

- **GitHub CLI**: https://cli.github.com/manual/
- **GitHub Issues**: https://docs.github.com/en/issues
- **Markdown Guide**: https://www.markdownguide.org/

---

## ❓ Preguntas Frecuentes

### ¿Puedo modificar los issues después de crearlos?
Sí, puedes editar título, descripción, etiquetas y asignados en cualquier momento.

### ¿Qué pasa si ejecuto el script dos veces?
Se crearán issues duplicados. Es mejor verificar primero con `gh issue list`.

### ¿Puedo agregar más issues?
¡Por supuesto! Usa los templates en `.github/ISSUE_TEMPLATE/` o crea nuevos con:
```bash
gh issue create --title "Título" --body "Descripción"
```

### ¿Cómo priorizo los issues?
Los issues críticos (🔴) deben hacerse primero. Sigue el roadmap sugerido.

---

**¿Listo para empezar?** 🚀

```bash
./create-issues.sh
```

