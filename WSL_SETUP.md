# WSL 環境セットアップガイド

## 📋 前提条件

- Windows 10/11 に WSL 2 がインストール済み
- Ubuntu ディストリビューションがセットアップ済み
- PowerShell 管理者権限

## ✅ 現在のセットアップ状態

```
WSL: Ubuntu (Running, Version 2)
データベース: 初期化済み
プロジェクト: Windows で動作確認済み
```

---

## 🚀 WSL 環境セットアップ手順

### ステップ 1: プロジェクトを WSL にセットアップ

**PowerShell で実行：**

```powershell
# WSL 内で setup-wsl.sh を実行
wsl bash ~/sample_app/setup-wsl.sh
```

このスクリプトが自動的に以下を実行します：
- ✅ パッケージマネージャー更新
- ✅ Node.js / npm インストール
- ✅ Python 3 インストール
- ✅ npm 依存関係インストール
- ✅ データベース初期化

---

### ステップ 2: バックエンドを起動（ターミナル 1）

```bash
# WSL に入る
wsl

# プロジェクトディレクトリに移動
cd ~/sample_app

# バックエンドサーバー起動
npm run start
```

期待される出力：
```
サーバーが起動しました。ポート: 5000
データベースに接続しました
```

---

### ステップ 3: フロントエンドを起動（ターミナル 2）

```bash
# WSL に入る
wsl

# プロジェクトディレクトリに移動
cd ~/sample_app

# React 開発サーバー起動
npm run react-start
```

期待される出力：
```
Compiled successfully!
You can now view omakase-subscription-app in the browser.
  Local:  http://localhost:3000
```

---

### ステップ 4: ブラウザでアクセス

```
http://localhost:3000
```

✅ アプリケーション起動！

---

## 📁 ファイル構成（WSL）

```
~/sample_app/
├── src/
│   ├── App.js              # メインコンポーネント
│   ├── index.js            # React エントリーポイント
│   ├── components/
│   ├── styles/
│   │   └── main.css
│   └── utils/
│       └── helpers.js
├── public/
│   ├── index.html          # HTML エントリーポイント
│   └── favicon.svg
├── server/
│   └── server.js           # Express バックエンド
├── database/
│   ├── schema.sql          # テーブル定義
│   ├── seed.sql            # 初期データ
│   └── omakase.db          # SQLite データベース
├── package.json
└── init_db.py              # DB 初期化スクリプト
```

---

## 🔧 トラブルシューティング

### ❌ エラー: WSL コマンドが見つからない

**解決：** WSL 2 を再インストール

```powershell
# 管理者権限で実行
wsl --install -d Ubuntu
```

### ❌ エラー: ポート 3000/5000 が使用中

```bash
# 既存プロセスをキル
sudo lsof -i :3000
sudo lsof -i :5000

# プロセスをキル（PID を確認後）
sudo kill -9 <PID>
```

### ❌ エラー: npm install 失敗

```bash
# キャッシュをクリア
npm cache clean --force

# 再度インストール
npm install --legacy-peer-deps
```

### ❌ エラー: データベースエラー

```bash
# データベースを再初期化
python3 init_db.py
```

---

## ⚡ 高速起動ワンライナー

### PowerShell から両方を起動

```powershell
# ターミナル 1: バックエンド
Start-Process wsl -ArgumentList "cd ~/sample_app && npm run start"

# ターミナル 2: フロントエンド
Start-Process wsl -ArgumentList "cd ~/sample_app && npm run react-start"

# ブラウザで http://localhost:3000 を開く
Start-Process "http://localhost:3000"
```

---

## 💡 WSL と Windows ファイル共有

### Windows から WSL ファイルにアクセス

```
\\wsl$\Ubuntu\home\<user>\sample_app
```

VS Code では自動的にアクセス可能です。

### WSL から Windows ファイルにアクセス

```bash
/mnt/c/Users/T20007/sample_app
```

---

## 🔄 Windows から WSL への切り替え方法

### オプション 1: PowerShell から WSL コマンド実行

```powershell
# 単一コマンド実行
wsl -- npm run start

# WSL シェルで実行
wsl bash -c "cd ~/sample_app && npm run react-start"
```

### オプション 2: WSL ターミナルで直接実行

```powershell
# WSL ターミナルを起動
wsl

# その後は Linux コマンド
cd ~/sample_app
npm run start
```

---

## 📊 パフォーマンス最適化（オプション）

### Windows ファイルシステムへのアクセス最適化

`.wslconfig` を `C:\Users\<username>\` に作成：

```ini
[interop]
appendWindowsPath = true

[wsl2]
memory = 2GB
processors = 4
swap = 1GB
```

---

## 🎯 推奨される開発環境

**VS Code での統合（推奨）**

```powershell
# VS Code を WSL で起動
code ~/sample_app
```

VS Code 拡張：
- Remote - WSL
- Remote - SSH
- ES7+ React/Redux/React-Native snippets

---

**🎉 これでフルな WSL 環境で開発できます！**
