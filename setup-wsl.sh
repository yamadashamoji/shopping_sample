#!/bin/bash

# WSL セットアップスクリプト
# このスクリプトを WSL 内で実行してください

echo "=========================================="
echo "WSL 環境セットアップ開始"
echo "=========================================="

# 1. パッケージリストの更新
echo ""
echo "📦 パッケージリストを更新中..."
sudo apt-get update -y

# 2. Node.js と npm のインストール確認
echo ""
echo "🔍 Node.js と npm の確認中..."
if ! command -v node &> /dev/null; then
    echo "📥 Node.js をインストール中..."
    sudo apt-get install -y nodejs npm
else
    echo "✅ Node.js はインストール済み: $(node --version)"
fi

if ! command -v npm &> /dev/null; then
    echo "📥 npm をインストール中..."
    sudo apt-get install -y npm
else
    echo "✅ npm はインストール済み: $(npm --version)"
fi

# 3. Python 3 のインストール確認
echo ""
echo "🔍 Python 3 の確認中..."
if ! command -v python3 &> /dev/null; then
    echo "📥 Python 3 をインストール中..."
    sudo apt-get install -y python3 python3-pip
else
    echo "✅ Python 3 はインストール済み: $(python3 --version)"
fi

# 4. curl と wget のインストール確認
echo ""
echo "🔍 curl と wget の確認中..."
sudo apt-get install -y curl wget build-essential

# 5. プロジェクトディレクトリに移動
echo ""
echo "📂 プロジェクトディレクトリに移動中..."
cd ~/sample_app || { echo "❌ sample_app ディレクトリが見つかりません"; exit 1; }

# 6. node_modules をリセット（Windows と WSL 間の互換性のため）
echo ""
echo "🔄 node_modules をクリア中（必要に応じて）..."
rm -rf node_modules package-lock.json 2>/dev/null || true

# 7. npm 依存関係をインストール
echo ""
echo "📥 npm 依存関係をインストール中..."
npm install

# 8. データベースを初期化
echo ""
echo "🗄️  データベースを初期化中..."
python3 init_db.py

# 9. セットアップ完了
echo ""
echo "=========================================="
echo "✅ WSL セットアップ完了！"
echo "=========================================="
echo ""
echo "🚀 以下のコマンドでアプリケーションを起動してください：" 
echo ""
echo "ターミナル 1（バックエンド）:"
echo "  cd ~/sample_app && npm run start"
echo ""
echo "ターミナル 2（フロントエンド）:"
echo "  cd ~/sample_app && npm run react-start"
echo ""
echo "📱 ブラウザで http://localhost:3000 にアクセス"
echo ""
