// ==UserScript==
// @name G+.mine.user.js
// @author suVene
// @version 0.1.0
// @namespace https://github.com/suvene/G+.mine.user.js
// @description GooglePlus custmize for mine
// @include https://plus.google.com/*
// @match https://plus.google.com/*
// ==/UserScript==

(function() {
  // User Options start//{{{
  var AutoPagerize = true; // true or false
  var ChangeStreamToCircleURL = 'p3e7365738fdd6b26';
  // User Options end//}}}

  var itemKeymap = {
    'E': function(e) {
      click(tools(e.target)[2]);
      return true;
    }
  };

  // utilities start//{{{
  function invokeMouseEvent(elem, evname) {
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent(evname, true, true, e.view||window, 0, 0, 0, 0, 0,
      false, false, false, false, 0, null);
    elem.dispatchEvent(e);
  }

  function click(elem) {
    invokeMouseEvent(elem, 'click');
  }

  function mousedown(elem) {
    invokeMouseEvent(elem, 'mousedown');
  }

  function mouseup(elem) {
    invokeMouseEvent(elem, 'mouseup');
  }

  var stack = "";
  var timer = 0;
  function handleKeys(e, m) {
    var c = String.fromCharCode(e.which ? e.which :
        e.keyCode ? e.keyCode : e.charCode);
    stack += c;
    var u = 0;
    for (var k in m) {
      if (k == stack) {
        e.preventDefault();
        var f = m[stack];
        if (f) {
          stack = "";
          if (f(e)) return true;
        }
        return false;
      } else if (k.substring(0, stack.length) == stack) {
        u++;
      }
    }
    try { clearTimeout(timer) } catch(ee) {};
    if (u) {
      e.preventDefault();
      timer = setTimeout(function() {
        var f = m[stack];
        stack = "";
        if (f) f(e);
      }, 2000);
    } else {
      stack = "";
    }
  }

  function hasClass(elem, clazz) {
    var zz = elem.className.split(/\s+/g);
    for (var m = 0; m < zz.length; m++) {
      if (zz[m] == clazz) return true;
    }
    return false;
  }

  function getElementsByTagAndClassName(tag, clazz, node) {
    var retval = [];
    var elems = (node || document).getElementsByTagName(tag);
    for (var i = 0, I = elems.length; i < I; ++i) {
      var e = elems[i];
      if (hasClass(e, clazz)) {
        retval.push(e);
      }
    }
    return retval;
  }

  function findElement(elem, matcher) {
    if (matcher(elem)) {
      return elem;
    }
    for (var child = elem.firstChild; child; child = child.nextSibling) {
      var found = findElement(child, matcher);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  function findElementFromNext(elem, matcher) {
    for (var curr = elem.nextSibling; curr; curr = curr.nextSibling) {
      var found = findElement(curr, matcher);
      if (found) {
        return found;
      }
    }
    if (elem.parentNode) {
      return findElementFromNext(elem.parentNode, matcher);
    } else {
      return undefined;
    }
  }

  function findCancelElement(elem) {
    return findElementFromNext(elem, function(e) {
      return e.id && e.id.match(/\.c(ancel)?$/);
    });
  }

  function findSubmitElement(elem) {
    return findElementFromNext(elem, function(e) {
      return e.id && e.id.match(/\.post?$/);
    });
  }
  // utilities functinos start//}}}

  // private functions start//{{{
  function installItemKeys(elem) {
    elem.addEventListener('keypress', function(e) {
      if (e.target.id.substring(0, 7) != 'update-') return;
      return handleKeys(e, itemKeymap);
    }, false)
    elem.className += ' gpcommander';
  }

  function installEvernoteClip(elem) {
    var ns = tools(elem);
    var url = getPermalinks(elem);
    var ln = ns[ns.length - 1];
    var n = document.createTextNode('  -  ');
    ln.parentNode.appendChild(n);
    // n = document.createElement('span');
    // n.appendChild(document.createTextNode('ClipEver'));
    n = document.createElement('img');
    n.setAttribute('src', 'http://static.evernote.com/article-clipper.png');
    n.setAttribute('class', 'd-h');
    n.setAttribute('role', 'button');
    n.setAttribute('tabindex', '0');
    n.setAttribute('onclick', "Evernote.doClip({styling: 'full', url: '" + url + "', code: '____2531', contentId: '" + elem.id + "'})");
    ln.parentNode.appendChild(n);
  }

  function tools(elem) {
    var ret = [];
    var elems = elem.getElementsByTagName('button');
    for (var n = 0; n < elems.length; n++) {
      if (elems[n].getAttribute('g:type') == 'plusone') {
        var next = elems[n];
        while (next) {
          if (next.nodeType == 1 && next.getAttribute('role') == 'button')
            ret.push(next);
          next = next.nextSibling;
        }
      }
    }
    return ret;
  }

  function expand(elem) {
    var elems = elem.getElementsByTagName('span');
    for (var n = 0; n < elems.length; n++) {
      if (elems[n].getAttribute('role') == 'button' && elems[n].getAttribute('class').match('a-b-f-i-gc')) {
        click(elems[n]);
      }
    }
  }

  function getPermalinks(elem) {
    var ret = [];
    var elems = elem.getElementsByTagName('a');
    for (var n = 0; n < elems.length; n++) {
      if (elems[n].getAttribute('href').match('/posts/')) {
        ret.push(elems[n]);
      }
      // how gets the child permalinks ?
    }
    return ret;
  }
  // private functions end//}}}

  // events start//{{{
  function doInitial() {
    var n = document.createElement('script');
    n.setAttribute('type', 'text/javascript');
    n.setAttribute('src', 'http://static.evernote.com/noteit.js');
    document.getElementsByTagName('head')[0].appendChild(n);
  }

  function installScrollListener() {
    window.addEventListener('scroll', function() {
      if (AutoPagerize) {
        var b = parseInt((window.scrollY + window.innerHeight) / document.height + 0.1);
        if (b) {
          click(document.getElementsByClassName('a-f-zd-gb-h')[0]);
        }
      }
    }, false);
  }

  function install() {
    var elems = document.getElementsByTagName('div');
    for (var n = 0; n < elems.length; n++) {
      var e = elems[n];
      if (e.id.substring(0, 7) == 'update-' && !hasClass(e, 'gpcommander')) {
        installItemKeys(e);
        installEvernoteClip(e);
      }
    }
  }
  // events end//}}}

  doInitial();
  installScrollListener();
  window.setInterval(install, 1000);

})()
// vim: set fdm=marker sw=2 ts=2 sts=0 et:
