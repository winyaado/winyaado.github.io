<?php
// データベース設定
// 環境に合わせて変更してください
define('DB_HOST', 'localhost');
define('DB_NAME', 'poll_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// IPハッシュ化用のソルト（秘密鍵）
// 本番環境では推測されにくいランダムな文字列に変更してください
define('IP_SALT', 'c4t_vs_d0g_P0ll_S3cret_K3y_2026');

// エラー設定 (開発中は表示、本番ではログ出力のみにするなど適宜調整)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// データベース接続関数
function get_db_connection()
{
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // セキュリティのため、詳細なエラーは出さず、500エラーのみを返す
        http_response_code(500);
        die(json_encode(['error' => 'Database connection failed']));
    }
}
?>