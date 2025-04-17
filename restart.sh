#!/bin/bash

# Stop any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f next

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies (if needed)
echo "Checking dependencies..."
npm install

# Start the development server
echo "Starting Next.js development server..."
npm run dev
