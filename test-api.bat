@echo off
echo Testing API endpoints...
echo.

echo Testing health endpoint...
curl -s http://localhost:8000/health
echo.
echo.

echo Testing API test endpoint...
curl -s http://localhost:8000/api/test
echo.
echo.

echo API test complete.
pause