@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================================
echo 🚀 INFORME COMPLETO DEL MONOREPO: RIFASFULLPROJECT
echo ============================================================
echo.

:: Fecha y hora
echo 📅 Fecha: %date% %time%
echo.

:: 1. ENTORNO DEL SISTEMA
echo 🔹 ENTORNO DEL SISTEMA
echo ------------------------------------------------------------
systeminfo | findstr /C:"Nombre del sistema" /C:"Procesador" /C:"Memoria f" /C:"Versión del sistema"
echo.
node --version >nul 2>&1 && (
    echo Node.js: %node_version%
    for /f "tokens=2*" %%a in ('node --version') do set node_version=%%a
    echo   Versión: !node_version!
) || echo   ⚠️ Node.js NO instalado

npm --version >nul 2>&1 && (
    for /f "tokens=2*" %%a in ('npm --version') do set npm_version=%%a
    echo   npm: !npm_version!
) || echo   ⚠️ npm NO instalado
echo.

:: 2. UBICACIÓN ACTUAL
echo 🔹 UBICACIÓN DEL PROYECTO
echo ------------------------------------------------------------
cd
echo.

:: 3. ESTRUCTURA DE CARPETAS
echo 🔹 ESTRUCTURA DE CARPETAS (apps/ y packages/)
echo ------------------------------------------------------------
if exist "apps\" (
    echo Apps:
    tree /f apps 2>nul | findstr /v /c:"No se pudo"
) else (
    echo ❌ Carpeta apps/ NO existe
)
echo.
if exist "packages\" (
    echo Packages:
    tree /f packages 2>nul | findstr /v /c:"No se pudo"
) else (
    echo ❌ Carpeta packages/ NO existe
)
echo.

:: 4. WORKSPACES CONFIGURADOS
echo 🔹 WORKSPACES EN package.json RAÍZ
echo ------------------------------------------------------------
if exist "package.json" (
    findstr /i "workspaces" package.json
    echo.
    echo   Paquetes detectados:
    for /d %%d in (apps\*) do (
        if exist "%%d\package.json" (
            for /f "tokens=2 delims=:," %%a in ('type "%%d\package.json" ^| findstr /i "name"') do (
                echo     - %%a
            )
        )
    )
    for /d %%d in (packages\*) do (
        if exist "%%d\package.json" (
            for /f "tokens=2 delims=:," %%a in ('type "%%d\package.json" ^| findstr /i "name"') do (
                echo     - %%a
            )
        )
    )
) else (
    echo ❌ package.json raíz NO encontrado
)
echo.

:: 5. DEPENDENCIAS INSTALADAS
echo 🔹 DEPENDENCIAS INSTALADAS (node_modules/)
echo ------------------------------------------------------------
if exist "node_modules\@rifasfull" (
    echo Paquetes @rifasfull encontrados:
    dir /b node_modules\@rifasfull 2>nul
    echo.
    echo Verificando symlinks:
    for /d %%d in (node_modules\@rifasfull\*) do (
        fsutil reparsepoint query "%%d" >nul 2>&1 && (
            echo   ✅ %%~nxd es SYMLINK
        ) || (
            echo   ⚠️  %%~nxd es COPIA (no symlink)
        )
    )
) else (
    echo ❌ node_modules\@rifasfull NO existe (workspaces no resueltos)
)
echo.

:: 6. VARIABLES DE ENTORNO SUPABASE
echo 🔹 VARIABLES DE ENTORNO SUPABASE (.env.local)
echo ------------------------------------------------------------
if exist ".env.local" (
    echo ✅ .env.local ENCONTRADO
    findstr /i "SUPABASE" .env.local
    echo.
    echo   ⚠️  ADVERTENCIA: Verifica que NO haya espacios al final de las URLs
) else (
    echo ❌ .env.local NO encontrado
)
echo.

:: 7. ARCHIVOS CRÍTICOS
echo 🔹 ARCHIVOS CRÍTICOS
echo ------------------------------------------------------------
set "files=package.json packages\core\package.json packages\shared-types\package.json apps\admin\package.json apps\client\package.json"
for %%f in (%files%) do (
    if exist "%%f" (
        echo ✅ %%f
    ) else (
        echo ❌ %%f
    )
)
echo.

:: 8. ESPACIO EN DISCO
echo 🔹 ESPACIO EN DISCO (Unidad E:)
echo ------------------------------------------------------------
wmic logicaldisk where "DeviceID='E:'" get FreeSpace,Size,VolumeName 2>nul
echo.

:: 9. DIAGNÓSTICO FINAL
echo ============================================================
echo 🧪 DIAGNÓSTICO FINAL
echo ============================================================
set "issues=0"

if not exist "packages\core" (
    echo ❌ PROBLEMA: packages\core NO existe
    set /a issues+=1
)

if not exist "node_modules\@rifasfull\core" (
    echo ⚠️  ADVERTENCIA: @rifasfull\core no resuelto en node_modules
    set /a issues+=1
)

if not exist ".env.local" (
    echo ⚠️  ADVERTENCIA: .env.local faltante (Supabase no funcionará)
    set /a issues+=1
)

dir ".env.local" 2>nul | findstr /r /c:"[ ]$" >nul && (
    echo ⚠️  ADVERTENCIA: .env.local tiene ESPACIOS al final (causa errores 400)
    set /a issues+=1
)

if %issues% equ 0 (
    echo ✅ PROYECTO EN BUEN ESTADO - Listo para desarrollo
) else if %issues% leq 2 (
    echo ⚠️  PROYECTO CON %issues% ADVERTENCIAS - Requiere ajustes menores
) else (
    echo ❌ PROYECTO CON %issues% PROBLEMAS - Requiere intervención
)

echo.
echo ============================================================
echo 📊 INFORME GENERADO: %date% %time%
echo 💡 GUARDA ESTA SALIDA PARA SOPORTE TÉCNICO
echo ============================================================
pause