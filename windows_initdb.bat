@echo off

REM Load environment variables
setlocal enabledelayedexpansion
for /f "usebackq tokens=1,* delims==" %%x in (`type .env ^| findstr /v /b "#"`) do (
    set "%%x=%%y"
)

REM Create the database if it doesn't exist
psql -U %POSTGRES_USER% -h %POSTGRES_HOST% -c "CREATE DATABASE %POSTGRES_DATABASE%;" || echo Database already exists
