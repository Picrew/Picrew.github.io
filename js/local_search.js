// Local search for the generated search.xml index.
(function () {
  'use strict';

  var state = {
    path: '',
    loading: false,
    ready: false,
    data: []
  };

  var messages = {
    zh: {
      loading: '正在加载搜索索引...',
      ready: '输入关键词开始搜索。',
      empty: '没有找到内容，请尝试更换检索词。',
      failed: '搜索索引加载失败，请刷新后重试。'
    },
    en: {
      loading: 'Loading search index...',
      ready: 'Type keywords to search.',
      empty: 'No results. Try different keywords.',
      failed: 'Search index failed to load. Please refresh and try again.'
    }
  };

  function currentLang() {
    return document.documentElement.getAttribute('data-ui-lang') === 'zh' ? 'zh' : 'en';
  }

  function t(key) {
    return messages[currentLang()][key] || messages.en[key] || '';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function setStatus(resultEl, key) {
    if (!resultEl) return;
    resultEl.innerHTML = '<ul><span class="local-search-empty">' + escapeHtml(t(key)) + '</span></ul>';
  }

  function parseIndex(xmlResponse) {
    return $('entry', xmlResponse).map(function () {
      return {
        title: $('title', this).text(),
        content: $('content', this).text(),
        url: $('url', this).text()
      };
    }).get();
  }

  function renderResults(inputEl, resultEl) {
    var query = inputEl.value.trim().toLowerCase();
    var keywords = query.split(/[\s\-]+/).filter(Boolean);

    resultEl.innerHTML = '';
    if (!keywords.length) {
      setStatus(resultEl, state.ready ? 'ready' : 'loading');
      return;
    }

    var html = '<ul class="search-result-list">';
    var hasResult = false;

    state.data.forEach(function (data) {
      var title = (data.title || 'Untitled').trim();
      var content = (data.content || '').trim().replace(/<[^>]+>/g, '');
      var lowerTitle = title.toLowerCase();
      var lowerContent = content.toLowerCase();
      var firstOccur = -1;
      var isMatch = keywords.every(function (keyword, index) {
        var titleIndex = lowerTitle.indexOf(keyword);
        var contentIndex = lowerContent.indexOf(keyword);

        if (titleIndex < 0 && contentIndex < 0) {
          return false;
        }
        if (index === 0) {
          firstOccur = contentIndex >= 0 ? contentIndex : 0;
        }
        return true;
      });

      if (!isMatch) return;

      hasResult = true;
      html += '<li><a href="' + escapeHtml(data.url) + '" class="search-result-title color-primary">' + escapeHtml(title) + '</a>';

      if (content) {
        var start = Math.max(firstOccur - 20, 0);
        var end = Math.min(firstOccur + 90, content.length);
        var snippet = content.substring(start, end || 120);

        keywords.forEach(function (keyword) {
          snippet = snippet.replace(new RegExp(escapeRegExp(keyword), 'gi'), function (match) {
            return '<span class="search-keyword">' + escapeHtml(match) + '</span>';
          });
        });

        html += '<p class="search-result">' + snippet + '...</p>';
      }
      html += '</li>';
    });

    html += '</ul>';

    if (!hasResult) {
      setStatus(resultEl, 'empty');
      return;
    }

    resultEl.innerHTML = html;
    window.pjax && window.pjax.refresh(resultEl);
  }

  function bindInput(inputEl, resultEl) {
    if (inputEl.__localSearchBound) return;
    inputEl.__localSearchBound = true;
    inputEl.addEventListener('input', function () {
      if (!state.ready) {
        setStatus(resultEl, state.loading ? 'loading' : 'failed');
        return;
      }
      renderResults(inputEl, resultEl);
    });
  }

  window.searchFunc = function (path, searchId, contentId) {
    var inputEl = document.getElementById(searchId);
    var resultEl = document.getElementById(contentId);

    if (!inputEl || !resultEl) return;
    bindInput(inputEl, resultEl);

    if (state.ready && state.path === path) {
      renderResults(inputEl, resultEl);
      return;
    }

    if (state.loading) {
      setStatus(resultEl, 'loading');
      return;
    }

    state.path = path;
    state.loading = true;
    state.ready = false;
    setStatus(resultEl, 'loading');

    $.ajax({
      url: path,
      dataType: 'xml',
      cache: true,
      success: function (xmlResponse) {
        state.data = parseIndex(xmlResponse);
        state.loading = false;
        state.ready = true;
        renderResults(inputEl, resultEl);
      },
      error: function () {
        state.loading = false;
        state.ready = false;
        setStatus(resultEl, 'failed');
      }
    });
  };

  window.getSearchFile = function (path) {
    window.searchFunc(path, 'local-search-input', 'local-search-result');
  };
})();
