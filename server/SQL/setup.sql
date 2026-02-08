/* 
  投票システム用データベースセットアップ
  
  テーブル構造:
  - id: プライマリキー、自動インクリメント
  - vote_option: 投票内容 ('dog' または 'cat')
  - ip_hash: IPアドレスのハッシュ値 (SHA-256)
  - created_at: 投票日時 (デフォルト: 現在日時)

  備考:
  - ip_hash と created_at の日付部分の複合ユニーク制約は、アプリケーション側で制御するためここでは設定しないが、
    念のためインデックスを貼っておくことで検索速度を向上させる。
*/

CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vote_option ENUM('dog', 'cat') NOT NULL,
    ip_hash CHAR(64) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ip_date (ip_hash, created_at)
);
