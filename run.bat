@echo off

start "Backend" cmd /k "cd /d backend && python run.py"
start "Frontend" cmd /k "cd /d frontend && npm run dev"

exit