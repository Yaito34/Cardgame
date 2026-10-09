@echo off
title Card viewer — Ruined Wold
cd /d "%~dp0"

echo.
echo  After Node starts, open the URL it prints ^(usually http://127.0.0.1:8765/cards.html^).
echo  If 8765 is busy, the next free port is used ^(see message in the console^).
echo.
echo  In cards.html: "Export TTS PNGs" captures visible cards ^(3x2 per PNG^) into:  TTS PNGS
echo  ^(needs internet once for html2canvas CDN^).
echo.
echo  Press Ctrl+C to stop the server.
echo.

node scripts\card-viewer-server.mjs
if errorlevel 1 (
  echo.
  echo  Node failed. Is Node.js installed and in PATH?
  echo.
)
pause
