(function () {
  var input = document.getElementById('local-search-input');
  var resultContainer = document.getElementById('local-search-result');

  if (!input) return;

  var data = [];
  var xhr = new XMLHttpRequest();
  // Hexo root を反映した絶対パス
  xhr.open('GET', (window.ROOT_PATH || '/') + 'search.xml', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var parser = new DOMParser();
        var xml = parser.parseFromString(xhr.responseText, 'text/xml');
        var entries = xml.getElementsByTagName('entry');
        for (var i = 0; i < entries.length; i++) {
          data.push({
            title: entries[i].getElementsByTagName('title')[0].textContent,
            content: entries[i].getElementsByTagName('content')[0].textContent,
            url: entries[i].getElementsByTagName('url')[0].textContent
          });
        }
      } else {
        console.error('search.xml の読み込みに失敗しました', xhr.status);
      }
    }
  };
  xhr.send(null);

  input.addEventListener('input', function () {
    var str = this.value.trim().toLowerCase();
    var resultHTML = '';
    if (str.length > 0) {
      data.forEach(function (post) {
        if (post.title.toLowerCase().includes(str) || post.content.toLowerCase().includes(str)) {
          // 本文の一部を抜粋（50文字まで）
          var snippet = post.content.replace(/<[^>]+>/g, ''); // HTMLタグ除去
          if (snippet.length > 50) snippet = snippet.slice(0, 50) + '…';
          resultHTML += `
            <a href="${post.url}" class="search-result-item">
              <p class="search-result-title">${post.title}</p>
              <p class="search-result-snippet">${snippet}</p>
            </a>
          `;
        }
      });
      if (resultHTML === '') {
        resultHTML = '<div class="search-no-result">検索結果がありません</div>';
      }
    }else{
      resultHTML = '';
    }
    resultContainer.innerHTML = resultHTML;
  });

})();
