/**
 * ユーティリティ関数: CSV/JSON データのエクスポート
 */

export const exportSubscriptionsAsCSV = (subscriptions, filename = 'subscriptions.csv') => {
  const headers = ['ID', 'カテゴリ', 'プラン', '配送間隔', '次回配送日', 'ステータス', '作成日'];
  const rows = subscriptions.map(sub => [
    sub.id,
    sub.category_name,
    sub.plan,
    `${sub.frequency}日ごと`,
    sub.next_delivery_date,
    sub.status,
    new Date(sub.created_at).toLocaleDateString('ja-JP')
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
};

export const exportDiagnosticResultsAsJSON = (result, filename = 'diagnostic-result.json') => {
  const jsonStr = JSON.stringify(result, null, 2);
  downloadFile(jsonStr, filename, 'application/json;charset=utf-8;');
};

export const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * バックアップ機能: ローカルストレージ
 */
export const backupUserData = (userData) => {
  const backup = {
    timestamp: new Date().toISOString(),
    data: userData
  };
  localStorage.setItem('omakase_backup', JSON.stringify(backup));
};

export const restoreUserData = () => {
  const backup = localStorage.getItem('omakase_backup');
  return backup ? JSON.parse(backup) : null;
};

/**
 * スケジューラー：配送日計算
 */
export const calculateDeliverySchedule = (startDate, frequency, count = 12) => {
  const schedule = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    schedule.push({
      deliveryNumber: i + 1,
      date: new Date(currentDate),
      timestamp: currentDate.toISOString()
    });
    currentDate.setDate(currentDate.getDate() + frequency);
  }

  return schedule;
};

/**
 * 推奨スコア計算ロジック（AI的な分析）
 */
export const calculateRecommendationScore = (userPreferences, productTags) => {
  let score = 0;
  const userTagsArray = Object.values(userPreferences).filter(v => typeof v === 'string');
  const productTagsArray = productTags.split(',').map(t => t.trim());

  // 完全マッチ
  userTagsArray.forEach(userTag => {
    if (productTagsArray.includes(userTag)) {
      score += 3;
    }
  });

  // 部分マッチ（最初の2文字）
  userTagsArray.forEach(userTag => {
    productTagsArray.forEach(productTag => {
      if (productTag.includes(userTag) || userTag.includes(productTag)) {
        score += 1;
      }
    });
  });

  // ランダム因子（多様性）
  score += Math.random() * 2;

  return Math.round(score * 100) / 100;
};

/**
 * 診断結果のテキスト化
 */
export const generateDiagnosticReport = (diagnosticResult, categoryName) => {
  const lines = [
    `【${categoryName} 診断結果】`,
    `診断日時: ${diagnosticResult.timestamp}`,
    `マッチスコア: ${diagnosticResult.score}%`,
    '',
    '【あなたの好み】'
  ];

  Object.entries(diagnosticResult.preferences).forEach(([key, value]) => {
    lines.push(`・${key}: ${value}`);
  });

  return lines.join('\n');
};

/**
 * 価格計算（配送頻度・容量別）
 */
export const calculateMonthlyPrice = (basePrice, plan) => {
  const planMultiplier = {
    'basic': 1,
    'premium': 1.8,
    'deluxe': 2.5
  };
  return Math.round(basePrice * (planMultiplier[plan] || 1) * 100) / 100;
};

/**
 * ユーザープロフィール統計
 */
export const calculateUserStats = (subscriptions, diagnosticResults) => {
  return {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    totalDiagnosisAttempts: diagnosticResults.length,
    averageScore: diagnosticResults.length > 0
      ? Math.round(diagnosticResults.reduce((sum, r) => sum + r.score, 0) / diagnosticResults.length)
      : 0
  };
};
