@echo off

:START
node --no-warnings phoenix.js 
if ERRORLEVEL 1 (
  echo Error occurred. Restarting...
  ping -n 5 127.0.0.1 > nul
  goto START
)
cls
goto START
