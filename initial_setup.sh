#!/bin/bash

# ============================================
# DesTrack Project Setup Script
# ============================================

set -e  # Exit on error

echo "=========================================="
echo "     DesTrack Installation Script"
echo "=========================================="
echo ""

# --------------------------------------------
# SECTION 1: Check System Tools
# --------------------------------------------
echo "1. Checking system tools..."
echo "------------------------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js installed: $NODE_VERSION"
else
    echo "✗ Node.js NOT found"
    echo "  Please install Node.js v18+ from https://nodejs.org/"
    echo "  Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm installed: $NPM_VERSION"
else
    echo "✗ npm NOT found (should come with Node.js)"
    exit 1
fi

# Check npx
if command -v npx &> /dev/null; then
    NPX_VERSION=$(npx --version)
    echo "✓ npx installed: $NPX_VERSION"
else
    echo "✗ npx NOT found (should come with npm 5.2+)"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✓ Git installed: $GIT_VERSION"
else
    echo "✗ Git NOT found"
    echo "  Please install Git: sudo apt install git"
    exit 1
fi

echo ""

# --------------------------------------------
# SECTION 2: Project Scaffolding with Vite
# --------------------------------------------
echo "2. Scaffolding React + TypeScript project with Vite..."
echo "------------------------------------------"

# Check if package.json already exists
if [ -f "package.json" ]; then
    echo "✓ package.json already exists, skipping scaffold"
else
    # Create Vite project in current directory
    # Using --template react-ts for React + TypeScript
    npx create-vite@latest . --template react-ts
    echo "✓ Vite project scaffolded"
fi

echo ""

# --------------------------------------------
# SECTION 3: Install Base Dependencies
# --------------------------------------------
echo "3. Installing base dependencies..."
echo "------------------------------------------"

sudo npm install
echo "✓ Base dependencies installed"

echo ""

# --------------------------------------------
# SECTION 4: Install Additional Dependencies
# --------------------------------------------
echo "4. Installing project-specific dependencies..."
echo "------------------------------------------"

# Zustand for state management
echo "Installing Zustand..."
sudo npm install zustand
echo "✓ Zustand installed"

# @dnd-kit full suite for drag and drop
echo "Installing @dnd-kit packages..."
sudo npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
echo "✓ @dnd-kit packages installed (core, sortable, utilities)"

echo ""

# --------------------------------------------
# SECTION 5: Verify Installation
# --------------------------------------------
echo "5. Verifying installation..."
echo "------------------------------------------"

echo "Installed packages:"
npm list --depth=0

echo ""
echo "=========================================="
echo "     Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start development server"
echo "  2. Open http://localhost:5173 in your browser"
echo ""
