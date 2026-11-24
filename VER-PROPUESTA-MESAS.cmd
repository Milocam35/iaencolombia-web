@echo off
setlocal
cd /d "%~dp0"
if not exist ".next\BUILD_ID" (
  echo Falta construir la vista previa local. Consulta docs\public-sector-tables-preview.md.
  pause
  exit /b 1
)
set "NEXT_PUBLIC_ACIA_API_URL=http://127.0.0.1:9"
set "NEXT_TELEMETRY_DISABLED=1"
echo.
echo Vista previa local de Mesas tecnicas sectoriales.
echo Mantiene esta ventana abierta. Ctrl+C detiene la vista previa.
echo.
echo Inicio: http://127.0.0.1:3187/
echo Mesas:  http://127.0.0.1:3187/mesas-tecnicas-sectoriales
echo.
call "node_modules\.bin\next.cmd" start --hostname 127.0.0.1 --port 3187
