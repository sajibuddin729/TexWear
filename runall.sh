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
echo "  • Admin Panel URL: http://localhost:3000/admintexwear"

# Read passcode dynamically from .env so it never leaks in git
PASSCODE=$(grep -E '^ADMIN_PASSCODE=' .env 2>/dev/null | cut -d '=' -f2- | tr -d '"')
echo "  • Admin Passcode:  ${PASSCODE:-Configured in .env}"
echo "=================================================="

npm run dev
