'use strict';
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assessment');
const resultDivision = document.getElementById('result-area');
const tweetDivision = document.getElementById('tweet-area');

assessmentButton.addEventListener(
  'click',
  () => {
    const userName = userNameInput.value;
    if (userName.length === 0) {
      // 名前が空の時は処理を終了する
      return;
    }

    // 診断結果表示エリアの作成
    resultDivision.innerText = '';
    const header = document.createElement('h3');
    header.innerText = '診断結果';
    resultDivision.appendChild(header);

    const paragraph = document.createElement('p');
    const result = assessment(userName);
    paragraph.innerText = result;
    resultDivision.appendChild(paragraph);

    // ツイートエリアの作成
    tweetDivision.innerText = '';
    const anchor = document.createElement('a');
    const hrefValue =
      'https://twitter.com/intent/tweet?button_hashtag=' +
      encodeURIComponent('あなたの今日の運勢') +
      '&ref_src=twsrc%5Etfw';
  
    anchor.setAttribute('href', hrefValue);
    anchor.setAttribute('class', 'twitter-hashtag-button');
    anchor.setAttribute('data-text', result);
    anchor.innerText = 'Tweet #あなたの今日の運勢';
  
    tweetDivision.appendChild(anchor);


    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivision.appendChild(script);
  }
);

userNameInput.addEventListener(
  'keydown',
  event => {
    if(event.code === 'Enter') {
      assessmentButton.dispatchEvent(new Event('click'))
    }
  }
)

const fortunes = [
  '大吉',
  '中吉',
  '小吉',
  '吉',
  '末吉',
  '凶',
  '大凶'
];

const luckyItems = [
  'ラッキーアイテムは「カギ」です。',
  'ラッキーアイテムは「ハンカチ」です。',
  'ラッキーアイテムは「スマートフォン」です。',
  'ラッキーアイテムは「腕時計」です。',
  'ラッキーアイテムは「メガネ」です。',
  'ラッキーアイテムは「ボールペン」です。',
  'ラッキーアイテムは「手帳」です。',
  'ラッキーアイテムは「イヤホン」です。',
  'ラッキーアイテムは「お財布」です。',
  'ラッキーアイテムは「鏡」です。'
];

/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param {string} userName ユーザの名前
 * @return {string} 診断結果
 */
function assessment(userName) {
  const date = new Date();
  const dateStr = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();

  // 名前の全ての文字コードを足す
  let sumOfCharCode = 0;
  for (let i = 0; i < userName.length; i++) {
    sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);
  }

  // 運勢の計算
  const fortuneIndex = (sumOfCharCode + parseInt(dateStr)) % fortunes.length;
  const fortune = fortunes[fortuneIndex];

  // ラッキーアイテムの計算
  const luckyItemIndex = (sumOfCharCode + parseInt(dateStr) + parseInt(dateStr)) % luckyItems.length;
  const luckyItem = luckyItems[luckyItemIndex];

  return `${date.toLocaleDateString('ja-JP')}のあなたの運勢は「${fortune}」です。${luckyItem}`;
}
