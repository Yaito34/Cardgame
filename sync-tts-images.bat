@echo off
title Sync TTS PNGS to docs/tts/images
cd /d "%~dp0"

echo.
echo  Copies every .png from TTS PNGS\ into docs\tts\images\ (same names),
echo  removes extra .png in docs (except common-back + intro-tts-sheet-01),
echo  then updates FaceURLs in docs\tts\objects + manifest.json.
echo.

node scripts\publish-tts-from-viewer-export.mjs --mirror-all
if errorlevel 1 (
  echo.
  echo  Node failed. Is Node.js installed and in PATH?
  echo.
  pause
  exit /b 1
)

echo.
echo  Next: run sync-tts-to-github.bat to commit and push docs/tts, or
echo  git add docs/tts, git commit, git push by hand
echo.
pause
