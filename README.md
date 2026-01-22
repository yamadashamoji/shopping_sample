# おまかせ定期便 - AI診断型サブスクリプションプラットフォーム

革新的なAI診断とスケジューリング機能を備えた、多カテゴリ対応のサブスクリプションサービスプラットフォームです。

## プロジェクト概要

**おまかせ定期便**は、ユーザーの好みを詳細に分析する診断クイズを通じて、最適な商品を毎月自動配送するサービスです。

### 対応カテゴリ
- ☕ コーヒー豆
- 🧦 靴下
- 💄 スキンケア
- 🍵 紅茶
- 🍫 チョコレート

### 主な機能

#### 🎯 AI診断システム
- カテゴリ別の詳細な診断クイズ
- ユーザーの好みを複数の軸で分析
- マッチスコア計算
- 推奨商品の自動生成

#### 📅 スケジューリング機能
- 3つの配送プラン（月1回・2週間に1回・週1回）
- 次回配送日の自動計算
- 配送履歴管理
- スキップ・変更機能

#### 💾 複雑なステート管理
- 診断結果の永続化
- ユーザープロファイル管理
- サブスクリプション状態追跡
- 推奨商品キャッシング

## 技術スタック

### フロントエンド
- **React 18** - UIフレームワーク
- **Lucide React** - アイコンライブラリ
- **CSS3** - レスポンシブデザイン

### バックエンド
- **Node.js + Express** - APIサーバー
- **SQLite3** - データベース
- **JWT** - 認証
- **bcrypt** - パスワード暗号化

### デプロイメント
- **GitHub Pages** - フロントエンド公開

## ディレクトリ構造

```
sample_app/
├── src/
│   ├── App.js                 # メインアプリケーション
│   ├── styles/
│   │   └── main.css          # グローバルスタイル
│   ├── components/            # Reactコンポーネント（拡張用）
│   └── utils/                 # ユーティリティ関数
├── server/
│   └── server.js             # Express APIサーバー
├── database/
│   ├── schema.sql            # データベーススキーマ
│   ├── seed.sql              # 初期データ
│   └── app.db                # SQLiteデータベース
├── public/
│   └── index.html            # HTMLエントリーポイント
├── package.json              # 依存関係定義
└── README.md                 # このファイル
```

## セットアップ手順

### 1. 環境構築

```bash
# プロジェクトディレクトリに移動
cd sample_app

# 依存関係をインストール
npm install
```

### 2. データベース初期化

```bash
# Python を使用（推奨・最も簡単）
python init_db.py

# または Windows バッチスクリプト
init_db.bat

# または手動で sqlite3 CLI を使用
sqlite3 database/app.db ".read database/schema.sql"
sqlite3 database/app.db ".read database/seed.sql"
```

### 3. バックエンドサーバー起動

```bash
npm start
# またはホットリロード開発モード
npm run dev
```

バックエンドは `http://localhost:5000` で起動します。

### 4. フロントエンド開発サーバー起動（別ターミナル）

```bash
npm run react-start
```

フロントエンドは `http://localhost:3000` で起動します。

## API仕様

### 認証エンドポイント

#### ユーザー登録
```
POST /api/users/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

#### ログイン
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": { "id": 1, "username": "user123", "email": "user@example.com" }
}
```

### カテゴリ取得
```
GET /api/categories

Response:
[
  {
    "id": 1,
    "name": "コーヒー豆",
    "description": "世界中のこだわりコーヒー豆を毎月お届け",
    "icon": "coffee"
  },
  ...
]
```

### 診断結果
```
POST /api/diagnostic-results
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": 1,
  "answers": { "roast": "light", "flavor": "fruity", ... },
  "preferences": { "roast": "light", "flavor": "fruity", ... },
  "score": 100
}
```

### サブスクリプション作成
```
POST /api/subscriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": 1,
  "plan": "basic",
  "frequency": 30
}
```

### サブスクリプション一覧取得
```
GET /api/subscriptions/{userId}
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "user_id": 1,
    "category_id": 1,
    "category_name": "コーヒー豆",
    "plan": "basic",
    "frequency": 30,
    "next_delivery_date": "2026-02-18",
    "status": "active",
    "created_at": "2026-01-19T00:00:00.000Z"
  },
  ...
]
```

### 推奨商品生成
```
POST /api/recommendations/{userId}/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": 1
}
```

### 推奨商品取得
```
GET /api/recommendations/{userId}
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "product_name": "エチオピア イルガチェフェ",
    "price": 2800,
    "description": "フルーティーで酸味が特徴のシングルオリジン",
    "image_url": "/images/coffee1.jpg",
    "score": 3.5,
    "reason": "タグマッチング"
  },
  ...
]
```

## データベーススキーマ

### users テーブル
ユーザー基本情報を管理

### categories テーブル
商品カテゴリを管理

### products テーブル
各カテゴリの商品情報

### diagnostic_results テーブル
ユーザーの診断結果とスコアを保存

### user_profiles テーブル
ユーザーのプロフィール情報

### subscriptions テーブル
アクティブなサブスクリプション管理
- next_delivery_date: 次回配送日を自動計算

### delivery_history テーブル
過去の配送履歴を記録

### recommendations テーブル
AIによる推奨商品リスト

## 機能詳細

### AI診断クイズ
- カテゴリごとに異なる質問セット
- 複数の軸（好み・利用パターン等）から分析
- 各回答に対して推奨スコアを計算

### スケジューリング概念
```javascript
// 配送日の計算ロジック例
next_delivery_date = today + frequency (days)

// プラン別
- basic: 30日ごと
- premium: 14日ごと
- deluxe: 7日ごと
```

### 推奨アルゴリズム
- タグマッチング：ユーザーの好みと商品属性をマッチング
- スコア計算：一致度に基づいてランキング
- ランダム要素：毎回異なる商品提案を実現

## 認証フロー

1. ユーザーが新規登録またはログイン
2. JWTトークン取得
3. 以後のAPI呼び出しで `Authorization: Bearer {token}` ヘッダーを使用
4. トークンは localStorage に保存（自動復元）

## GitHub Pages デプロイ

### 本番ビルド

```bash
# React アプリをビルド
npm run build

# ビルト後のファイルをGitHub Pagesにデプロイ
# package.json に "homepage": "https://{username}.github.io/{repo}" を追加
```

### 環境変数設定

本番環境では、APIサーバーのURLを環境変数で管理：

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## 今後の拡張機能

### Phase 2
- [ ] 支払い決済機能（Stripe連携）
- [ ] メール通知システム
- [ ] ユーザーレビュー・評価機能
- [ ] サブスク管理のブラウザ拡張機能

### Phase 3
- [ ] 高度なML推奨エンジン
- [ ] ソーシャル機能（シェア・ギフト）
- [ ] モバイルアプリ（React Native）
- [ ] 複数言語対応

## トラブルシューティング

### データベース接続エラー
```bash
# データベースをリセット
rm database/app.db
sqlite3 database/app.db < database/schema.sql
sqlite3 database/app.db < database/seed.sql
npm start
```

### CORSエラー
- バックエンドサーバーが起動しているか確認
- フロントエンドの API_URL が正しいか確認

### Token期限切れ
- localStorage から古いトークンを削除
- ログインし直す

## ライセンス

MIT License

## 作成者

サブスクリプションプラットフォーム開発チーム
# template
