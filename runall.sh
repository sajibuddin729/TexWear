#!/bin/bash

# TEX WEAR Fullstack App Launcher Script

echo "=================================================="
echo "🚀 Starting TEX WEAR Fullstack Application..."
echo "=================================================="

# Change directory to Frontend
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ -d "$SCRIPT_DIR/Frontend" ]; then
  cd "$SCRIPT_DIR/Frontend"
elif [ -d "$SCRIPT_DIR/frontend" ]; then
  cd "$SCRIPT_DIR/frontend"
fi

# Sync Prisma Database Schema
echo "📦 Syncing Prisma Database Schema..."
npx prisma db push

# Starting Next.js Dev Server
echo "=================================================="
echo "🌐 Launching Application:"
echo "  • Storefront URL:  http://localhost:3000"
echo "  • Admin Panel URL: http://localhost:3000/admin"
echo "  • Admin Passcode:  admin123"
echo "=================================================="

npm run dev
