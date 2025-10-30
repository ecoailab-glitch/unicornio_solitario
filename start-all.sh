#!/bin/bash

echo "===================================="
echo "  Sistema de Análisis de Startups"
echo "===================================="
echo ""

# Verificar MongoDB
echo "[1/5] Verificando MongoDB..."
if ! mongosh --eval "db.version()" &> /dev/null; then
    echo "[ERROR] MongoDB no está corriendo. Inicia MongoDB primero."
    echo "Ejecuta: mongod"
    exit 1
fi
echo "[OK] MongoDB corriendo"

echo ""
echo "[2/5] Iniciando Backend API (Node.js)..."
cd src/api
gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -e "npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev"' 2>/dev/null
cd ../..
sleep 3

echo ""
echo "[3/5] Iniciando IA Analyzer (Python)..."
cd src/services/ia-analyzer
gnome-terminal -- bash -c "uvicorn app:app --port 6000 --reload; exec bash" 2>/dev/null || \
xterm -e "uvicorn app:app --port 6000 --reload" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && uvicorn app:app --port 6000 --reload"' 2>/dev/null
cd ../../..
sleep 3

echo ""
echo "[4/5] Iniciando Vector DB (Python)..."
cd src/services/vector-db
gnome-terminal -- bash -c "uvicorn app:app --port 7000; exec bash" 2>/dev/null || \
xterm -e "uvicorn app:app --port 7000" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && uvicorn app:app --port 7000"' 2>/dev/null
cd ../../..
sleep 3

echo ""
echo "[5/5] Iniciando Model Engine (Python)..."
cd src/models
gnome-terminal -- bash -c "uvicorn app:app --port 8000; exec bash" 2>/dev/null || \
xterm -e "uvicorn app:app --port 8000" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && uvicorn app:app --port 8000"' 2>/dev/null
cd ..

echo ""
echo "===================================="
echo "  Todos los servicios iniciados"
echo "===================================="
echo ""
echo "URLs:"
echo "  Backend API:   http://localhost:5000"
echo "  IA Analyzer:   http://localhost:6000"
echo "  Vector DB:     http://localhost:7000"
echo "  Model Engine:  http://localhost:8000"
echo "  Frontend:      http://localhost:3000"
echo ""
