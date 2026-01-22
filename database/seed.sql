-- カテゴリマスターデータ
INSERT INTO categories (name, description, icon) VALUES
('コーヒー豆', '世界中のこだわりコーヒー豆を毎月お届け', 'coffee'),
('靴下', '快適さとデザインを兼ね備えた靴下セレクション', 'socks'),
('スキンケア', 'あなたの肌タイプに合わせたスキンケアセット', 'skincare'),
('ティー', '希少な紅茶・烏龍茶・ハーブティーの詰め合わせ', 'tea'),
('チョコレート', ' 世界のクラフトチョコレート・精選品', 'chocolate');

-- コーヒー豆の商品例
INSERT INTO products (category_id, name, description, price, image_url, tags) VALUES
(1, 'エチオピア イルガチェフェ', 'フルーティーで酸味が特徴のシングルオリジン', 2800, '/images/coffee1.jpg', 'light,fruity,ethiopia'),
(1, 'ブラジル サントス', 'バランスの取れた味わい、ナッツの香り', 2400, '/images/coffee2.jpg', 'medium,nutty,brazil'),
(1, 'インドネシア マンデリン', '濃厚でコクのある深煎り', 2600, '/images/coffee3.jpg', 'dark,chocolate,indonesia'),
(1, 'コロンビア アラビカ', '香り高く、複雑な味わい', 2500, '/images/coffee4.jpg', 'medium,balanced,colombia');

-- 靴下の商品例
INSERT INTO products (category_id, name, description, price, image_url, tags) VALUES
(2, 'メリノウール 冬用靴下セット', '保温性と通気性を兼ね備えた', 1500, '/images/socks1.jpg', 'winter,wool,comfort'),
(2, '綿麻混 夏用靴下セット', '蒸れにくく快適な履き心地', 1200, '/images/socks2.jpg', 'summer,cotton,breathable'),
(2, 'リブ編み カジュアル靴下セット', '普段使いに最適な定番デザイン', 980, '/images/socks3.jpg', 'casual,versatile,daily');

-- スキンケアの商品例
INSERT INTO products (category_id, name, description, price, image_url, tags) VALUES
(3, 'オイリー肌セット', '皮脂コントロールに特化した3点セット', 3500, '/images/skincare1.jpg', 'oily,control,acne-prone'),
(3, '乾燥肌セット', '深い保湿を実現する4点セット', 4200, '/images/skincare2.jpg', 'dry,moisture,sensitive'),
(3, '敏感肌セット', '無添加・低刺激の5点セット', 4800, '/images/skincare3.jpg', 'sensitive,hypoallergenic,pure');

-- ティーの商品例
INSERT INTO products (category_id, name, description, price, image_url, tags) VALUES
(4, 'ダージリン 春摘み', 'マスカットフレーバーの最高級紅茶', 2200, '/images/tea1.jpg', 'black,spring,darjeeling'),
(4, '烏龍茶 高山茶', '香り高く、深い味わい', 2500, '/images/tea2.jpg', 'oolong,taiwanese,premium');

-- チョコレートの商品例
INSERT INTO products (category_id, name, description, price, image_url, tags) VALUES
(5, 'ベルギアンチョコレート アソート', '厳選されたボンボン詰め合わせ', 3200, '/images/chocolate1.jpg', 'belgian,premium,assorted'),
(5, 'ダークチョコレート 70% セット', 'カカオの深い味わい', 2800, '/images/chocolate2.jpg', 'dark,cacao,artisan');
