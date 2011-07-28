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
  // User Options start
  var AutoPagerize = true; // true or false

  // User Options end

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

  installScrollListener();

})()
