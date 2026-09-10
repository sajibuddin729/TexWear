#!/bin/bash

# TEX WEAR Fullstack App Launcher Script

echo "=================================================="
echo "🚀 Starting TEX WEAR Fullstack Application..."
echo "=================================================="

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
