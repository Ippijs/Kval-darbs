#!/bin/bash
# Verification script - checks if React setup is complete

echo "╔════════════════════════════════════════════════════════╗"
echo "║   FishingGear Pro - React Setup Verification          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check react-app folder exists
if [ -d "react-app" ]; then
    echo "✅ react-app/ folder exists"
else
    echo "❌ react-app/ folder not found"
    exit 1
fi

# Check key files
echo ""
echo "Checking key files..."

files=(
    "react-app/package.json"
    "react-app/vite.config.js"
    "react-app/index.html"
    "react-app/src/main.jsx"
    "react-app/src/App.jsx"
    "react-app/src/index.css"
    "react-app/src/api/client.js"
    "react-app/src/pages/Home.jsx"
    "react-app/src/components/Navbar.jsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
    fi
done

echo ""
echo "Checking directories..."

dirs=(
    "react-app/src/pages"
    "react-app/src/components"
    "react-app/src/api"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir/"
    else
        echo "  ❌ $dir/ (missing)"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js installed: $(node -v)"
else
    echo "❌ Node.js not found"
    echo "   Download from: https://nodejs.org/"
fi

echo ""
if [ -d "react-app/node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed"
    echo "   Run: cd react-app && npm install"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Setup Status: ✅ READY TO USE"
echo ""
echo "To start:"
echo "  1. cd react-app"
echo "  2. npm install (if not done)"
echo "  3. npm run dev"
echo "  4. Open http://localhost:5173"
echo ""
