# 🚀 本番環境セットアップガイド

## エラー修正済み ✅

すべてのセットアップエラーが解決されました。

### 修正内容

1. **ES Module エラー** ✓
   - `package.json` から `"type": "module"` を削除
   - CommonJS で統一

2. **React エントリーポイント** ✓
   - `public/index.html` を作成
   - `src/index.js` を作成（React マウント）
   - `public/favicon.svg` を作成

3. **依存関係** ✓
   - `ajv`, `ajv-keywords` をインストール
   - `npm install --legacy-peer-deps` 実行済み

---

## 起動手順（完成版）

### ステップ 1: パッケージ確認

```bash
cd c:\Users\T20007\sample_app

# 既にインストール済みですが、確認用：
npm list express sqlite3 react
```

### ステップ 2: **ターミナル1** - バックエンド起動

```bash
# ターミナル1 を開く
node server/server.js

# 期待される出力：
# サーバーが起動しました。ポート: 5000
# データベースに接続しました
```

### ステップ 3: **ターミナル2** - フロントエンド起動

```bash
# ターミナル2 を開く
npm run react-start

# ブラウザが自動的に開きます：
# http://localhost:3000
```

---

## テストフロー

1. **ホーム画面**が表示される（未ログイン）
2. **「新規登録」** ボタンをクリック
3. テストアカウント作成：
   ```
   ユーザー名: testuser
   メール: test@example.com
   パスワード: password123
   ```
4. ログイン
5. カテゴリを選択 → AI診断クイズ → サブスク登録

---

## トラブルシューティング

| 症状 | 解決方法 |
|-----|--------|
| `Cannot find module` | `npm install --legacy-peer-deps` 再実行 |
| ポート 5000 がビジー | `netstat -ano \| findstr :5000` で確認 |
| ポート 3000 がビジー | `netstat -ano \| findstr :3000` で確認 |
| DB ファイルエラー | `python init_db.py` で再初期化 |
| ページが真っ白 | ブラウザコンソール（F12）でエラー確認 |

---

## API テスト（バックエンド確認）

```bash
# ヘルスチェック
curl http://localhost:5000/api/health

# カテゴリ一覧
curl http://localhost:5000/api/categories
```

---

## 本番デプロイ（GitHub Pages）

```bash
# 1. ビルド
npm run build

# 2. Git コミット
git add .
git commit -m "Production build"

# 3. GitHub にプッシュ
git push origin main

# ✅ https://{username}.github.io/{repo}/ で公開
```

---

## ファイル構成の確認

```
✓ package.json         (type: module 削除済み)
✓ public/index.html    (React エントリーポイント)
✓ public/favicon.svg   (アイコン)
✓ src/index.js         (React マウント)
✓ src/App.js          (メインアプリ)
✓ server/server.js     (Express API)
✓ database/app.db      (SQLite)
```

---

## よくある質問

**Q: どのポート番号を使用していますか?**  
A: フロント 3000、バック 5000

**Q: 複数カテゴリに対応していますか?**  
A: はい、5カテゴリに対応（コーヒー・靴下・スキンケア・紅茶・チョコレート）

**Q: データベースはどこに保存されていますか?**  
A: `database/app.db` （SQLite）

**Q: ユーザーデータは暗号化されていますか?**  
A: はい、bcrypt でハッシュ化済み

---

**すべてのセットアップが完了しました！🎉**

次は、`npm run react-start` で起動してください。
