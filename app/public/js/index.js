(function(win, doc) {
  const getById = function(el) {
    return doc.getElementById(el);
  };

    // from qwrap
  const getDocRect = function(doc) {
    doc = doc || document;
    let win = doc.defaultView || doc.parentWindow,
      mode = doc.compatMode,
      root = doc.documentElement,
      h = win.innerHeight || 0,
      w = win.innerWidth || 0,
      scrollX = win.pageXOffset || 0,
      scrollY = win.pageYOffset || 0,
      scrollW = root.scrollWidth,
      scrollH = root.scrollHeight;
    if (mode !== 'CSS1Compat') { // Quirks
      root = doc.body;
      scrollW = root.scrollWidth;
      scrollH = root.scrollHeight;
    }
    if (mode) { // IE, Gecko
      w = root.clientWidth;
      h = root.clientHeight;
    }
    scrollW = Math.max(scrollW, w);
    scrollH = Math.max(scrollH, h);
    scrollX = Math.max(scrollX, doc.documentElement.scrollLeft, doc.body.scrollLeft);
    scrollY = Math.max(scrollY, doc.documentElement.scrollTop, doc.body.scrollTop);
    return {
      width: w,
      height: h,
      scrollWidth: scrollW,
      scrollHeight: scrollH,
      scrollX,
      scrollY,
    };
  };

  const getXY = function(node) {
    let doc = node.ownerDocument,
      docRect = getDocRect(doc),
      scrollLeft = docRect.scrollX,
      scrollTop = docRect.scrollY,
      box = node.getBoundingClientRect(),
      xy = [ box.left, box.top ];
    if (scrollTop || scrollLeft) {
      xy[0] += scrollLeft;
      xy[1] += scrollTop;
    }
    return xy;
  };

  const getRect = function(el) {
    const p = getXY(el);
    const x = p[0];
    const y = p[1];
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    return {
      width: w,
      height: h,
      left: x,
      top: y,
      bottom: y + h,
      right: x + w,
    };
  };

    /**
     * load comment
     * @return {[type]} [description]
     */
  const loadComment = function() {
    const comments = getById('comments');
    if (!comments) {
      return;
    }
    const load = function() {
      const dataType = comments.getAttribute('data-type');
      if (dataType === 'disqus') {
        loadDisqusComment();
      } else if (dataType === 'duoshuo') {
        loadDuoshuoComment();
      } else if (dataType === 'changyan') {
        loadChangyanComment();
      } else if (dataType === 'netease') {
        loadNeteaseComment();
      }
    };

    if (location.hash.indexOf('#comments') > -1) {
      load();
    } else {
      var timer = setInterval(function() {
        const docRect = getDocRect();
        const currentTop = docRect.scrollY + docRect.height;
        const elTop = getRect(comments).top;
        if (Math.abs(elTop - currentTop) < 1000) {
          load();
          clearInterval(timer);
        }
      }, 300);
    }
  };
    /**
     * load disqus comment
     * @return {[type]} [description]
     */
  var loadDisqusComment = function() {
    const disqus_thread = getById('disqus_thread');
    if (!disqus_thread) {
      return;
    }
    win.disqus_config = function() {
      this.page.url = disqus_thread.getAttribute('data-url');
      this.page.identifier = disqus_thread.getAttribute('data-identifier');
    };
    const s = doc.createElement('script');
    s.src = '//' + disqus_thread.getAttribute('data-name') + '.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (doc.head || doc.body).appendChild(s);
  };

  var loadDuoshuoComment = function() {
    const disqus_thread = getById('ds_thread');
    if (!disqus_thread) {
      return;
    }
    win.duoshuoQuery = { short_name: disqus_thread.getAttribute('data-name') };
    const s = doc.createElement('script');
    s.src = '//static.duoshuo.com/embed.js';
    (doc.head || doc.body).appendChild(s);
  };

  var loadChangyanComment = function() {
    const disqus_thread = getById('SOHUCS');
    if (!disqus_thread) { return; }
    const appid = disqus_thread.getAttribute('data-name');
    const conf = disqus_thread.getAttribute('sid');
    const width = win.innerWidth || doc.documentElement.clientWidth;
    const s = doc.createElement('script');
    if (width < 960) {
      s.id = 'changyan_mobile_js';
      s.src = '//changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf;
    } else {
      s.src = '//changyan.sohu.com/upload/changyan.js';
      s.onload = function() {
        win.changyan.api.config({ appid, conf });
      };
    }
    (doc.head || doc.body).appendChild(s);
  };

  var loadNeteaseComment = function() {
    const disqus_thread = getById('cloud-tie-wrapper');
    if (!disqus_thread) {
      return;
    }
    win.cloudTieConfig = {
      url: getById('comments').getAttribute('data-url'),
      sourceId: '',
      productKey: disqus_thread.getAttribute('data-name'),
      target: disqus_thread.className,
    };
    const s = doc.createElement('script');
    s.src = 'https://img1.cache.netease.com/f2e/tie/yun/sdk/loader.js';
    (doc.head || doc.body).appendChild(s);
  };
  win.addEventListener('load', function() {
    loadComment();
  });


  const utils = {
    isMob: (function() {
      const ua = navigator.userAgent.toLowerCase();
      const agents = [ 'Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod' ];
      let result = false;
      for (let i = 0; i < agents.length; i++) {
        if (ua.indexOf(agents[i].toLowerCase()) > -1) {
          result = true;
        }
      }
      return result;
    })(),
  };


  if (utils.isMob) {
    doc.documentElement.className += ' mob';
  } else {
    doc.documentElement.className += ' pc';
  }


  const Dom = {
    $sidebar: doc.querySelector('#sidebar'),
    $main: doc.querySelector('#main'),
    $sidebar_mask: doc.querySelector('#sidebar-mask'),
    $body: doc.body,
    $btn_side: doc.querySelector('#header .btn-bar'),
    $article: doc.querySelectorAll('.mob #page-index article'),
  };

  Dom.bindEvent = function() {

    let _this = this,
      body_class_name = 'side',
      eventFirst = 'click',
      eventSecond = 'click';

    if (utils.isMob) {
      eventFirst = 'touchstart';
      eventSecond = 'touchend';
    }

    this.$btn_side.addEventListener(eventSecond, function() {

      if (_this.$body.className.indexOf(body_class_name) > -1) {
        _this.$body.className = _this.$body.className.replace(body_class_name, '');
        _this.$sidebar_mask.style.display = 'none';
      } else {
        _this.$body.className += (' ' + body_class_name);
        _this.$sidebar_mask.style.display = 'block';
      }

    }, false);

    this.$sidebar_mask.addEventListener(eventFirst, function(e) {
      _this.$body.className = _this.$body.className.replace(body_class_name, '');
      _this.$sidebar_mask.style.display = 'none';
      e.preventDefault();
    }, false);


    win.addEventListener('resize', function() {
      _this.$body.className = _this.$body.className.replace(body_class_name, '');
      _this.$sidebar_mask.style.display = 'none';
    }, false);
  };

  Dom.bindEvent();

  /**
     *  Image Lazy Load
     */
  win.addEventListener('load', lazyLoad);
  win.addEventListener('scroll', lazyLoad);
  win.addEventListener('resize', lazyLoad);

  function lazyLoad() {
    const lazyLoadImages = doc.getElementsByClassName('lazy-load');

    if (lazyLoadImages.length === 0) {
      win.removeEventListener('load', lazyLoad);
      win.removeEventListener('scroll', lazyLoad);
      win.removeEventListener('resize', lazyLoad);
    } else {
      for (let i = lazyLoadImages.length - 1; i > -1; i--) {
        const img = lazyLoadImages[i];
        if (lazyLoadShouldAppear(img, 300)) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.classList.remove('lazy-load');
        }
      }
    }
  }

  function lazyLoadShouldAppear(el, buffer) {
    return el.offsetTop - (
      (doc.scrollingElement || doc.documentElement).scrollTop + (win.innerHeight || doc.documentElement.clientHeight)
    ) < buffer;
  }


  // 琛屽彿鍜岄珮浜澶勭悊 @xuexb
  var hljs = {
    $code: doc.querySelectorAll('pre code'),
    hasClass(ele, cls) {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass(ele, cls) {
      if (!hljs.hasClass(ele, cls)) {
        ele.className += ' ' + cls;
      }
    },
    removeClass(ele, cls) {
      if (hljs.hasClass(ele, cls)) {
        ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ');
      }
    },
  };

    /**
     * 浣跨敤鏁版嵁鐢熸垚hash
     *
     * @param  {Object} data 鏁版嵁
     * @param {number} data.index 浠ｇ爜鍧椾綅缃�, 浠�1寮€濮�
     * @param {number} data.start 琛屽彿寮€濮�
     * @param {number} data.end 琛屽彿缁撴潫
     *
     * @return {string}
     */
  hljs.stringHash = function(data) {
    let hash = '';
    if (data.index > 1) {
      hash += data.index + '-';
    }
    hash += 'L' + data.start;
    if (data.end && data.end > data.start) {
      hash += '-' + 'L' + data.end;
    }
    return hash;
  };

  /**
     * 瑙ｆ瀽hash涓烘暟鎹�
     *
     * @return {Object} {index: 褰撳墠浠ｇ爜鍧椾綅缃�, 浠�1寮€濮�,  start: 琛屽彿寮€濮�,  end: 缁撴潫浣嶇疆}
     */
  hljs.parseHash = function() {
    const parse = location.hash.substr(1).match(/((\d+)-)?L(\d+)(-L(\d+))?/);

    if (!parse) {
      return null;
    }

    return {
      index: parseInt(parse[2], 10) || 1,
      start: parseInt(parse[3], 10) || 1,
      end: parseInt(parse[5], 10) || parseInt(parse[3], 10) || 1,
    };
  };

  /**
     * 鏍囪琛岄鑹插苟璺宠浆
     */
  hljs.mark = function(go) {
    const hash = hljs.parseHash();
    if (!hash || !hljs.$code || !hljs.$code[hash.index - 1]) {
      return;
    }

    const $li = hljs.$code[hash.index - 1].querySelectorAll('li');
    for (let i = hash.start - 1; i < hash.end; i++) {
      if ($li[i]) {
        hljs.addClass($li[i], 'mark');
      }
    }

    // 濡傛灉闇€瑕佸畾浣嶄笖鍏冪礌瀛樺湪
    if (go && $li && $li[0]) {
      setTimeout(function() {
        window.scrollTo(0, getRect($li[0]).top - 50);
      });
    }
  };

  /**
     * 绉婚櫎鎵€鏈夐珮浜鍙�
     */
  hljs.removeMark = function() {
    [].slice.call(doc.querySelectorAll('pre code li.mark')).forEach(function(elem) {
      hljs.removeClass(elem, 'mark');
    });
  };

  /**
     * 鍒濆鍖�
     */
  hljs.init = function() {
    [].slice.call(hljs.$code).forEach(function(elem, i) {
      // 杈撳嚭琛屽彿, -1鏄负浜嗚鏈€鍚庝竴涓崲琛屽拷鐣�
      const lines = elem.innerHTML.split(/\n/).slice(0, -1);
      let html = lines.map(function(item, index) {
        return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>';
      }).join('');
      html = '<ul>' + html + '</ul>';

      // 杈撳嚭璇█
      if (lines.length > 3 && elem.className.match(/lang-(\w+)/) && RegExp.$1 !== 'undefined') {
        html += '<b class="name">' + RegExp.$1 + '</b>';
      }

      elem.innerHTML = html;

      hljs.addClass(elem, 'firekylin-code');

      // 缁戝畾鐐瑰嚮楂樹寒琛屼簨浠�
      elem.addEventListener('click', function(event) {
        // 灏忓皬鐨勫鎵�
        if (!event.target || !hljs.hasClass(event.target, 'line-num')) {
          return;
        }

        // 濡傛灉鏄尯闂�
        if (event.shiftKey) {
          const hash = hljs.parseHash();
          hash.newIndex = i + 1;
          hash.current = event.target.getAttribute('data-line');
          if (hash.index !== hash.newIndex - 0) {
            hash.index = hash.newIndex;
            hash.start = hash.current;
            hash.end = 0;
          } else {
            if (hash.current > hash.start) {
              hash.end = hash.current;
            } else {
              hash.end = hash.start;
              hash.start = hash.current;
            }
          }
          location.hash = hljs.stringHash(hash);
        } else {
          location.hash = hljs.stringHash({
            index: i + 1,
            start: event.target.getAttribute('data-line'),
          });
        }
      });
    });
  };

  hljs.init();
  win.addEventListener('load', function() {
    hljs.mark(true);
  });
  win.addEventListener('hashchange', function() {
    hljs.removeMark();
    hljs.mark();
  });

})(window, document);
