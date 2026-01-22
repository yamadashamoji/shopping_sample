const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public')));

// データベース初期化
const db = new sqlite3.Database('./database/app.db', (err) => {
  if (err) {
    console.error('データベース接続エラー:', err);
  } else {
    console.log('データベースに接続しました');
  }
});

// ユーティリティ関数
const promisifyDb = (fn) => {
  return new Promise((resolve, reject) => {
    fn((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

// JWT認証ミドルウェア
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.split(' ')[1] : undefined;
  if (!token) return res.status(401).json({ error: '認証が必要です' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'トークンが無効です' });
    req.user = user;
    next();
  });
};

// ========== ユーザー関連API ==========

// ユーザー登録
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: '必須フィールドが不足しています' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // プロフィール初期化
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO user_profiles (user_id) VALUES (?)',
        [result],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(201).json({ message: 'ユーザー登録が完了しました', userId: result });
  } catch (error) {
    console.error('登録エラー:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'このユーザー名またはメールは既に登録されています' });
    } else {
      res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
  }
});

// ユーザーログイン
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードが必要です' });
    }

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '30d' });

    res.json({ 
      message: 'ログインに成功しました',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザー情報取得
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [req.params.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ========== カテゴリAPI ==========

// カテゴリ一覧取得
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ========== 診断結果API ==========

// 診断結果を保存
app.post('/api/diagnostic-results', authenticateToken, async (req, res) => {
  try {
    const { categoryId, answers, preferences, score } = req.body;

    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO diagnostic_results (user_id, category_id, answers, preferences, score)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, categoryId, JSON.stringify(answers), JSON.stringify(preferences), score],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // ユーザープロファイルを更新
    if (!preferences.favorite) {
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE user_profiles SET favorite_category_id = ?, preferences = ? WHERE user_id = ?',
          [categoryId, JSON.stringify(preferences), req.user.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    res.status(201).json({ message: '診断結果を保存しました', resultId: result });
  } catch (error) {
    console.error('診断保存エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザーの診断結果取得
app.get('/api/diagnostic-results/:userId/:categoryId', authenticateToken, async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM diagnostic_results 
         WHERE user_id = ? AND category_id = ? 
         ORDER BY created_at DESC LIMIT 1`,
        [req.params.userId, req.params.categoryId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!result) {
      return res.status(404).json({ error: '診断結果が見つかりません' });
    }

    res.json({
      ...result,
      answers: JSON.parse(result.answers),
      preferences: JSON.parse(result.preferences)
    });
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ========== サブスクリプションAPI ==========

// サブスクリプション作成
app.post('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { categoryId, plan, frequency } = req.body;

    if (!categoryId || !plan || !frequency) {
      return res.status(400).json({ error: '必須フィールドが不足しています' });
    }

    // 次回配送日を計算
    const nextDeliveryDate = new Date();
    nextDeliveryDate.setDate(nextDeliveryDate.getDate() + frequency);

    const subscriptionId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO subscriptions (user_id, category_id, plan, frequency, next_delivery_date, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [req.user.id, categoryId, plan, frequency, nextDeliveryDate.toISOString().split('T')[0]],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    res.status(201).json({ message: 'サブスクリプションを作成しました', subscriptionId });
  } catch (error) {
    console.error('サブスク作成エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザーのサブスクリプション一覧取得
app.get('/api/subscriptions/:userId', authenticateToken, async (req, res) => {
  try {
    const subscriptions = await new Promise((resolve, reject) => {
      db.all(
        `SELECT s.*, c.name as category_name FROM subscriptions s
         LEFT JOIN categories c ON s.category_id = c.id
         WHERE s.user_id = ? ORDER BY s.created_at DESC`,
        [req.params.userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ========== 推奨商品API ==========

// ユーザーへの推奨商品取得
app.get('/api/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    const recommendations = await new Promise((resolve, reject) => {
      db.all(
        `SELECT r.*, p.name as product_name, p.price, p.description, p.image_url
         FROM recommendations r
         LEFT JOIN products p ON r.product_id = p.id
         WHERE r.user_id = ?
         ORDER BY r.score DESC
         LIMIT 10`,
        [req.params.userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 推奨商品を生成（AI的な分析）
app.post('/api/recommendations/:userId/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { categoryId } = req.body;

    // ユーザーの診断結果を取得
    const diagnosticResult = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM diagnostic_results 
         WHERE user_id = ? AND category_id = ? 
         ORDER BY created_at DESC LIMIT 1`,
        [userId, categoryId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!diagnosticResult) {
      return res.status(404).json({ error: '診断結果が見つかりません' });
    }

    const preferences = JSON.parse(diagnosticResult.preferences);
    const tags = Object.values(preferences).filter(v => typeof v === 'string');

    // 該当する商品を取得して推奨スコアを計算
    const products = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM products WHERE category_id = ? LIMIT 20`,
        [categoryId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // 既存の推奨を削除
    await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM recommendations WHERE user_id = ? AND product_id IN 
         (SELECT id FROM products WHERE category_id = ?)`,
        [userId, categoryId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // 新しい推奨を作成
    for (const product of products) {
      const productTags = (product.tags || '').split(',');
      let score = 0;

      // タグマッチングでスコア計算
      for (const tag of productTags) {
        if (tags.includes(tag.trim())) {
          score += 1;
        }
      }

      score += Math.random() * 2; // ランダム性を追加

      if (score > 0) {
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO recommendations (user_id, product_id, score, reason)
             VALUES (?, ?, ?, 'タグマッチング')`,
            [userId, product.id, score],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }
    }

    res.json({ message: '推奨商品を生成しました' });
  } catch (error) {
    console.error('推奨生成エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ========== 配送履歴API ==========

// 配送履歴取得
app.get('/api/delivery-history/:subscriptionId', authenticateToken, async (req, res) => {
  try {
    const history = await new Promise((resolve, reject) => {
      db.all(
        `SELECT dh.*, p.name as product_name, p.image_url
         FROM delivery_history dh
         LEFT JOIN products p ON dh.product_id = p.id
         WHERE dh.subscription_id = ?
         ORDER BY dh.created_at DESC`,
        [req.params.subscriptionId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ========== ヘルスチェック ==========

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ========== エラーハンドリング ==========

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

// ========== サーバー起動 ==========

app.listen(PORT, () => {
  console.log(`サーバーが起動しました。ポート: ${PORT}`);
});

module.exports = app;
