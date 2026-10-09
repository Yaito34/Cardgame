@echo off
title Sync TTS to docs/tts and push to GitHub
cd /d "%~dp0"

echo.
echo  [1/3] Copying TTS PNGS to docs\tts\images and refreshing FaceURLs
echo  ^(same as: npm run sync:tts-images^)
echo.
node scripts\publish-tts-from-viewer-export.mjs --mirror-all
if errorlevel 1 (
  echo.
  echo  Node failed. Is Node.js installed and in PATH?
  pause
  exit /b 1
)

echo.
echo  [2/3] git add docs\tts
echo.
git add docs/tts
if errorlevel 1 (
  echo  git add failed. Is this a git repository?
  pause
  exit /b 1
)

echo.
echo  [3/3] git commit and git push
echo.
git commit -m "Update TTS card art"
if errorlevel 1 (
  echo  No commit created ^(no changes in docs/tts, or pre-commit issue^). Skipping push.
  echo.
  pause
  exit /b 0
)
git push
if errorlevel 1 (
  echo  Push failed. Check remote, auth, and network.
  pause
  exit /b 1
)
echo.
echo  Done. GitHub Pages can take a short time to refresh the published assets.
echo.
pause
