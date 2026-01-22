import React, { useState, useEffect } from 'react';
import './styles/main.css';

const OmakaseApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        fetchSubscriptions();
      } catch (err) {
        console.error('Token error:', err);
        setToken(null);
      }
    }
  }, [token]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setLoginData({ email: '', password: '' });
        setCurrentPage('home');
      } else {
        const data = await response.json();
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (err) {
      setError('エラー: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      if (response.ok) {
        setRegisterData({ username: '', email: '', password: '' });
        setCurrentPage('login');
        alert('登録が完了しました。ログインしてください。');
      } else {
        const data = await response.json();
        setError(data.error || '登録に失敗しました');
      }
    } catch (err) {
      setError('エラー: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setCurrentPage('home');
  };

  if (!token) {
    if (currentPage === 'register') {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h2>新規会員登録</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleRegister}>
              <input
                style={styles.input}
                type="text"
                placeholder="ユーザー名"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="email"
                placeholder="メールアドレス"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="password"
                placeholder="パスワード"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? '登録中...' : '登録'}
              </button>
            </form>
            <p>
              既にアカウントをお持ちですか？
              <button onClick={() => setCurrentPage('login')} style={styles.link}>ログイン</button>
            </p>
          </div>
        </div>
      );
    }

    if (currentPage === 'login') {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h2>ログイン</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                style={styles.input}
                type="email"
                placeholder="メールアドレス"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
              <input
                style={styles.input}
                type="password"
                placeholder="パスワード"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
            <p>
              アカウントをお持ちでない方？
              <button onClick={() => setCurrentPage('register')} style={styles.link}>登録</button>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.app}>
        <header style={styles.header}>
          <h1>🎁 おまかせ定期便</h1>
          <p>あなたの好みを分析して、毎月おすすめをお届けします</p>
        </header>
        <main style={styles.main}>
          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.icon}>☕</div>
              <h3>多様なカテゴリ</h3>
              <p>様々なカテゴリから選択できます</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.icon}>⭐</div>
              <h3>AI診断クイズ</h3>
              <p>あなたの好みを分析しておすすめ</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.icon}>📅</div>
              <h3>定期配送</h3>
              <p>配送頻度を選べます</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.icon}>📦</div>
              <h3>スケジュール管理</h3>
              <p>配送日を確認・管理できます</p>
            </div>
          </div>
          <div style={styles.buttons}>
            <button onClick={() => setCurrentPage('login')} style={styles.buttonPrimary}>
              ログイン
            </button>
            <button onClick={() => setCurrentPage('register')} style={styles.buttonSecondary}>
              新規登録
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🎁 おまかせ定期便</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setCurrentPage('home')} style={styles.navBtn}>
              🏠
            </button>
            <button onClick={() => setCurrentPage('subscriptions')} style={styles.navBtn}>
              📦
            </button>
            <button onClick={handleLogout} style={styles.navBtn}>
              🚪
            </button>
          </div>
        </div>
      </header>

      {error && <p style={styles.error}>{error}</p>}

      <main style={styles.main}>
        {currentPage === 'home' && (
          <div>
            <h2>ようこそ！{user?.email || 'ユーザー'}</h2>
            {subscriptions.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px' }}>📦 サブスクリプションがまだありません</p>
            ) : (
              <div>
                <h3>あなたのサブスクリプション</h3>
                {subscriptions.map((sub) => (
                  <div key={sub.id} style={styles.card}>
                    <h4>{sub.category_name}</h4>
                    <p>プラン: {sub.plan}</p>
                    <p>次回配送: {new Date(sub.next_delivery_date).toLocaleDateString('ja-JP')}</p>
                    <p>ステータス: {sub.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'subscriptions' && (
          <div>
            <h2>📦 サブスクリプション管理</h2>
            {subscriptions.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px' }}>サブスクリプションがありません</p>
            ) : (
              subscriptions.map((sub) => (
                <div key={sub.id} style={styles.card}>
                  <h3>{sub.category_name}</h3>
                  <p><strong>プラン:</strong> {sub.plan}</p>
                  <p><strong>次回配送:</strong> {new Date(sub.next_delivery_date).toLocaleDateString('ja-JP')}</p>
                  <p><strong>ステータス:</strong> {sub.status}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px 40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  navBtn: {
    fontSize: '24px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '0 20px',
  },
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  feature: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  buttons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  buttonPrimary: {
    background: '#667eea',
    color: 'white',
    padding: '12px 40px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  buttonSecondary: {
    background: 'white',
    color: '#667eea',
    padding: '12px 40px',
    border: '2px solid #667eea',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 15px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px 15px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    marginLeft: '5px',
    textDecoration: 'underline',
  },
  error: {
    background: '#fee',
    color: '#c00',
    padding: '10px 15px',
    borderRadius: '4px',
    marginBottom: '15px',
  },
};

export default OmakaseApp;
