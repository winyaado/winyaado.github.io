<?php
require_once 'config.php';

// CORS設定 (必要に応じて特定のドメインのみ許可するなど制限を強めてください)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// プリフライト
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// POSTリクエストのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// 入力データの取得
$data = json_decode(file_get_contents("php://input"), true);
$vote_option = isset($data['vote_option']) ? $data['vote_option'] : '';

// 入力値検証 (犬か猫のみ許可)
if ($vote_option !== 'dog' && $vote_option !== 'cat') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid vote option']);
    exit;
}

// IPアドレスの取得とハッシュ化
$ip = $_SERVER['REMOTE_ADDR'];
$ip_hash = hash('sha256', $ip . IP_SALT);

try {
    $pdo = get_db_connection();

    // 本日の投票済みチェック
    // SQLiteの場合は DATE('now', 'localtime')
    // MySQLの場合は CURDATE() または DATE(created_at) = CURDATE()
    // 汎用的にPHPで今日の日付範囲を指定して検索する方法もあるが、ここではMySQL関数を使用
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM votes WHERE ip_hash = ? AND DATE(created_at) = CURDATE()");
    $stmt->execute([$ip_hash]);
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        // すでに投票済みの場合
        http_response_code(403);
        echo json_encode(['error' => '投票は1日1回までです']);
        exit;
    }

    // 投票を保存
    $stmt = $pdo->prepare("INSERT INTO votes (vote_option, ip_hash) VALUES (?, ?)");
    $stmt->execute([$vote_option, $ip_hash]);

    echo json_encode(['success' => true, 'message' => '投票ありがとう！']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error']);
}
?>