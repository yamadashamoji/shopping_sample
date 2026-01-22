#!/usr/bin/env python3
"""
SQLite3 初期化スクリプト
database/schema.sql と database/seed.sql をデータベースに適用
"""

import sqlite3
import os
import sys

def init_database():
    db_path = 'database/app.db'
    schema_path = 'database/schema.sql'
    seed_path = 'database/seed.sql'
    
    try:
        # 既存DBを削除
        if os.path.exists(db_path):
            os.remove(db_path)
            print(f"✓ 既存データベースを削除: {db_path}")
        
        # DB接続
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        print(f"✓ 新しいデータベースを作成: {db_path}")
        
        # スキーマを実行
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
            cursor.executescript(schema_sql)
            conn.commit()
            print(f"✓ スキーマを適用: {schema_path}")
        
        # 初期データを実行
        with open(seed_path, 'r', encoding='utf-8') as f:
            seed_sql = f.read()
            cursor.executescript(seed_sql)
            conn.commit()
            print(f"✓ 初期データを挿入: {seed_path}")
        
        conn.close()
        print("\n✅ データベース初期化完了！")
        return True
        
    except Exception as e:
        print(f"\n❌ エラーが発生しました:")
        print(f"   {type(e).__name__}: {str(e)}")
        return False

if __name__ == '__main__':
    success = init_database()
    sys.exit(0 if success else 1)
