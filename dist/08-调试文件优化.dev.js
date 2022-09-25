"use strict";

// ==UserScript==
// @name         调试文件优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  优化Quicker原版调试文件体验
// @author       Cesaryuan
// @match        file:///*/quicker_*_log.htm
// @match        https://temp.getquicker.net/*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      http://code.jquery.com/color/jquery.color-2.1.2.min.js
// @grant        none
// @license      MIT
// ==/UserScript==
(function () {
  "use strict"; // queryByXpath

  function queryByXpath(xpath, root) {
    var xpathResult = document.evaluate(xpath, root || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var result = [];

    for (var i = 0, len = xpathResult.snapshotLength; i < len; ++i) {
      result.push(xpathResult.snapshotItem(i));
    }

    return result;
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = queryByXpath("//div[@class='step-header' and ../div[@class='step-content']/div[@title and contains(@class, 'message') and contains(text(), '已禁用')]]")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var stepHeader = _step.value;
      // add class quicker-forbid and quicker-light
      stepHeader.classList.add("quicker-forbid");
      stepHeader.classList.add("quicker-light");
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = queryByXpath("//div[@class='step-header' and ../div[@class='step-content']/div[@title and contains(@class, 'message') and contains(text(), '不符合条件，跳过。')]]")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _stepHeader = _step2.value;

      // add class quicker-forbid
      _stepHeader.classList.add("quicker-skiped-if");

      _stepHeader.classList.add("quicker-light");
    } // 出错步骤

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  $("div.message-warning:contains(出错)").parents(".step-content").prev(".step-header").addClass("quicker-warn-step"); // 出错步骤

  $("div.sys_stop:contains(标记为出错：1)").parents(".step-content").prev(".step-header").addClass("quicker-warn-step"); // 注释步骤

  $("div.sys_comment .step-header").addClass("quicker-light"); // 全是注释的步骤

  $("div.sys_group > .step-content > .step-group").each(function () {
    if ($(this).children(".sys_comment").length === $(this).children().length) {
      $(this).parent(".step-content").prev(".step-header").addClass("quicker-light").addClass("quicker-comment-sys-group");
    }
  }); // 没有输出的赋值步骤

  $("div.sys_assign > div.step-content .message:contains(赋值模块未定义输出)").parent(".step-content").prev(".step-header").addClass("quicker-no-output-assign").addClass("quicker-light"); //inject css text

  var css = "\n  .step-input:hover, .step-output:hover {\n    max-height: 3em;\n    overflow: hidden;\n}\n  .collapsed .quicker-warn-step {\n    background-color: #ffdada !important;\n  }\n  .quicker-warn-step {\n    background-color: #fff4f4 !important;\n  }\n\n  .quicker-light {\n    background-color: #f8f8f8 !important;\n  }\n  .quicker-forbid > *{\n    text-decoration: line-through !important;\n  }\n  .quicker-forbid::after {\n      content: '\u5DF2\u7981\u7528';\n      color: #a0a0a0\n  }\n  .quicker-skiped-if::after {\n      content: '\u4E0D\u7B26\u5408\u6761\u4EF6';\n      color: #a0a0a0\n  }\n  .quicker-skiped-if *, .quicker-forbid *  {\n      /* text-decoration: line-through 0.01em; */\n  }\n  .quicker-comment-sys-group::after {\n    content: '\u5168\u662F\u6CE8\u91CA';\n  }\n  .quicker-no-output-assign::after {\n    content: ' \u6CA1\u6709\u8F93\u51FA';\n  }\n          ";
  var style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
})();