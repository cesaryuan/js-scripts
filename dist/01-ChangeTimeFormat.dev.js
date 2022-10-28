"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// ==UserScript==
// @name         转换网页时间形式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将网页上的时间转化为更加友好的形式，提供自动触发和手动触发两种方式（有的网页会自动刷新）
// @author       You
// @update       2022-05-09 1.改进配置形式 2.新增dopus网站支持 3.右下角添加手动触发按钮
// @include      /^https?://(www\.)?(voidtools|stackoverflow|github|resource.dopus)\.\w+/.*$/
// @icon         https://www.google.com/s2/favicons?domain=voidtools.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function () {
  "use strict"; // 所有函数返回一个数组

  var CONFIG = {
    webConfig: {
      "www.voidtools.com": {
        "viewtopic.php": function viewtopicPhp() {
          var items = [].concat(_toConsumableArray(document.querySelectorAll(".author").lastChild), _toConsumableArray(document.querySelectorAll(".profile-joined").lastChild));
          items.forEach(function (item) {
            item.textContent = formatDate(item.textContent.trim());
          });
        }
      },
      "stackoverflow.com": {
        "questions/\\d": function questionsD() {
          Array.from(document.querySelectorAll(".relativetime")).forEach(function (ele) {
            ele.textContent = formatDate(ele.title);
          });
          Array.from(document.querySelectorAll(".relativetime-clean")).forEach(function (ele) {
            ele.textContent = formatDate(ele.title.substring(0, 20));
          });
        }
      },
      "github.com": {
        ".": function _() {
          Array.from(document.querySelectorAll("relative-time")).forEach(function (ele) {
            ele.textContent = formatDate(ele.getAttribute("datetime"));
          });
        }
      },
      "softoroom.net": {
        "net/topic": function netTopic() {
          Array.from(document.querySelectorAll("time")).forEach(function (ele) {
            ele.textContent = formatDate(ele.getAttribute("datetime"));
          });
        }
      },
      "resource.dopus.com": {
        "/t": function t() {
          Array.from(document.querySelectorAll(".relative-date")).forEach(function (ele) {
            ele.textContent = formatDate(ele.getAttribute("data-time"));
          });
        }
      }
    }
  };
  var host = window.location.host;
  var matchConfig = CONFIG.webConfig[host];
  main();
  addButtonToRightBottom("转换时间", main);
  observeElement(document.body, main);

  function main() {
    console.log("@Cesaryuan 转换网页时间形式开始运行");
    var href = window.location.href;

    if (matchConfig) {
      for (var key in matchConfig) {
        if (href.match(key)) {
          var functionA = matchConfig[key];
          functionA();
          break;
        }
      }
    }
  }

  function formatDate(dateText) {
    // let dateText = dateElement.textContent.trim();
    var date = new Date(dateText);

    if (/^\d{10,13}$/.test(dateText)) {
      date = new Date(parseInt(dateText));
    } // dateElement.textContent = dateElement.textContent.replace(dateText, date.toLocaleString());


    return toFriendlyDate(date);
  }

  function toFriendlyDate(date) {
    var now = new Date();
    var diff = now.getTime() - date.getTime();
    var day = 1000 * 60 * 60 * 24;
    var hour = 1000 * 60 * 60;
    var minute = 1000 * 60;
    var second = 1000;
    var dayDiff = Math.floor(diff / day);
    var hourDiff = Math.floor(diff % day / hour);
    var minuteDiff = Math.floor(diff % hour / minute);
    var secondDiff = Math.floor(diff % minute / second);
    var result = "";

    if (dayDiff > 0 && dayDiff <= 365) {
      result = dayDiff + "天前";
    } else if (dayDiff > 365) {
      result = date.toLocaleString();
    } else if (hourDiff > 0) {
      result = hourDiff + "小时前";
    } else if (minuteDiff > 0) {
      result = minuteDiff + "分钟前";
    } else if (secondDiff > 0) {
      result = secondDiff + "秒前";
    }

    return result;
  }

  function addButtonToRightBottom(text, onclick) {
    var button = document.createElement("button");
    button.innerText = text;
    button.onclick = onclick;
    button.style.cssText = "\n            position: fixed;\n            bottom: 0;\n            right: 0;\n            background-color: #f1f1f1;\n            border: none;\n            padding: 5px 10px;\n            border-radius: 5px 0 0 5px;\n            cursor: pointer;\n            font-size: 16px;\n            font-weight: bold;\n            color: #000;\n            z-index: 9999;\n        ";
    document.body.appendChild(button);
  }

  function observeElement(element, callback) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          if (callback()) {
            disconnect();
          }
        }
      });
    });
    var disconnect = observer.disconnect;
    observer.observe(element, {
      childList: true,
      subtree: true
    });
  }
})();