#!/bin/bash 
echo "Strating release process"
cd /home/rengin-erp/

echo "Updating project files..."
git pull

echo "Building project files..."
yarn front:build:prod
yarn front:assets
echo "Project files built!"

echo "Restarting service..."
pm2 restart service

echo "Release succeed!"