// アンケート機能用スクリプト

document.addEventListener('DOMContentLoaded', () => {
    // 設定: PHPサーバーのURL（環境に合わせて変更してください）
    // http://localhost:8000/server/PHP などを指定
    const API_BASE_URL = 'https://votes-api.xn--28j6b1bl.com';

    const btnDog = document.querySelector('button[data-vote="dog"]');
    const btnCat = document.querySelector('button[data-vote="cat"]');
    const countDog = document.getElementById('count-dog');
    const countCat = document.getElementById('count-cat');
    const barDog = document.getElementById('bar-dog');
    const barCat = document.getElementById('bar-cat');
    const messageArea = document.getElementById('poll-message');

    // 初期データ取得
    fetchVotes();

    // 投票ボタンイベント
    if (btnDog) {
        btnDog.addEventListener('click', () => castVote('dog'));
    }
    if (btnCat) {
        btnCat.addEventListener('click', () => castVote('cat'));
    }

    // 投票データを取得して表示更新
    function fetchVotes() {
        console.log('Fetching votes from:', `${API_BASE_URL}/get_votes.php`);
        fetch(`${API_BASE_URL}/get_votes.php`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateDisplay(data);
            })
            .catch(error => {
                console.error('Error fetching votes:', error);
                messageArea.textContent = 'データの取得に失敗しました。';
            });
    }

    // 投票処理
    function castVote(option) {
        // 二重送信防止
        disableButtons();

        fetch(`${API_BASE_URL}/vote.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vote_option: option })
        })
            .then(async response => {
                const data = await response.json();

                if (response.ok) {
                    messageArea.textContent = '投票ありがとう！';
                    messageArea.style.color = 'green';
                    fetchVotes(); // 更新されたデータを再取得
                } else {
                    // エラー（既に投票済みなど）
                    messageArea.textContent = data.error || '投票に失敗しました。';
                    messageArea.style.color = '#d9534f';
                    enableButtons(); // 失敗時は再試行可能に

                    // 既に投票済みエラーの場合はボタンを無効のままにする
                    if (response.status === 403) {
                        disableButtons();
                    }
                }
            })
            .catch(error => {
                console.error('Error casting vote:', error);
                messageArea.textContent = '通信エラーが発生しました。';
                enableButtons();
            });
    }

    // 表示更新ロジック
    function updateDisplay(data) {
        const dog = parseInt(data.dog) || 0;
        const cat = parseInt(data.cat) || 0;
        const total = dog + cat;

        // 数値更新
        countDog.textContent = dog;
        countCat.textContent = cat;

        // グラフ更新 (高さの割合計算)
        // 合計が0の場合は50%ずつにする
        let dogPercent = 50;
        let catPercent = 50;

        if (total > 0) {
            dogPercent = (dog / total) * 100;
            catPercent = (cat / total) * 100;
        }

        barDog.style.height = `${dogPercent}%`;
        barCat.style.height = `${catPercent}%`;
    }

    function disableButtons() {
        btnDog.disabled = true;
        btnCat.disabled = true;
    }

    function enableButtons() {
        btnDog.disabled = false;
        btnCat.disabled = false;
    }
});
