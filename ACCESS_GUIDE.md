# 🚀 アプリケーションへのアクセス方法

## ✅ 正しいアクセス URL

### フロントエンド（React UI）
**これを使用してください：**
```
http://localhost:3000
```
- ユーザーインターフェース
- 診断クイズ
- サブスクリプション管理
- **ここからアプリケーションを使用します**

### バックエンド（API サーバー）
```
http://localhost:5000
```
- REST API エンドポイントのみ
- **直接ブラウザでアクセスしないでください**
- フロントエンド(localhost:3000) から自動的に呼び出されます

---

## 📋 必須の起動手順

### ターミナル 1: バックエンドサーバー
```bash
cd c:\Users\T20007\sample_app
node server/server.js
```

期待される出力：
```
サーバーが起動しました。ポート: 5000
データベースに接続しました
```

### ターミナル 2: フロントエンド開発サーバー
```bash
cd c:\Users\T20007\sample_app
npm run react-start
```

期待される出力：
```
webpack compiled successfully
Compiled successfully!
You can now view omakase-subscription-app in the browser.
  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## ✅ 正常な状態の確認

| 確認項目 | 状態 |
|---------|------|
| `http://localhost:3000` | ✅ アクセス可能（UI表示） |
| `http://localhost:5000/api/health` | ✅ API 稼働確認 |
| `http://localhost:5000` | ❌ 直接アクセス不可（API のみ） |

---

## 🔧 トラブルシューティング

### ❌ localhost:5000 で 404 エラー
**原因：** バックエンドは API サーバーであり、HTML ページを提供しません  
**解決：** `http://localhost:3000` でアクセスしてください

### ❌ localhost:3000 に接続できない
**原因：** React 開発サーバーが起動していない  
**解決：** ターミナル 2 で `npm run react-start` を実行

### ❌ API エラー（CORS）
**原因：** バックエンドが起動していない  
**解決：** ターミナル 1 で `node server/server.js` を実行

---

## 🎯 API ヘルスチェック

バックエンド API が稼働しているか確認：

```bash
curl http://localhost:5000/api/health
```

期待される応答：
```json
{
  "status": "OK",
  "timestamp": "2026-01-19T13:30:00.000Z"
}
```

---

## 📱 ブラウザから使用開始

### 1. フロントエンドにアクセス
```
http://localhost:3000
```

### 2. アプリケーション機能
- 🏠 ホーム - サービス概要表示
- 📝 新規登録 - ユーザー作成
- 🔑 ログイン - 既存ユーザー
- 🎯 診断クイズ - AI 診断
- 📋 サブスク管理 - 定期配送管理
- ⚙️ プロフィール - 設定変更

---

## 🚨 Port が既に使用中の場合

### ポート 3000 が使用中
```bash
# ポート 3000 のプロセスを確認
netstat -ano | findstr :3000

# ポートを強制解放（PID を確認後）
taskkill /PID <PID> /F
```

### ポート 5000 が使用中
```bash
# ポート 5000 のプロセスを確認
netstat -ano | findstr :5000

# ポートを強制解放（PID を確認後）
taskkill /PID <PID> /F
```

---

## 完璧なセットアップフロー

```bash
# 1. プロジェクトディレクトリに移動
cd c:\Users\T20007\sample_app

# 2. 既存プロセスをクリア（必要に場合）
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 3. ターミナル 1: バックエンド起動
node server/server.js

# 4. ターミナル 2: フロントエンド起動
npm run react-start

# 5. ブラウザで http://localhost:3000 にアクセス
```

---

**🎉 これで完全に動作します！**
