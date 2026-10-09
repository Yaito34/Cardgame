@echo off
title Publish TTS export to docs/tts
cd /d "%~dp0"

if "%~1"=="" (
  echo.
  echo  Usage after exporting from cards.html into TTS PNGS:
  echo    publish-tts-from-export.bat zone-deck-1
  echo    publish-tts-from-export.bat intro-tools
  echo.
  echo  Optional second arg: base URL ^(no trailing slash^), e.g.:
  echo    publish-tts-from-export.bat zone-deck-1 https://user.github.io/Repo/tts
  echo.
  pause
  exit /b 1
)

if "%~2"=="" (
  node scripts\publish-tts-from-viewer-export.mjs --deck=%~1
) else (
  node scripts\publish-tts-from-viewer-export.mjs --deck=%~1 --base-url=%~2
)

if errorlevel 1 (
  echo.
  echo  Node failed. Is Node.js installed and in PATH?
  echo.
)
pause
