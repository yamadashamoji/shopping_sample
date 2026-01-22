#!/bin/bash
# GitHub Actions デプロイメントスクリプト

# エラーで停止
set -e

echo "🚀 おまかせ定期便 - GitHub Pages デプロイ開始"

# 1. React アプリをビルド
echo "📦 Reactアプリをビルド中..."
npm run build

# 2. GitHub Pages 用に設定
echo "⚙️ GitHub Pages 設定中..."

# public フォルダがなければ作成
if [ ! -d "public" ]; then
  mkdir public
fi

# build フォルダを public にコピー
cp -r build/* public/

# 3. .nojekyll ファイルを作成（GitHub Pages で React Router を使用時）
touch public/.nojekyll

# 4. CNAME ファイルを作成（カスタムドメイン使用時）
# echo "your-domain.com" > public/CNAME

echo "✅ デプロイ準備完了！"
echo ""
echo "📝 次のステップ:"
echo "1. git add public/"
echo "2. git commit -m 'Deploy to GitHub Pages'"
echo "3. git push origin main"
echo ""
echo "🌐 GitHub Pages で公開されます："
echo "https://{username}.github.io/{repository}/"
