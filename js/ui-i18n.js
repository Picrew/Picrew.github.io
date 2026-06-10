(function () {
  'use strict';

  var STORAGE_KEY = 'jayden-blog-ui-lang-v2';
  var defaultLanguage = window.BLOG_UI_I18N_DEFAULT === 'en' ? 'en' : 'zh';

  var labels = {
    zh: {
      'menu.Home': '首页',
      'menu.Tags': '标签',
      'menu.Categories': '分类',
      'menu.Archives': '归档',
      'menu.About': '关于',
      'menu.Contact': '留言板',
      'menu.Friends': '友情链接',
      'toggleTo': 'Switch to English',
      'heroTitle': '欢迎来到 Jayden 个人博客',
      'mottoContent': '保持饥饿，保持愚蠢',
      'noticeTitle': '公告',
      'searchTitle': '本地搜索',
      'searchPlaceholder': '请输入关键字',
      'sideToc': '本文目录',
      'sideCategories': '文章分类',
      'sideTags': '热门标签',
      'sideRecentPosts': '最新文章',
      'sideArchives': '归档',
      'sideWebinfo': '站点信息',
      'webinfoArticles': '文章数目：',
      'webinfoRuntime': '已运行时间：',
      'webinfoWordcount': '本站总字数：',
      'webinfoVisitors': '本站访客数：',
      'webinfoViews': '本站总访问量：',
      'webinfoLastActivity': '最后活动时间：',
      'unitPosts': '篇',
      'unitDays': '天',
      'unitWords': '字',
      'unitPeople': '人',
      'unitViews': '次',
      'unitDate': '日',
      'recommendedArticles': '推荐文章',
      'readMore': '阅读更多',
      'prevPage': '上一页',
      'nextPage': '下一页',
      'lastArticleLabel': '上一篇:',
      'nextArticleLabel': '下一篇:',
      'articleCategories': '文章分类',
      'articleTags': '文章标签',
      'category': '分类',
      'tag': '标签',
      'categoryLabel': '分类：',
      'publishedInLabel': '发表于：',
      'wordcountLabel': '字数统计: ',
      'min2readLabel': '阅读时长: ',
      'readingLabel': '阅读量：',
      'unitMin': '分钟',
      'footerTotalVisitsLabel': '本站总访问量：',
      'footerVisitorsLabel': '本站访客数：'
    },
    en: {
      'menu.Home': 'Home',
      'menu.Tags': 'Tags',
      'menu.Categories': 'Categories',
      'menu.Archives': 'Archives',
      'menu.About': 'About',
      'menu.Contact': 'Contact',
      'menu.Friends': 'Friends',
      'toggleTo': '切换到中文',
      'heroTitle': "Welcome to Jayden's Blog",
      'mottoContent': 'Stay Hungry, Stay Foolish',
      'noticeTitle': 'Notice',
      'searchTitle': 'Local Search',
      'searchPlaceholder': 'Please enter keywords',
      'sideToc': 'Contents',
      'sideCategories': 'Categories',
      'sideTags': 'Popular Tags',
      'sideRecentPosts': 'Latest Posts',
      'sideArchives': 'Archives',
      'sideWebinfo': 'Site Info',
      'webinfoArticles': 'Posts:',
      'webinfoRuntime': 'Running for:',
      'webinfoWordcount': 'Total words:',
      'webinfoVisitors': 'Visitors:',
      'webinfoViews': 'Page views:',
      'webinfoLastActivity': 'Last activity:',
      'unitPosts': 'posts',
      'unitDays': 'days',
      'unitWords': 'words',
      'unitPeople': 'visitors',
      'unitViews': 'views',
      'unitDate': 'days',
      'recommendedArticles': 'Recommended Articles',
      'readMore': 'Read More',
      'prevPage': 'Prev',
      'nextPage': 'Next',
      'lastArticleLabel': 'Previous:',
      'nextArticleLabel': 'Next:',
      'articleCategories': 'Article Categories',
      'articleTags': 'Article Tags',
      'category': 'Category',
      'tag': 'Tag',
      'categoryLabel': 'Category: ',
      'publishedInLabel': 'Published on: ',
      'wordcountLabel': 'Words: ',
      'min2readLabel': 'Reading time: ',
      'readingLabel': 'Views: ',
      'unitMin': 'min',
      'footerTotalVisitsLabel': 'Total visits: ',
      'footerVisitorsLabel': 'Visitors: '
    }
  };

  function normalizeLanguage(language) {
    return language === 'en' ? 'en' : 'zh';
  }

  function getStoredLanguage() {
    try {
      return normalizeLanguage(localStorage.getItem(STORAGE_KEY) || defaultLanguage);
    } catch (error) {
      return defaultLanguage;
    }
  }

  function storeLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {}
  }

  function getLabel(language, key) {
    return (labels[language] && labels[language][key]) || labels.zh[key] || '';
  }

  function applyAttribute(language, selector, attributeName) {
    document.querySelectorAll(selector).forEach(function (element) {
      var key = element.getAttribute(selector.slice(1, -1));
      var value = getLabel(language, key);
      if (value) {
        element.setAttribute(attributeName, value);
      }
    });
  }

  function applyLanguage(language, shouldStore) {
    language = normalizeLanguage(language);

    document.documentElement.setAttribute('lang', language === 'en' ? 'en' : 'zh-CN');
    document.documentElement.setAttribute('data-ui-lang', language);

    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      var value = getLabel(language, element.getAttribute('data-i18n'));
      if (value) {
        element.textContent = value;
      }
    });

    applyAttribute(language, '[data-i18n-title]', 'title');
    applyAttribute(language, '[data-i18n-placeholder]', 'placeholder');
    applyAttribute(language, '[data-i18n-aria-label]', 'aria-label');

    document.querySelectorAll('[data-ui-lang-toggle]').forEach(function (button) {
      var nextLanguage = language === 'en' ? 'zh' : 'en';
      var label = language === 'en' ? '中' : 'EN';
      var targetLabel = getLabel(language, 'toggleTo');
      var textElement = button.querySelector('[data-ui-lang-toggle-label]');

      button.setAttribute('data-current-lang', language);
      button.setAttribute('data-next-lang', nextLanguage);
      button.setAttribute('title', targetLabel);
      button.setAttribute('aria-label', targetLabel);

      if (textElement) {
        textElement.textContent = label;
      } else {
        button.textContent = label;
      }
    });

    if (shouldStore) {
      storeLanguage(language);
    }
  }

  function initLanguage() {
    applyLanguage(getStoredLanguage(), false);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-ui-lang-toggle]');
    if (!button) {
      return;
    }

    event.preventDefault();
    applyLanguage(button.getAttribute('data-next-lang') || 'en', true);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }

  document.addEventListener('pjax:complete', initLanguage);

  window.BlogUiI18n = {
    apply: applyLanguage,
    getLanguage: getStoredLanguage
  };
})();
