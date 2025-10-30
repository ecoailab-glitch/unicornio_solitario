@echo off
echo ====================================
echo   Sistema de Analisis de Startups
echo ====================================
echo.

REM Verificar MongoDB
echo [1/5] Verificando MongoDB...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB no esta corriendo. Inicia MongoDB primero.
    echo Ejecuta: mongod
    pause
    exit /b 1
)
echo [OK] MongoDB corriendo

echo.
echo [2/5] Iniciando Backend API (Node.js)...
start "Backend API" cmd /k "cd src\api && npm run dev"
timeout /t 3 >nul

echo.
echo [3/5] Iniciando IA Analyzer (Python)...
start "IA Analyzer" cmd /k "cd src\services\ia-analyzer && uvicorn app:app --port 6000 --reload"
timeout /t 3 >nul

echo.
echo [4/5] Iniciando Vector DB (Python)...
start "Vector DB" cmd /k "cd src\services\vector-db && uvicorn app:app --port 7000"
timeout /t 3 >nul

echo.
echo [5/5] Iniciando Model Engine (Python)...
start "Model Engine" cmd /k "cd src\models && uvicorn app:app --port 8000"

echo.
echo ====================================
echo   Todos los servicios iniciados
echo ====================================
echo.
echo URLs:
echo   Backend API:   http://localhost:5000
echo   IA Analyzer:   http://localhost:6000
echo   Vector DB:     http://localhost:7000
echo   Model Engine:  http://localhost:8000
echo   Frontend:      http://localhost:3000
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
