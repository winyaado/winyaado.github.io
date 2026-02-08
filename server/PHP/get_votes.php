<?php
require_once 'config.php';

// CORS設定
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// GETリクエストのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

try {
    $pdo = get_db_connection();

    // 投票数を集計
    // GROUP BY を使って一度に取得することも可能だが、
    // ここでは単純化してそれぞれのカウントを取得するアプローチをとる
    // (データ量が多くない前提)

    // 方法1: SUM(CASE...) を使う（1クエリで完了）
    $sql = "SELECT 
                SUM(CASE WHEN vote_option = 'dog' THEN 1 ELSE 0 END) as dog_count,
                SUM(CASE WHEN vote_option = 'cat' THEN 1 ELSE 0 END) as cat_count
            FROM votes";

    $stmt = $pdo->query($sql);
    $result = $stmt->fetch();

    $dog_count = $result['dog_count'] ? (int) $result['dog_count'] : 0;
    $cat_count = $result['cat_count'] ? (int) $result['cat_count'] : 0;
    $total_votes = $dog_count + $cat_count;

    echo json_encode([
        'dog' => $dog_count,
        'cat' => $cat_count,
        'total' => $total_votes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error']);
}
?>