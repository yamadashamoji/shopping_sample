# クイックスタートガイド

## 1. インストール

```bash
# プロジェクトフォルダに移動
cd sample_app

# npm パッケージをインストール
npm install

# SQLite CLI をインストール（Windowsの場合）
# https://www.sqlite.org/download.html からダウンロード
```

## 2. データベース初期化

### 方法 1: Python スクリプト（推奨）

```bash
# Python を使用して初期化（自動的に schema.sql と seed.sql を実行）
python init_db.py
```

### 方法 2: バッチスクリプト（Windows）

```bash
# Windows バッチスクリプトで初期化
init_db.bat
```

### 方法 3: sqlite3 CLI（手動）

```bash
# PowerShell では git bash を使用するか、cmd.exe を使用してください
sqlite3 database/app.db ".read database/schema.sql"
sqlite3 database/app.db ".read database/seed.sql"

# または cmd.exe で
cmd.exe /c "sqlite3 database\app.db < database\schema.sql"
cmd.exe /c "sqlite3 database\app.db < database\seed.sql"
```

## 3. サーバー起動

### ターミナル1: バックエンド（Node.js/Express）
```bash
npm start
# または開発モード
npm run dev

# ✅ http://localhost:5000 で起動
```

### ターミナル2: フロントエンド（React）
```bash
npm run react-start

# ✅ http://localhost:3000 で起動
```

## 4. ブラウザでアクセス

```
http://localhost:3000
```

## テストユーザー作成

1. **新規登録**ボタンをクリック
2. テスト用データを入力：
   - ユーザー名: testuser
   - メール: test@example.com
   - パスワード: password123

## 主な機能確認フロー

1. **ホーム画面** - サービス概要を表示
2. **カテゴリ選択** - 5つのカテゴリから選択
3. **AI診断クイズ** - 好みに関する質問に回答
4. **診断結果** - マッチスコアと推奨商品を表示
5. **プラン選択** - 3つの配送プランから選択
6. **サブスク登録** - 次回配送日が自動計算される
7. **管理画面** - サブスク・プロフィール管理

## フォルダ構成の意味

```
src/
  ├─ App.js           ... メインアプリケーション（全ロジック）
  ├─ styles/main.css  ... レスポンシブUIスタイル
  ├─ components/      ... (拡張用）再利用コンポーネント
  └─ utils/           ... ヘルパー関数（CSV出力等）

server/
  └─ server.js        ... Express API サーバー
                         （JWT認証、DB接続含む）

database/
  ├─ schema.sql       ... テーブル定義
  ├─ seed.sql         ... 初期データ
  └─ app.db           ... SQLite データベース
```

## API サーバーテスト（curl）

```bash
# ユーザー登録
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass"}'

# ログイン
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass"}'

# カテゴリ一覧
curl http://localhost:5000/api/categories

# ヘルスチェック
curl http://localhost:5000/api/health
```

## 本番デプロイ（GitHub Pages）

```bash
# 1. React ビルド
npm run build

# 2. GitHub にプッシュ（main ブランチ）
git add .
git commit -m "Initial commit"
git push origin main

# 3. GitHub Pages 設定
# Settings > Pages > Source: Deploy from a branch
# Branch: main, Folder: /root

# ✅ https://{username}.github.io/{repo}/ で公開
```

## トラブル対応

| 問題 | 解決方法 |
|------|--------|
| `npm ERR! ETARGET jsonwebtoken` | package.json を更新（バージョン ^9.0.0） |
| `Cannot find module 'express'` | `npm install --legacy-peer-deps` を実行 |
| `ECONNREFUSED 5000` | バックエンド起動確認 |
| `CORS エラー` | バックエンド `http://localhost:5000` で起動中か確認 |
| `演算子 '<' は予約されています` | Python スクリプト `python init_db.py` を使用 |
| DB ファイルが見つからない | `python init_db.py` または `init_db.bat` を実行 |
| JWT トークン無効 | ブラウザキャッシュを清除して再ログイン |

## キー機能コード

### 診断スコア計算
```javascript
const score = Object.keys(quizAnswers).length * 25;
// 各質問 25%で計算 (4問 = 100%)
```

### 配送日計算
```javascript
const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + frequency);
// frequency: basic=30, premium=14, deluxe=7
```

### タグマッチング推奨
```javascript
const score = userTags.filter(tag => 
  productTags.includes(tag)
).length * 3;
// 一致度に基づいて商品ランキング
```

## 環境変数

`.env` ファイルを作成（例）：
```
PORT=5000
SECRET_KEY=your-secret-key-here
DATABASE_PATH=./database/app.db
REACT_APP_API_URL=http://localhost:5000
```

## 次のステップ

- [ ] 支払い決済機能（Stripe）を追加
- [ ] メール通知システムを実装
- [ ] モバイルレスポンシブを改善
- [ ] ユーザーレビュー機能を追加
- [ ] 管理ダッシュボードを作成
- [ ] ソーシャルシェア機能

---

**質問や問題があれば、README.md を参照するか、Issue を作成してください！**
