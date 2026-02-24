#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== WorkOrderHub: install and run (backend + frontend) ==="

SHARED_KEY="dev-key-change-in-production"

# Backend .env
if [ ! -f backend/.env ]; then
  echo "Creating backend/.env"
  echo "API_KEY=$SHARED_KEY" > backend/.env
  echo "PORT=3001" >> backend/.env
fi

# Frontend .env.local — keep in sync with backend API_KEY so both ends use same key
if [ -f backend/.env ]; then
  API_KEY=$(grep -E "^API_KEY=" backend/.env | cut -d= -f2- | tr -d "\r\n" | sed "s/^['\"]//;s/['\"]$//")
  [ -z "$API_KEY" ] && API_KEY="$SHARED_KEY"
else
  API_KEY="$SHARED_KEY"
fi
mkdir -p frontend
{
  echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3001"
  echo "NEXT_PUBLIC_API_KEY=$API_KEY"
} > frontend/.env.local
echo "Using API key from backend for frontend (.env.local)"

echo "Installing backend dependencies..."
(cd backend && npm install)

echo "Installing frontend dependencies..."
(cd frontend && npm install)

echo "Starting backend on http://localhost:3001 ..."
(cd backend && npm run dev) &
BACKEND_PID=$!

cleanup() {
  echo "Stopping backend (PID $BACKEND_PID)"
  kill $BACKEND_PID 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

sleep 2
echo "Starting frontend on http://localhost:3000 ..."
(cd frontend && npm run dev)
