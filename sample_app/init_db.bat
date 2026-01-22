@echo off
REM データベース初期化スクリプト（Windows用）

echo.
echo 【おまかせ定期便】データベース初期化
echo.

REM Python が利用可能か確認
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python を使用して初期化します...
    python init_db.py
    goto end
)

REM Python が利用不可な場合は sqlite3 CLI を使用
echo sqlite3 CLI を使用して初期化します...

if not exist database\app.db (
    echo ✓ database\app.db を作成します...
)

sqlite3 database\app.db ".read database\schema.sql"
if %errorlevel% neq 0 (
    echo ❌ スキーマの適用に失敗しました
    pause
    exit /b 1
)
echo ✓ スキーマを適用しました

sqlite3 database\app.db ".read database\seed.sql"
if %errorlevel% neq 0 (
    echo ❌ 初期データの挿入に失敗しました
    pause
    exit /b 1
)
echo ✓ 初期データを挿入しました

:end
echo.
echo ✅ データベース初期化完了！
echo.
pause
